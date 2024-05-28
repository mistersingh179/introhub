import prisma from "@/prismaClient";
import prepareProspectsData from "@/services/prepareProspectsData";
import { getNewProspectsHtml } from "@/email-templates/NewProspects";
import {startOfToday} from "date-fns";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {

  const prospects = await prisma.contact.findMany();
  const { prospectsWithUser, emailToProfile, companyUrlToProfile } =
    await prepareProspectsData(prospects);

  const date = startOfToday();
  const html = getNewProspectsHtml(
    prospectsWithUser,
    emailToProfile,
    companyUrlToProfile,
    date
  );
  console.log("html: ", html);

  const response = new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
  return response;
}
