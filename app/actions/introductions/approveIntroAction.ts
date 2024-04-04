"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { SendEmailInput } from "@/services/sendEmail";
import MediumQueue from "@/bull/queues/mediumQueue";
import { goingToChangeIntroStatus } from "@/services/canStateChange";

export default async function approveIntroAction(
  introductionId: string,
  prevState: undefined | string,
  formData: FormData,
) {
  console.log("in approveIntroAction with: ", introductionId);
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    await goingToChangeIntroStatus(introductionId, IntroStates.approved);

    const introduction: IntroWithContactFacilitatorAndRequester =
      await prisma.introduction.update({
        data: {
          status: IntroStates.approved,
        },
        where: {
          id: introductionId,
          facilitatorId: user.id,
        },
        include: {
          facilitator: true,
          requester: true,
          contact: true,
        },
      });
    const personProfile = await prisma.personProfile.findFirstOrThrow({
      where: {
        email: introduction.contact.email,
      },
    });
    console.log("intro has been approved. lets send email");
    const account = await prisma.account.findFirstOrThrow({
      where: {
        userId: introduction.facilitatorId,
      },
    });
    const sendEmailInput: SendEmailInput = {
      account,
      subject: `Intro request: ${personProfile.fullName} <> ${introduction.requester.name}`,
      body: introduction.messageForContact,
      from: introduction.facilitator.email!,
      cc: introduction.requester.email!,
      to: introduction.contact.email,
    };
    const jobObj = await MediumQueue.add("sendEmail", sendEmailInput);
    const { name, id } = jobObj;
    console.log("scheduled sendEmail job: ", name, id);
  } catch (e) {
    console.log("an error occurred!: ", e);
    if (e instanceof Error) {
      return e.message;
    } else {
      return "unable to approve introduction!";
    }
  }

  revalidatePath("/dashboard/introductions/list");
  redirect("/dashboard/introductions/list");
}
