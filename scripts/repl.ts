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
  const emailTerm = 'istersingh179@gmail.co';
  // const emailTerm = null;
  const emailTermWithWild = emailTerm ? "%" + emailTerm + "%" : null;
  const filterSql = emailTerm
    ? Prisma.sql`and "Contact".email like ${emailTermWithWild}`
    : Prisma.sql``;
  const sql = Prisma.sql`select *
                         from "Contact"
                         where 1=1 ${filterSql}
                         order by "Contact".email DESC`;

  const contacts = await prisma.$queryRaw<Contact[]>(sql);
  console.log("record count: ", contacts.length);
})();

export {};
