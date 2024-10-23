import { Account } from "@prisma/client";
import prisma from "@/prismaClient";
import { fullScope } from "@/app/utils/constants";

const doWeHaveFullScope = (accounts: Account[]) => {
  const googleAccount = accounts.find((a) => a.provider === "google");
  if (!googleAccount) {
    return false;
  }
  console.log(doWeHaveFullScope, googleAccount.scope === fullScope);

  console.log("googleAccount.scope: ", googleAccount.scope);
  console.log("fullScope: ", fullScope);
  return googleAccount.scope === fullScope;
};

export default doWeHaveFullScope;

(async () => {
  const accounts = await prisma.account.findMany({
    where: {
      user: {
        email: "sandeep@introhub.net",
      },
    },
  });
  const ans = doWeHaveFullScope(accounts);
  console.log("doWeHaveFullScope: ", ans);
})();
