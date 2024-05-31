import prisma from "../prismaClient";
import numeral from "numeral";
import getFiltersFromSearchParams from "@/services/getFiltersFromSearchParams";
import querystring from "querystring";
import getProspectsBasedOnFilters, {PaginatedValues} from "@/services/getProspectsBasedOnFilters";
import {z} from "zod";

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

  const testSchema = z.object({
    dailyEmail: z.coerce.boolean()
  });

// Test different values
  const inputs = [
    { dailyEmail: "true" },
    { dailyEmail: "false" },
    { dailyEmail: "0" },
    { dailyEmail: "1" },
    { dailyEmail: "" },
    { dailyEmail: null },       // This will likely cause an error unless handled as string
    {},                         // Missing dailyEmail
    { dailyEmail: undefined },
  ];

  inputs.forEach(input => {
    try {
      const result = testSchema.parse(input);
      console.log(`Input: ${JSON.stringify(input)} - Parsed: `, result);
    } catch (error) {
      console.log(`Error with input ${JSON.stringify(input)}: `, error);
    }
  })

})();

export {};
