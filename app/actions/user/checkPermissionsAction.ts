import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import checkUserPermissions from "@/services/checkUserPermissions";

const checkPermissionsAction = async (formData: FormData) => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const ans = await checkUserPermissions(user.id);
  return ans;
};

export default checkPermissionsAction;
