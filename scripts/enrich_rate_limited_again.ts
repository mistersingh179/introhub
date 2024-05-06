import prisma from "../prismaClient";
import fs from "fs";
import Papa from "papaparse";
import ProxyCurlQueue from "@/bull/queues/proxyCurlQueue";
import path from "node:path";

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
  console.log(__filename, __dirname);
  const fileData = fs.readFileSync(
    path.join(__dirname, "./person_profiles_with_null_from_rate_limit.csv"),
    "utf-8",
  );
  const { data } = Papa.parse(fileData);
  if (data) {
    const emails = data.map((x, idx, array) => (x as any)[0]);
    for (const email of emails) {
      const jobObj = await ProxyCurlQueue.add("enrichContact", {
        email,
      });
      const { name, id } = jobObj;
      console.log(name, id, email);
    }
  }
})();

export {};
