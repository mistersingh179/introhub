import prisma from "../prismaClient";
import { Contact } from "@prisma/client";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log("***");
  // console.log(query, params);
  // console.log("***");
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  const contacts: Contact[] = await prisma.contact.findMany({
    where: {
      user: {
        email: "sandeep@brandweaver.ai" || "",
      },
    },
  });
  console.log(contacts);
})();

export {};
