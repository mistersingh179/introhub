import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import moveIntroToBeApproved from "@/services/moveIntroToBeApproved";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import moveIntroToBeRejected from "@/services/moveIntroToBeRejected";
import getFirstName from "@/services/getFirstName";
import { redirect } from "next/navigation";

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
    await moveIntroToBeRejected(intro);
  } catch (err) {
    console.log("error marking intro as rejected", err);
    redirect("/splash/unableToProcessRequest");
  }
  redirect("/splash/rejected");
}
