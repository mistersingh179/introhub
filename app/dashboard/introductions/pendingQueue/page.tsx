import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Contact, Introduction, User } from "@prisma/client";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import ScopeMissingMessage from "@/app/dashboard/home/ScopeMissingMessage";
import { subDays } from "date-fns";
import IntroTable from "@/app/dashboard/introductions/list/IntroTable";
import Typography from "@/components/Typography";
import { IntroStates } from "@/lib/introStates";

export type IntroWithContactFacilitatorAndRequester = Introduction & {
  contact: Contact;
  facilitator: User;
  requester: User;
};

export default async function PendingQueue() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const now = new Date();
  const recentIntros: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        facilitatorId: user.id,
        createdAt: {
          gte: subDays(now, 7),
        },
        status: IntroStates["pending approval"],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  let emails = [
    ...new Set(
      recentIntros.reduce<string[]>((acc, intro) => {
        acc.push(intro.contact.email);
        acc.push(intro.requester.email!);
        acc.push(intro.facilitator.email!);
        return acc;
      }, []),
    ),
  ];

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <>
      <div className={"flex flex-col gap-4 mt-4"}>
        <ScopeMissingMessage />

        <Typography
          variant={"p"}
          className={"my-4 mx-2 text-center"}
        >
          The following introductions have been auto-generated and are currently
          in a <span className={"font-semibold"}>7-day hold</span> period. As
          the facilitator, you may review and cancel any introductions during
          this time. If no action is taken, the prospect will be emailed at the
          end of the hold period to confirm if they want to proceed with the
          introduction.{" "}
          <span className={"font-semibold"}>Only if they accept</span> will the
          introduction be made.
        </Typography>

        <IntroTable
          introductions={recentIntros}
          user={user}
          emailToProfile={emailToProfile}
          companyUrlToProfile={companyUrlToProfile}
          showPagination={false}
          showRequester={true}
          showFacilitator={false}
          showCancel={true}
        />
      </div>
    </>
  );
}
