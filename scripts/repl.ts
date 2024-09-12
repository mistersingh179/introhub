import prisma from "../prismaClient";
import sleep from "@/lib/sleep";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { startOfToday, subDays } from "date-fns";
import getProspectsBasedOnFilters, {
  PaginatedValues,
  SelectedFilterValues,
} from "@/services/getProspectsBasedOnFilters"; // path to your JSON key file

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("hello world fro repl!")
})();

export {};
