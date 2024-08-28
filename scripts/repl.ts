import prisma from "../prismaClient";
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

  for(const i of Array.from({ length: 2 })){
    console.log("In here");
    await sleep(500);
  };


})();

export {};
