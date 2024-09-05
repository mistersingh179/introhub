import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { NextResponse } from "next/server";

type OptionsType = {
  params: { id: string };
};

export type WantsToMeetApiRequestBody = {
  desire: boolean;
}

export type WantsToMeetApiResponseBody = {
  message: string;
  success: boolean;
}

export async function POST(request: Request, { params }: OptionsType) {
  const input = await request.json() as WantsToMeetApiRequestBody;
  const { desire } = input;

  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const { id } = params;
  const contact = await prisma.contact.findFirstOrThrow({ where: { id } });
  console.log("user: ", user.email, " wants to meet: ", contact.email);

  if(desire) {
    await prisma.wantedContact.create({
      data: {
        userId: user.id,
        contactId: contact.id,
      },
    });
  }else{
    await prisma.wantedContact.delete({
      where: {
        userId_contactId: {
          userId: user.id,
          contactId: contact.id,
        },
      },
    });
  }

  return NextResponse.json<WantsToMeetApiResponseBody>(
    { message: "Contact has been marked as wanted", success: true },
    {
      status: 200,
    },
  );
}
