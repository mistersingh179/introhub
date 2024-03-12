import prisma from "../prismaClient";
import redisClient from "@/lib/redisClient";
import { Contact, Message, Prisma, User } from "@prisma/client";
import {
  parseAddressList,
  ParsedMailbox,
  parseOneAddress,
} from "email-addresses";
import mediumWorker from "@/bull/workers/mediumWorker";
import mediumQueue from "@/bull/queues/mediumQueue";
import ContactOrderByWithRelationInput = Prisma.ContactOrderByWithRelationInput;

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

const MY_GOOGLE_API_KEY = "AIzaSyCCiO10EMimJzYb5qSbrxtbiCxAwo-131U";

(async () => {
  const sql = Prisma.sql`select distinct on ("Contact".email) U.*, "Contact".*
                         from "Contact"
                                  inner join public."User" U on U.id = "Contact"."userId"
                         order by "Contact".email ASC, "receivedCount" DESC;
  `
  const contacts = await prisma.$queryRaw<(User & Contact)[]>(sql);
  console.log(contacts[0])
})();

export {};
