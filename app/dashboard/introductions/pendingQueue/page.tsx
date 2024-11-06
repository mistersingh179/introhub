import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Contact, Introduction, User } from "@prisma/client";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import ScopeMissingMessage from "@/app/dashboard/home/ScopeMissingMessage";
import { subDays } from "date-fns";
import IntroTable from "@/app/dashboard/introductions/list/IntroTable";

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
        requesterId: user.id,
        approvedAt: {
          gte: subDays(now, 7),
        },
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

        <IntroTable
          introductions={recentIntros}
          user={user}
          emailToProfile={emailToProfile}
          companyUrlToProfile={companyUrlToProfile}
          showPagination={false}
        />
      </div>
    </>
  );
}
