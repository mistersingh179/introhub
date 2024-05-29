import prisma from "../prismaClient";
import numeral from "numeral";

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
  console.log(numeral(54).format("0.0a"));
  // const jobObj = await HighQueue.add("onBoardUser", { userId });
  // const { name, id } = jobObj;
  //
  // const result = { message: "thanks!", name, id, userId };
  // console.log(result);
})();

export {};
