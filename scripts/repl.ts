import prisma from "../prismaClient";

import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { IntroStates } from "@/lib/introStates";
import getGmailObject from "@/services/helpers/getGmailObject";
import { startOfToday, subDays } from "date-fns";
import sendEmail from "@/services/emails/sendEmail";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log("***");
  console.log(query, params);
  console.log("***");
  console.log({ timestamp, params, duration, target });
});

(async () => {
  // const user = await prisma.user.findFirstOrThrow({
  //   where: {
  //     email: "sandeep@introhub.net",
  //     accounts: {
  //       some: {
  //         provider: "google",
  //       },
  //     },
  //   },
  //   include: {
  //     accounts: {
  //       where: {
  //         provider: "google",
  //       },
  //     },
  //   },
  // });
  // console.log("user: ", user.accounts.length);

  const baseUrl = "https://api-us.zerobounce.net";
  const url = `/v2/validate`;

  const params = new URLSearchParams({
    email: "timeout_exceeded@example.com",
    ip: "",
    api_key: "837cbdf1d57d4bb5b1f264e83f9e5ac3",
    timeout: "5",
  });

  const fullUrl = `${baseUrl}/${url}?${params}`;
  console.log(fullUrl);

  try{
    const resp = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const ans: ValidateEmailApiResponse = await resp.json();

    if ("error" in ans) {
      console.error("Error: ", ans);
      return false;
    } else {
      console.log("Email validation successful: ", ans);
      return ans.status === "valid";
    }
  }catch(err){
    console.log("got error when fetching zero bounce api");
    return false;
  }

})();

export {};
