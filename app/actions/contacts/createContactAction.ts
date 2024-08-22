"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import enrichContactUsingApollo from "@/services/enrichContactUsingApollo";
import ApolloQueue from "@/bull/queues/apolloQueue";

const createContactActionSchema = z.object({
  email: z.string().max(100).min(5),
  sentCount: z.coerce.number().min(1),
  receivedCount: z.coerce.number().min(1),
});

type CreateContactActionFlattenErrorType = z.inferFlattenedErrors<
  typeof createContactActionSchema
>;

export default async function createContactAction(
  prevState: CreateContactActionFlattenErrorType | undefined | string,
  formData: FormData,
) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  try {
    const { email, sentCount, receivedCount } = createContactActionSchema.parse(
      {
        email: formData.get("email"),
        sentCount: formData.get("sentCount"),
        receivedCount: formData.get("receivedCount"),
      },
    );
    const contact = await prisma.contact.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        email,
        sentCount,
        receivedCount,
        sentReceivedRatio: Math.round(sentCount / receivedCount) * 100,
      },
    });
    console.log("contact created: ", contact);

    await ApolloQueue.add("enrichContactUsingApollo", email);
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to Create Contact!";
    }
  }



  revalidatePath("/dashboard/my-contacts");
  redirect("/dashboard/my-contacts");
}
