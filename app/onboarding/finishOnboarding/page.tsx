import * as React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import Image from "next/image";
import healthyNetworkingImage from "@/app/onboarding/finishOnboarding/healthy-networking.png";
import AcceptAutoProspectingForm from "@/app/onboarding/finishOnboarding/AcceptAutoProspectingForm";

const setupIcp = async () => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });

  return (
    <>
      <div className={"flex flex-col lg:flex-row flex-grow"}>
        <div
          className={
            "flex flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-slate-900 p-4 lg:basis-1/2"
          }
        >
          <div className="flex flex-col gap-4 justify-center items-center p-4 2xl:px-10">
            <Image className={'w-1/3'} src={healthyNetworkingImage} alt={"heatlhy networking"}></Image>
            <h1 className="scroll-m-20 text-4xl font-normal tracking-tight lg:text-5xl">
              Healthy Networking
            </h1>
            <h4 className="scroll-m-20 text-xl font-normal tracking-tight">
              Intro requests to the same contacts are limited to once every 90
              days. This ensures {"you're"} not asking the same person over and
              over again.
            </h4>
          </div>
        </div>
        <div
          className={
            "flex flex-col gap-4 justify-center items-center p-4 lg:basis-1/2"
          }
        >
          <div className="flex flex-col gap-4 justify-center items-start p-4 2xl:px-10">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
              {"We're"} Mapping Your Network to Unlock Value
            </h1>
            <p className="text-xl text-muted-foreground">
              {"We're"} identifying people in you network who may benefit from
              an introduction.
            </p>
            <p className="text-xl text-muted-foreground mt-4">
              {"Don't"} worry – {"you're"} in control. Before any introduction
              request is sent from you email, {"you'll"} have 7 days to review
              and cancel it.
            </p>
            <p className="text-xl text-muted-foreground mt-4 mb-8">
              Introhub helps you stay proactive. If an intro {"isn't"} canceled,
              the system will request your {"contact's"} consent for the
              introduction.
            </p>

            <div className={"w-full"}>
              <AcceptAutoProspectingForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default setupIcp;
