import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Contact, Introduction, User } from "@prisma/client";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import IntroListTabs from "@/app/dashboard/introductions/list/IntroListTabs";

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
    <>
      <IntroListTabs
        introsSent={introsSent}
        introsReceived={introsReceived}
        user={user}
        emailToProfile={emailToProfile}
        companyUrlToProfile={companyUrlToProfile}
      />
    </>
  );
}
