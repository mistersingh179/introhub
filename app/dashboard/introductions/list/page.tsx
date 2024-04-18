import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Contact, Introduction, User } from "@prisma/client";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import IntroTable from "@/app/dashboard/introductions/list/IntroTable";

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

  const myIntroductions: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
      where: {
        OR: [
          {
            requesterId: {
              equals: user.id,
            },
          },
          {
            facilitatorId: {
              equals: user.id,
            },
          },
        ],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: recordsToSkip,
      take: itemsPerPage,
    });
  console.log("myIntroductions: ", myIntroductions);

  let emails = myIntroductions.reduce<string[]>((acc, intro) => {
    acc.push(intro.contact.email);
    acc.push(intro.requester.email!);
    acc.push(intro.facilitator.email!);
    return acc;
  }, []);

  emails = [...new Set(emails)];

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <>
      <IntroTable
        introductions={myIntroductions}
        user={user}
        emailToProfile={emailToProfile}
        companyUrlToProfile={companyUrlToProfile}
      />
    </>
  );
}
