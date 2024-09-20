import { Prisma } from "@prisma/client";
import prisma from "@/prismaClient";

type BuildSummaryForAllContacts = () => Promise<void>;

const buildSummaryForAllContacts: BuildSummaryForAllContacts = async () => {
  console.log("in buildSummaryForAllContacts");

};

export default buildSummaryForAllContacts;

if (require.main === module) {
  (async () => {
    await buildSummaryForAllContacts();
  })();
}
