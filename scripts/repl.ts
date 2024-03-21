import prisma from "../prismaClient";
import {z, ZodError} from "zod";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {

  console.log("in repl");
  await prisma.introduction.findMany({
    select: {id: true},
    where: {
      OR: [
        {
          requesterId: {
            equals: "x",
          },
        },
        {
          facilitatorId: {
            equals: "x",
          },
        },
      ],
    }
  });



})();

export {};
