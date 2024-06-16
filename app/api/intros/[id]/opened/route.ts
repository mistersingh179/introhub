import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";

export const dynamic = "force-dynamic"; // defaults to auto

const gif = Buffer.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0xff, 0x00,
  0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00,
  0x01, 0x00, 0x00, 0x02, 0x02, 0x44, 0x01, 0x00, 0x3b,
]);

type OptionsType = {
  params: { id: string };
};

export async function GET(request: Request, { params }: OptionsType) {
  try {
    console.log("track open here");
    const { id } = params;
    await prisma.introduction.update({
      where: {
        id,
        status: IntroStates["email sent"],
      },
      data: {
        status: IntroStates["email opened"],
      },
    });
    console.log("id: ", id);
  } catch (err) {
    console.log("error happened while tracking");
  }

  const response = new Response(gif, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Content-Length": gif.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
  return response;
}
