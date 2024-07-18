import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import moveIntroToBeApproved from "@/services/moveIntroToBeApproved";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import moveIntroToBeRejected from "@/services/moveIntroToBeRejected";
import getFirstName from "@/services/getFirstName";

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
  await moveIntroToBeRejected(intro);

  const requesterName = getFirstName(intro.requester.name);
  const response = new Response(
    `Sure thing, I will go ahead and reject this intro request from ${requesterName} and let him know of the same.`,
    {
      status: 200,
    },
  );

  return response;
}
