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
        <div className={"mx-2 my-4"}>
          <h1 className={"text-2xl mb-4"}>
            Intros Pending on 7-Day Review Period
          </h1>
          <h2 className={"text-xl mb-3"}>
            Manage or Let Them Proceed
          </h2>
          <p className={"my-4"}>
            These intro requests are on hold for seven days. During this time, you can 
            review and cancel any that aren't needed. If no action is taken, the prospect 
            will be emailed at the end of the hold period to confirm if they want to 
            proceed with the introduction.
          </p>
        </div>
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
