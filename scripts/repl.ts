import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const result = await prisma.category.groupBy({
    by: "name",
    _count: true,
  })
  console.log(result);
})();

export {};
