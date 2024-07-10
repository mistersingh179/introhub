import { User } from "@prisma/client";
import refreshScopes from "@/services/refreshScopes";
import prisma from "@/prismaClient";

const checkUserPermissions = async (user: User) => {
  try {
    const userScopes = await refreshScopes(user.id);
    console.log("userScopes: ", userScopes);
    const requiredScopes = ["profile", "openid", "metadata", "email", "send"];
    return requiredScopes.every((requiredScope) =>
      userScopes.some((userScope) => userScope.includes(requiredScope)),
    );
  } catch (err) {
    return false;
  }
};

export default checkUserPermissions;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: 'sandeep@introhub.net'
      }
    });
    const ans = await checkUserPermissions(user);
    console.log("ans: ", ans);
    process.exit(0);
  })();
}
