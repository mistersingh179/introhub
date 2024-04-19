import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Contact, Introduction, User } from "@prisma/client";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import IntroTable from "@/app/dashboard/introductions/list/IntroTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        createdAt: "desc",
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
        createdAt: "desc",
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
      <Tabs defaultValue="received" className={"mt-4"}>
        <TabsList>
          <TabsTrigger value="sent">Intros Sent</TabsTrigger>
          <TabsTrigger value="received">Intros Received</TabsTrigger>
        </TabsList>
        <TabsContent value="sent">
          <IntroTable
            introductions={introsSent}
            user={user}
            emailToProfile={emailToProfile}
            companyUrlToProfile={companyUrlToProfile}
            showRequester={false}
          />
        </TabsContent>
        <TabsContent value="received">
          <IntroTable
            introductions={introsReceived}
            user={user}
            emailToProfile={emailToProfile}
            companyUrlToProfile={companyUrlToProfile}
            showFacilitator={false}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
