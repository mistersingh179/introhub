import { Contact, Prisma } from "@prisma/client";
import prisma from "@/prismaClient";
import ApolloQueue from "@/bull/queues/apolloQueue";

type EnrichAllContacts = () => Promise<void>;

const enrichAllContacts: EnrichAllContacts = async () => {
  const sql = Prisma.sql`
      select c.*
      from "Contact" c
               left join "PersonProfile" pp on pp.email = c.email
      where pp.email is null;`;
  const contactsWithoutPersonProfile = await prisma.$queryRaw<Contact[]>(sql);
  for (const contact of contactsWithoutPersonProfile) {
    const jobObj = await ApolloQueue.add(
      "enrichContactUsingApollo",
      contact.email,
    );
    const { name, id } = jobObj;
    console.log("scheduled enrichContact job: ", name, id);
  }
};

export default enrichAllContacts;

if (require.main === module) {
  (async () => {
    await enrichAllContacts();
  })();
}
