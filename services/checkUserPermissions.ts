import refreshScopes from "@/services/refreshScopes";
import prisma from "@/prismaClient";
import { cache } from "react";

const checkUserPermissions = cache(async (userId: string) => {
  try {
    const userScopes = await refreshScopes(userId);
    const requiredScopes = ["profile", "openid", "metadata", "email", "send"];
    return requiredScopes.every((requiredScope) =>
      userScopes.some((userScope) => userScope.includes(requiredScope)),
    );
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
