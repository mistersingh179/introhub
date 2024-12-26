import prisma from "@/prismaClient";
import sendIntroDigestEmail from "@/services/emails/sendIntroDigestEmail";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { superUsers } from "@/app/utils/constants";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userIdToWorkOn = searchParams.get("userId");

  if (!userIdToWorkOn) {
    console.log("no user id given");
    return new Response("no user id given", {
      status: 400,
      headers: {
        "content-type": "text/html",
      },
    });
  }

  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  console.log("logged in user is: ", user);

  if (!superUsers.includes(user.email!)) {
    console.log("sorry you are not allowed to use SignInWithCredentials");
    return new Response("sorry you are not allowed here!", {
      status: 401,
      headers: {
        "content-type": "text/html",
      },
    });
  }

  const userToWorkOn = await prisma.user.findFirstOrThrow({
    where: { id: userIdToWorkOn },
  });
  const html = await sendIntroDigestEmail(userToWorkOn, false);

  const htmlBody = html.replaceAll("\r\n", "<br>");
  console.log("htmlBody: ", htmlBody);

  const response = new Response(
    htmlBody || "No Content so no email will be sent",
    {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    },
  );
  return response;
}
