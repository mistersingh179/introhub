import prisma from "../prismaClient";
import { Contact, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import { google } from "googleapis";
import apolloQueue from "@/bull/queues/apolloQueue";
import { randomInt } from "node:crypto";
import highQueue from "@/bull/queues/highQueue";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("Hello world !");

  // const sql = Prisma.sql`SELECT C.*
  //                        FROM "Contact" C
  //                                 LEFT JOIN public."PersonProfile" PP ON C.email = PP.email
  //                                 LEFT JOIN "PeopleEnrichmentEndpoint" PEE ON C.email = PEE.email
  //                        WHERE PP."linkedInUrl" IS NULL
  //                          AND (
  //                            (PEE.email IS NULL)
  //                                OR
  //                            (PEE.email IS NOT NULL AND PEE.response -> 'person' ->> 'linkedin_url' IS NOT NULL)
  //                            );`;
  // const contactsForApollo = await prisma.$queryRaw<Contact[]>(sql);
  // console.log("contactsForApollo: ", contactsForApollo);

  // const randomDelay = randomInt(1000, 5000);
  // const jobObj = await apolloQueue.add(
  //   "enrichContactUsingApollo",
  //   "GibsonS@dnb.com",
  //   {
  //     delay: randomDelay
  //   }
  // );
  // console.log(jobObj);

  const ttl = await apolloQueue.getRateLimitTtl();
  console.log(ttl);

  // const jobObj = await highQueue.add("foo", "");
  // const {name, id, data} = jobObj;
  // console.log("ans: ", name, id, data);

  // console.log(randomInt(1,5));
})();

export {};
