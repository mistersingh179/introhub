import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Drum } from "lucide-react";
import IntroTable from "@/app/dashboard/introductions/list/IntroTable";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const YouHaveIntroWithPendingCreditAlert = async () => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const pendingCreditIntros: IntroWithContactFacilitatorAndRequester[] =
    await prisma.introduction.findMany({
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
    });

  if (pendingCreditIntros.length === 0) {
    return <></>;
  }

  const emails = [
    ...new Set(
      pendingCreditIntros.reduce<string[]>((acc, intro) => {
        acc.push(intro.contact.email);
        acc.push(intro.requester.email!);
        acc.push(intro.facilitator.email!);
        return acc;
      }, []),
    ),
  ];

  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles(emails);

  const count = pendingCreditIntros.length;

  return (
    <Alert>
      <AlertTitle>
        <div className={"flex flex-row gap-4 items-center"}>
          <Drum className={"w-8 h-8"} />
          {count} Approved Intro{count === 1 ? "" : "s"} Pending Due to Negative
          Credit!
        </div>
      </AlertTitle>
      <AlertDescription>
        <div className={"my-4"}>
          You have {count} intro request{count === 1 ? "" : "s"} approved and
          waiting to be sent. Please approve any intros which need your approval
          to earn credits and restore a positive balance. Once positive, all
          your intros will be sent automatically and you will be {`cc'ed`}.
        </div>
      </AlertDescription>
      <div className={"mx-4"}>
        <Carousel orientation={"horizontal"}>
          <CarouselContent>
            {Array.from({ length: count }).map((_, index) => (
              <CarouselItem
                key={index}
                className={`sm:basis-full ${count >= 2 ? "md:basis-1/2" : ""} 
                  ${count >= 3 ? "lg:basis-1/3" : ""} `}
              >
                <Card>
                  <CardContent className="p-4">
                    <IntroTable
                      introductions={pendingCreditIntros.slice(
                        0 + index,
                        1 + index,
                      )}
                      user={user}
                      emailToProfile={emailToProfile}
                      companyUrlToProfile={companyUrlToProfile}
                      showRequester={false}
                      showFacilitator={false}
                      showPagination={false}
                      showCaption={false}
                      showHeader={false}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious variant={"secondary"} />
          <CarouselNext variant={"secondary"} />
        </Carousel>
      </div>
    </Alert>
  );
};

export default YouHaveIntroWithPendingCreditAlert;
