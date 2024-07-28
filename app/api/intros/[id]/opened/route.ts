import prisma from "@/prismaClient";
import { IntroStates, IntroStatesKey } from "@/lib/introStates";
import fs from "fs";
import canStateChange, {goingToChangeIntroStatus} from "@/services/canStateChange";

export const dynamic = "force-dynamic"; // defaults to auto

const onePixelTransparentPng = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49,
  0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06,
  0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44,
  0x41, 0x54, 0x78, 0x9c, 0x63, 0x60, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xe2,
  0x21, 0xbc, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42,
  0x60, 0x82,
]);

const networkingImage = fs.readFileSync("app/auth/signIn/networking.png");

type OptionsType = {
  params: { id: string };
};

export async function GET(request: Request, { params }: OptionsType) {
  try {
    console.log("track open here");

    const { id } = params;
    await goingToChangeIntroStatus(id, IntroStates["permission email opened"]);
    await prisma.introduction.update({
      where: {
        id
      },
      data: {
        status: IntroStates["permission email opened"],
      },
    });
  } catch (err) {
    console.log("error happened while marking intro as ", IntroStates["permission email opened"]);
  }

  const responseImage =
    process.env.NODE_ENV === "development"
      ? networkingImage
      : onePixelTransparentPng;

  const response = new Response(responseImage, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Content-Length": responseImage.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
  return response;
}
