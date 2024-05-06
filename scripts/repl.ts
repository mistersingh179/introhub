import prisma from "../prismaClient";
import { Contact } from "@prisma/client";
import getGmailObject from "@/services/helpers/getGmailObject";
import { google } from "googleapis";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log("***");
  // console.log(query, params);
  // console.log("***");
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("Hello world !!!!");

  console.log("hello!");
})();

export {};
