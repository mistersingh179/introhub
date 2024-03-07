import prisma from "../prismaClient";
import redisClient from "@/lib/redisClient";
import {Message, Prisma} from "@prisma/client";
import {parseAddressList, ParsedMailbox, parseOneAddress} from "email-addresses";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

const MY_GOOGLE_API_KEY = "AIzaSyCCiO10EMimJzYb5qSbrxtbiCxAwo-131U";

(async () => {
  const sql = Prisma.sql`
      WITH Sent AS (SELECT "toAddress" AS email,
                           COUNT(*)    AS sent_count
                    FROM "Message"
                    WHERE "fromAddress" = 'sandeep@brandweaver.ai'
                    GROUP BY "toAddress"
                    HAVING COUNT(*) > 0
                    ORDER BY COUNT(*) DESC),
           Received AS (SELECT "fromAddress" AS email,
                               COUNT(*)      AS received_count
                        FROM "Message"
                        WHERE "deliveredTo" = 'sandeep@brandweaver.ai'
                        GROUP BY "fromAddress"
                        HAVING COUNT(*) > 0
                        ORDER BY COUNT(*) DESC)
      select COALESCE(Sent.email, Received.email) AS email,
             COALESCE(sent_count, 0)              AS sent_count,
             COALESCE(received_count, 0)          AS received_count,
             CASE
                 WHEN COALESCE(received_count, 0) = 0 THEN NULL
                 ELSE CAST(sent_count AS FLOAT) / received_count
                 END                              AS send_receive_ratio
      from Sent
               full outer join Received ON Sent.email = Received.email
      where sent_count > 0
        and received_count > 0
      order by send_receive_ratio DESC;
  `;
  const ans: Message[] = await prisma.$queryRaw(sql);
  console.log(ans[0]);

})();

export {};
