import { redirect } from "next/navigation";

import prisma from "@/prismaClient";
import moveIntroToBeApproved from "@/services/moveIntroToBeApproved";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";

type OptionsType = {
  params: { id: string };
};

export async function GET(request: Request, { params }: OptionsType) {
  try {
    const url = new URL(request.url);
    const approvalKey = url.searchParams.get("approvalKey") ?? "";
    const { id } = params;

    const intro: IntroWithContactFacilitatorAndRequester =
      await prisma.introduction.findFirstOrThrow({
        where: {
          id,
          approvalKey,
        },
        include: {
          requester: true,
          facilitator: true,
          contact: true,
        },
      });
    await moveIntroToBeApproved(intro);
  } catch (err) {
    console.log("error while marking intro as approved", err);
    redirect("/splash/unableToProcessRequest");
  }
  redirect("/splash/approved");
}
