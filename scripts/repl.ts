import prisma from "../prismaClient";
import { Contact, Prisma } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import { google } from "googleapis";

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
  const titles = ["CEO", 'founder', 'cto'];
  // Create a regex pattern from the titles array

  const jobTitleFilterSql = titles
    ? Prisma.sql`PE."jobTitle" ~* ${"\\y(" + titles.join("|") + ")\\y"}`
    : Prisma.sql``;

  // const sql2 = Prisma.sql`SELECT *
  //                         FROM "PersonExperience"
  //                         WHERE "PersonExperience"."jobTitle" ~* ${titlesPattern}`
  //
  // const contacts2 = await prisma.$queryRaw<Contact[]>(sql2);
  // console.log("records found: ", contacts2.length, contacts2);
  //
  // const jobTitleFilterSql = `(^|\\s|\\W)(${titles.join("|")})(\\s|\\W|$)`;



  const sql = Prisma.sql`
      select *
      from public."PersonExperience" PE
      where ${jobTitleFilterSql} 
  `;
  const contacts = await prisma.$queryRaw<Contact[]>(sql);
  console.log("records found: ", contacts.length, contacts);
})();

export {};
