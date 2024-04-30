import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Contact, Introduction, User } from "@prisma/client";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import IntroListTabs from "@/app/dashboard/introductions/list/IntroListTabs";
import { IntroStates } from "@/lib/introStates";
import ScopeMissingMessage from "@/app/dashboard/home/ScopeMissingMessage";

export type IntroWithContactFacilitatorAndRequester = Introduction & {
  contact: Contact;
  facilitator: User;
  requester: User;
};

export default async function IntroductionsRequested({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const query = searchParams?.query || undefined;
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 10;
  const recordsToSkip = (currentPage - 1) * itemsPerPage;

  const introsSent: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        requesterId: user.id,
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: recordsToSkip,
      take: itemsPerPage,
    });
  const introsReceived: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        facilitatorId: user.id,
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: recordsToSkip,
      take: itemsPerPage,
    });

  const pendingApprovalCount = await prisma.introduction.count({
    where: {
      facilitatorId: user.id,
      status: IntroStates["pending approval"],
    },
  });

  const pendingCreditsCount = await prisma.introduction.count({
    where: {
      requesterId: user.id,
      status: IntroStates["pending credits"],
    },
  });

  let emails = [
    ...new Set(
      introsSent.concat(introsReceived).reduce<string[]>((acc, intro) => {
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
    <div className={"flex flex-col gap-4 mt-4"}>
      <ScopeMissingMessage />
      <IntroListTabs
        introsSent={introsSent}
        pendingCreditsCount={pendingCreditsCount}
        introsReceived={introsReceived}
        pendingApprovalCount={pendingApprovalCount}
        user={user}
        emailToProfile={emailToProfile}
        companyUrlToProfile={companyUrlToProfile}
      />
    </div>
  );
}
