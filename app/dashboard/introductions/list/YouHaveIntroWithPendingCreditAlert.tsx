import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Drum } from "lucide-react";
import IntroTable from "@/app/dashboard/introductions/list/IntroTable";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";

const YouHaveIntroWithPendingCreditAlert = async () => {

  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const intro: IntroWithContactFacilitatorAndRequester | null =
    await prisma.introduction.findFirst({
      where: {
        requesterId: user.id,
        status: IntroStates["pending credits"],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 1,
    });

  if (!intro) {
    return <></>;
  }

  const emails = [
    intro.contact.email!,
    intro.facilitator.email!,
    intro.requester.email!,
  ];

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  return (
    <Alert>
      <AlertTitle>
        <div className={"flex flex-row gap-4 items-center"}>
          <Drum className={"w-8 h-8"} />
          Your intro is one step away from going out!
        </div>
      </AlertTitle>
      <AlertDescription>
        <div className={"my-4"}>
          The following introduction you asked for is sitting in a queue and
          waiting for you to earn a credit. When you earn a credit it will be
          emailed out with you {`cc'ed`}.
        </div>
      </AlertDescription>
      <div>
        <IntroTable
          introductions={[intro]}
          user={user}
          emailToProfile={emailToProfile}
          companyUrlToProfile={companyUrlToProfile}
          showRequester={true}
          showFacilitator={false}
          showPagination={false}
          showCaption={false}
          showHeader={false}
        />
      </div>
    </Alert>
  );
};

export default YouHaveIntroWithPendingCreditAlert;
