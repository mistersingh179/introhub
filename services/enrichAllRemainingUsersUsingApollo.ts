import { Contact, Prisma } from "@prisma/client";
import prisma from "@/prismaClient";
import ProxyCurlQueue from "@/bull/queues/proxyCurlQueue";
import ApolloQueue from "@/bull/queues/apolloQueue";
import { randomInt } from "crypto";

const enrichAllRemainingUsersUsingApollo = async () => {
  const sql = Prisma.sql`SELECT U.*
                         FROM "User" U
                                  LEFT JOIN public."PersonProfile" PP ON U.email = PP.email
                                  LEFT JOIN "PeopleEnrichmentEndpoint" PEE ON U.email = PEE.email
                         WHERE PP."linkedInUrl" IS NULL
                           AND (
                             (PEE.email IS NULL)
                                 OR
                             (PEE.email IS NOT NULL AND PEE.response -> 'person' ->> 'linkedin_url' IS NOT NULL)
                             );`;
  const contactsForApollo = await prisma.$queryRaw<Contact[]>(sql);
  console.log("contactsForApollo: ", contactsForApollo);
  for (const contact of contactsForApollo) {
    const jobObj = await ApolloQueue.add(
      "enrichContactUsingApollo",
      contact.email,
      {
        delay: randomInt(1000, 5000),
      },
    );
    const { name, id } = jobObj;
    console.log("scheduled enrichContactUsingApollo job: ", name, id);
  }
};

export default enrichAllRemainingUsersUsingApollo;

if (require.main === module) {
  (async () => {
    await enrichAllRemainingUsersUsingApollo();
  })();
}
