import prisma from "@/prismaClient";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { IntroStates } from "@/lib/introStates";
import sendPendingApprovalEmail from "@/services/sendPendingApprovalEmail";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
    },
  });
  const intro: IntroWithContactFacilitatorAndRequester =
    await prisma.introduction.findFirstOrThrow({
      where: {
        facilitator: user,
        status: IntroStates["pending approval"],
      },
      include: {
        contact: true,
        facilitator: true,
        requester: true,
      },
    });
  const html = await sendPendingApprovalEmail(intro, false);
  const htmlBody = html.replaceAll("\r\n", "<br>");
  console.log("htmlBody: ", htmlBody);

  const response = new Response(htmlBody, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
  return response;
}
