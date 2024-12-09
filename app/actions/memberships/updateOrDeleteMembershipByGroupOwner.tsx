"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import { z, ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const updateMembershipActionSchema = z.object({
  approved: z
    .string()
    .nullable()
    .optional()
    .transform((s) => (s ? s.toLowerCase() === "true" : false)),
  membershipId: z.string(),
});

type updateMembershipActionFlattenErrorType = z.inferFlattenedErrors<
  typeof updateMembershipActionSchema
>;

const updateMembershipAction = async (
  prevState: updateMembershipActionFlattenErrorType | undefined | string,
  formData: FormData,
) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  let groupIdToRedirectTo = "";
  try {
    const { approved, membershipId } = updateMembershipActionSchema.parse({
      approved: formData.get("approved"),
      membershipId: formData.get("membershipId"),
    });
    const membership = await prisma.membership.findFirstOrThrow({
      where: {
        id: membershipId,
      },
    });
    groupIdToRedirectTo = membership.groupId;
    console.log("*** in updateOrDeleteMembershipByGroupOwner with: ", user.id, approved, membershipId);

    if (approved) {
      await prisma.membership.update({
        where: {
          id: membershipId,
          group: {
            creatorId: user.id,
          },
        },
        data: {
          approved,
        },
      });
    } else {
      await prisma.membership.delete({
        where: {
          id: membershipId,
          group: {
            creatorId: user.id,
          },
        },
      });
    }
  } catch (e) {
    if (e instanceof ZodError) {
      return e.flatten();
    } else if (e instanceof Error) {
      return e.message;
    } else {
      return "Unable to update Membership";
    }
  }

  revalidatePath(`/dashboard/groups/${groupIdToRedirectTo}/manage`);
  redirect(`/dashboard/groups/${groupIdToRedirectTo}/manage`);
};

export default updateMembershipAction;
