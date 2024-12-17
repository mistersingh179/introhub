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
  console.log("Starting repl!");

  const groupsWithCount = await prisma.membership.groupBy({
    by: "groupId",
    _count: {
      groupId: true,
    },
    orderBy: {
      _count: {
        groupId: "desc",
      },
    },
  });
  const groupsIds = getUniqueValuesWithOrderPreserved(
    groupsWithCount,
    "groupId",
  );
  const groups = await prisma.group.findMany({
    where: { id: { in: groupsIds } },
  });
  console.log(groups);

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
