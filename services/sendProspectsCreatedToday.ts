import prisma from "@/prismaClient";
import getProspectsBasedOnFilters, {
  PaginatedValues,
  SelectedFilterValues,
} from "@/services/getProspectsBasedOnFilters";
import { startOfToday, subDays } from "date-fns";
import sendEmail from "@/services/sendEmail";
import prepareProspectsData from "@/services/prepareProspectsData";
import { getNewProspectsHtml } from "@/email-templates/NewProspects";

const sendProspectsCreatedToday = async () => {
  const user = await prisma.user.findFirstOrThrow();
  const nonExistentUser = { ...user, id: "-1" };

  const createdAfter = subDays(startOfToday(), 10);
  const filters: SelectedFilterValues = {
    createdAfter: createdAfter.toISOString(),
  };
  const paginationValues: PaginatedValues = {
    currentPage: 1,
    itemsPerPage: Number.MAX_SAFE_INTEGER,
    recordsToSkip: 0,
  };
  const prospects = await getProspectsBasedOnFilters(
    filters,
    paginationValues,
    nonExistentUser,
  );

  if(prospects.length == 0){
    console.log("aborting as no new prospects: ", filters);
  }

  const { prospectsWithUser, emailToProfile, companyUrlToProfile } =
    await prepareProspectsData(prospects);

  const systemEmail = "sandeep@introhub.net";
  const systemAccount = await prisma.account.findFirstOrThrow({
    where: {
      user: {
        email: systemEmail,
      },
    },
  });

  console.log("*** createdAfter: ", createdAfter);
  const html = getNewProspectsHtml(
    prospectsWithUser,
    emailToProfile,
    companyUrlToProfile,
    createdAfter,
  );
  console.log("html: ", html);

  const count = prospectsWithUser.length;
  const response = await sendEmail({
    account: systemAccount,
    body: html,
    from: systemEmail,
    to: "rod@introhub.net",
    cc: "sandeep@introhub.net",
    subject: `${count} New Prospect${count > 1 ? "s" : ""}`,
  });

  console.log(response);
};

export default sendProspectsCreatedToday;

if (require.main === module) {
  (async () => {
    const prospects = await sendProspectsCreatedToday();
    console.log("prospects: ", prospects);
    process.exit(0);
  })();
}
