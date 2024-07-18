import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import moveIntroToBeApproved from "@/services/moveIntroToBeApproved";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";

type OptionsType = {
  params: { id: string };
};

export async function GET(request: Request, { params }: OptionsType) {
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

  const response = new Response(
    "thanks, I will go ahead and make that intro now.",
    {
      status: 200,
    },
  );

  return response;
}
