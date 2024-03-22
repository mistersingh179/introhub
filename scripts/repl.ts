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
  const user = await prisma.user.update({
    data: {
      name: 'foo'
    },
    where: {
      email: 'sandeep@brandweaver.ai',
      image: null
    }
  });
  console.log(user);



})();

export {};
