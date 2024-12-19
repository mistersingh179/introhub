import prisma from "../prismaClient";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  differenceInMilliseconds,
  differenceInSeconds,
  formatDistance,
  subDays,
} from "date-fns";
import { IntroStates } from "@/lib/introStates";
import { PlatformGroupName } from "@/app/utils/constants";
import refreshScopes from "@/services/refreshScopes";
import getUniqueValuesWithOrderPreserved from "@/services/getUniqueValuesWithOrderPreserved";

const { PubSub } = require("@google-cloud/pubsub");

// @ts-ignore
prisma.$on("query", (e) => {});

(async () => {
  const addSearchParam = ({
    host,
    url,
    param,
    value,
  }: {
    host: string;
    url: string;
    param: string;
    value: string;
  }) => {
    console.log("in addSearchParam with: ", host, url, param, value);
    const base = new URL(url, host);
    base.searchParams.set(param, value);
    const result = base.pathname + base.search + base.hash;
    console.log("result: ", result);
    return result;
  };

  // in addSearchParam with:  https://app.introhub.net /dashboard/home groupName Platform

  const ans = addSearchParam({
    host: "https://app.introhub.net",
    url: "/dashboard/home",
    param: "groupName",
    value: "Platform",
  });
  console.log("ans: ", ans);

  // in addSearchParam with:  https://app.introhub.net https://app.introhub.net/ groupName Platform

  const ans2 = addSearchParam({
    host: "https://app.introhub.net",
    url: "https://app.introhub.net/",
    param: "groupName",
    value: "Platform",
  });
  console.log("ans2: ", ans2);



  // const fd = new FormData();
  // console.log(fd.get("aa"));

  // const m = await prisma.membership.update({
  //   where: {
  //     id: 'cm4d4byhu0002ihsi8pj5e4cc',
  //     group: {
  //       creatorId: 'clzrcdffo0000n0kuuplb1p9h'
  //     }
  //   },
  //   data: {
  //     approved: true
  //   }
  // });
  //
  // console.log('m: ', m);

  // const foobarGroup = await prisma.group.findFirstOrThrow({
  //   where: {
  //     name: "foobar",
  //   },
  // });
  //
  // const users = await prisma.user.findMany();
  // for (const user of users) {
  //   await prisma.membership.create({
  //     data: {
  //       groupId: foobarGroup.id,
  //       userId: user.id,
  //     },
  //   });
  // }
})();

export {};
