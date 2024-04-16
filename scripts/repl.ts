import prisma from "../prismaClient";
import redisClient from "@/lib/redisClient";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

const makeEnrichApiCall = async (email: string) => {
  const resp = await fetch(`${process.env.BASE_API_URL}/api/enrich`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.INTERNAL_API_SECRET}`,
    },
    body: JSON.stringify({
      email,
    }),
  });
  console.log(await resp.json());
};

(async () => {
  console.log("hello world");
  // const ans = await redisClient.get("foo");
  const ans = await makeEnrichApiCall("sandeep@introhub.net");
  console.log("ans: ", ans);
})();

export {};
