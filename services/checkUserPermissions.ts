import refreshScopes from "@/services/refreshScopes";
import prisma from "@/prismaClient";
import { cache } from "react";
import doWeHaveFullScope from "@/services/doWeHaveFullScope";

const checkUserPermissions = cache(async (userId: string) => {
  try {
    await refreshScopes(userId);
    const accounts = await prisma.account.findMany({
      where: {
        userId,
      },
    });
    return doWeHaveFullScope(accounts);
  } catch (err) {
    return false;
  }
});

export default checkUserPermissions;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@introhub.net",
      },
    });
    const ans = await checkUserPermissions(user.id);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
