import prisma from "@/prismaClient";
import introOverviewHtml from "@/email-templates/IntroOverviewHtml";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getAllProfiles from "@/services/getAllProfiles";
import { IntroStates } from "@/lib/introStates";
import {Profiles} from "@/app/dashboard/introductions/list/IntroTable";
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

  console.log("html: ", html);

  const response = new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
  return response;
}
