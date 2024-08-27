import prisma from "../prismaClient";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {

  Array.from({ length: 2 }).map(async (x) => {
    console.log("In here");
  });


})();

export {};
