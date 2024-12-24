import prisma from "@/prismaClient";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import sendAskingPermissionToMakeIntroEmail from "@/services/emails/sendAskingPermissionToMakeIntroEmail";
import sendIntroducingBothEmail from "@/services/emails/sendIntroducingBothEmail";
import sendIntroDigestEmail from "@/services/emails/sendIntroDigestEmail";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "sandeep@introhub.net",
    },
  });
  // const intro: IntroWithContactFacilitatorAndRequester =
  //   await prisma.introduction.findFirstOrThrow({
  //     where: {
  //       id: 'cm2c6v306000178vatg3qizbv',
  //       // requester: user,
  //       // status: IntroStates["approved"],
  //     },
  //     include: {
  //       contact: true,
  //       facilitator: true,
  //       requester: true,
  //     },
  //   });
  // console.log("*** intro: ", intro);

  // const html = await sendAskingPermissionToMakeIntroEmail(intro, false);
  // const html = await sendIntroducingBothEmail(intro, false);
  const html = await sendIntroDigestEmail(user, true);

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
