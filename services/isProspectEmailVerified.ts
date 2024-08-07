import { Contact } from "@prisma/client";
import verifyEmail from "@/services/verifyEmail";
import prisma from "@/prismaClient";
import isUserMissingPersonalInfo from "@/services/isUserMissingPersonalInfo";

const isProspectEmailVerified = async (prospect: Contact): Promise<boolean> => {
  if (!prospect.emailCheckPassed) {
    return false;
  }

  const ans = await verifyEmail(prospect.email);
  if (!ans) {
    await prisma.contact.update({
      where: {
        id: prospect.id,
      },
      data: {
        emailCheckPassed: false,
      },
    });
    return false;
  }

  return true;
};

export default isProspectEmailVerified;

if (require.main === module) {
  (async () => {
    const prospect = await prisma.contact.findFirstOrThrow();
    const ans = await isProspectEmailVerified(prospect);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
