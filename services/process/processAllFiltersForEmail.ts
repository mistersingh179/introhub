import prisma from "@/prismaClient";
import getFiltersFromSearchParams from "@/services/getFiltersFromSearchParams";
import { startOfToday, subDays } from "date-fns";
import getProspectsBasedOnFilters, {
  PaginatedValues,
} from "@/services/getProspectsBasedOnFilters";
import prepareProspectsData from "@/services/prepareProspectsData";
import { getNewProspectsHtml } from "@/email-templates/NewProspects";
import sendEmail, { systemEmail } from "@/services/emails/sendEmail";
import { gmail_v1 } from "googleapis";

export type ProcessAllFiltersForEmailOutput = gmail_v1.Schema$Message[];

const processAllFiltersForEmail =
  async (): Promise<ProcessAllFiltersForEmailOutput> => {
    const filters = await prisma.filters.findMany({
      where: {
        dailyEmail: true,
      },
      include: {
        user: true,
      },
    });
    const emailResponses: gmail_v1.Schema$Message[] = [];
    for (const filtersObj of filters) {
      const searchParamsObj = getFiltersFromSearchParams(
        filtersObj.searchParams,
      );
      const createdAfter = subDays(startOfToday(), 1);
      searchParamsObj.createdAfter = createdAfter.toISOString();

      console.log("*** working on filter: ", searchParamsObj);

      const paginationValues: PaginatedValues = {
        currentPage: 1,
        itemsPerPage: Number.MAX_SAFE_INTEGER,
        recordsToSkip: 0,
      };
      const { prospects, filteredRecordsCount } =
        await getProspectsBasedOnFilters(
          searchParamsObj,
          paginationValues,
          filtersObj.user,
        );
      const { prospectsWithUser, emailToProfile, companyUrlToProfile } =
        await prepareProspectsData(prospects);
      const html = getNewProspectsHtml(
        prospectsWithUser,
        emailToProfile,
        companyUrlToProfile,
        createdAfter,
      );

      const systemAccount = await prisma.account.findFirstOrThrow({
        where: {
          user: {
            email: systemEmail,
          },
        },
      });
      const count = prospectsWithUser.length;
      if (count === 0) {
        console.log("skipping filter as no new results: ", filtersObj);
        continue;
      }
      const response = await sendEmail({
        account: systemAccount,
        body: html,
        from: systemEmail,
        to: filtersObj.user.email!,
        cc: "",
        subject: `Filter ${filtersObj.name} has ${count} new prospect${count == 1 ? "" : "s"}`,
      });
      if (response) {
        emailResponses.push(response);
      }
    }
    return emailResponses;
  };

export default processAllFiltersForEmail;

if (require.main === module) {
  (async () => {
    const response = await processAllFiltersForEmail();
    console.log(response);
  })();
}
