import prisma from "../prismaClient";
import ApolloQueue from "@/bull/queues/apolloQueue";
import { Contact, Prisma } from "@prisma/client";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log("***");
  // console.log(query, params);
  // console.log("***");
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("in manuallyBuildPeopleEnrichmentApiResponseForAll");

  const maxPagesCount = 200;
  const take = 100;
  const pages = Array.from({ length: maxPagesCount }, (elem, idx) => idx + 1);

  for (const pageNumber of pages) {
    const skip = (pageNumber - 1) * take;
    console.log("pageNumber: ", pageNumber, " take: ", take, " skip: ", skip);

    const sql = Prisma.sql`
        select "Contact".*
        from "Contact"
--                  left join public."PeopleEnrichmentEndpoint" PEE on "Contact".email = PEE.email
--         where PEE.email is null
        limit ${take} offset ${skip}`;

    // console.log(sql.text, sql.values);

    const contacts = await prisma.$queryRaw<Contact[]>(sql);

    for (const contact of contacts) {
      console.log("enrich via apollo: ", contact.email);
      await ApolloQueue.add("peopleEnrichmentApiResponse", contact.email);
    }

    console.log(contacts.length);
    if (contacts.length === 0) {
      console.log("breaking as no more contacts left to enrich");
      break;
    }
  }
})();

export {};
