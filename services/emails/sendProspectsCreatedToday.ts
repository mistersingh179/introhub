import prisma from "@/prismaClient";
import getProspectsBasedOnFilters, {
  PaginatedValues,
  SelectedFilterValues,
} from "@/services/getProspectsBasedOnFilters";
import { startOfToday, subDays } from "date-fns";
import sendEmail, { systemEmail } from "@/services/emails/sendEmail";
import prepareProspectsData from "@/services/prepareProspectsData";
import { getNewProspectsHtml } from "@/email-templates/NewProspects";
import { Contact } from "@prisma/client";

export type SendProspectsCreatedTodayOutput = Contact[];
type SendProspectsCreatedToday = () => Promise<SendProspectsCreatedTodayOutput>;

const sendProspectsCreatedToday: SendProspectsCreatedToday = async () => {
  const user = await prisma.user.findFirstOrThrow();
  const nonExistentUser = { ...user, id: "-1" };

  const createdAfter = subDays(startOfToday(), 1);
  const filters: SelectedFilterValues = {
    createdAfter: createdAfter.toISOString(),
  };
  const paginationValues: PaginatedValues = {
    currentPage: 1,
    itemsPerPage: Number.MAX_SAFE_INTEGER,
    recordsToSkip: 0,
  };
  const { prospects, filteredRecordsCount } = await getProspectsBasedOnFilters(
    filters,
    paginationValues,
    nonExistentUser,
  );

  // if(prospects.length == 0){
  //   console.log("aborting as no new prospects: ", filters);
  //   return
  // }

  const { prospectsWithUser, emailToProfile, companyUrlToProfile } =
    await prepareProspectsData(prospects);

  const html = getNewProspectsHtml(
    prospectsWithUser,
    emailToProfile,
    companyUrlToProfile,
    createdAfter,
  );
  console.log("html: ", html);

  const systemAccount = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        email: systemEmail,
      },
    },
  });
  const count = prospectsWithUser.length;
  const response = await sendEmail({
    account: systemAccount,
    body: html,
    from: systemEmail,
    to: "rod@introhub.net",
    cc: "",
    subject: `${count} New Prospect${count == 1 ? "" : "s"}`,
  });

  console.log(response);
  return prospects;
};

export default sendProspectsCreatedToday;

if (require.main === module) {
  (async () => {
    const prospects = await sendProspectsCreatedToday();
    console.log("prospects: ", prospects);
    process.exit(0);
  })();
}
