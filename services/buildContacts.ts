import { Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";


type BuildContacts = (user: User) => Promise<void>;

const buildContacts: BuildContacts = async (user) => {
  const myEmailAddress = user.email!;
  const sql = Prisma.sql`
      WITH Sent AS (SELECT "toAddress" AS email,
                           COUNT(*)    AS sent_count
                    FROM "Message"
                    WHERE "fromAddress" = ${myEmailAddress}
                    GROUP BY "toAddress"
                    HAVING COUNT(*) > 0
                    ORDER BY COUNT(*) DESC),
           Received AS (SELECT "fromAddress" AS email,
                               COUNT(*)      AS received_count
                        FROM "Message"
                        WHERE "deliveredTo" = ${myEmailAddress}
                        GROUP BY "fromAddress"
                        HAVING COUNT(*) > 0
                        ORDER BY COUNT(*) DESC),
           my_contacts as (select COALESCE(Sent.email, Received.email) AS email,
                               COALESCE(sent_count, 0)              AS sent_count,
                               COALESCE(received_count, 0)          AS received_count,
                               CASE
                                   WHEN COALESCE(received_count, 0) = 0 THEN NULL
                                   ELSE round((sent_count::float / received_count) * 100)
                                   END                              AS sent_received_ratio
                        from Sent
                                 full outer join Received ON Sent.email = Received.email
                        where sent_count > 0
                          and received_count > 0
                        order by sent_received_ratio DESC)
      insert
      into "Contact" ("id", "userId", email, "sentCount", "receivedCount", "sentReceivedRatio", "createdAt", "updatedAt")
      select uuid_generate_v4(),
             ${user.id},
             my_contacts.email,
             my_contacts.sent_count,
             my_contacts.received_count,
             my_contacts.sent_received_ratio,
             now(),
             now()
      from my_contacts
      on conflict("userId", email) DO UPDATE set "sentCount"= excluded."sentCount",
                                                 "receivedCount" = excluded."receivedCount",
                                                 "sentReceivedRatio" = excluded."sentReceivedRatio";
  `;
  await prisma.$queryRaw(sql);
  console.log("done building contacts for: ", myEmailAddress);
};

export default buildContacts

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      },
      include: {
        accounts: true,
      },
    });
    await buildContacts(user);
  })();
}
