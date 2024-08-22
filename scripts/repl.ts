import prisma from "../prismaClient";
import refreshAccessToken from "@/services/helpers/refreshAccessToken";
import sleep from "@/lib/sleep";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  const users = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true,
    },
    include: {
      accounts: true,
    },
  });
  // console.log("users: ", users);
  for (const user of users) {
    try {
      await refreshAccessToken(user.accounts[0]!);
      console.log("good with: ", user.email);
    } catch (err) {
      console.log("*** error with: ", user.email);
    }
    await sleep(250);
  }
})();

export {};
