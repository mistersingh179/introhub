import prisma from "../prismaClient";
import redisClient from "@/lib/redisClient";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

const MY_GOOGLE_API_KEY = "AIzaSyCCiO10EMimJzYb5qSbrxtbiCxAwo-131U";

(async () => {

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: "",
    },
    include: {
      accounts: true,
      messages: {
        take: 1,
      },
    },
  });
  console.log("user: ", user);
})();

export {};
