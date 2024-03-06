import { Account, Prisma } from "@prisma/client";
import prisma from "@/prismaClient";

export type BulkInsertMessageInput = {
  userId: string;
  id: string;
  threadId: string;
};

type BulkInsertMessages = (
  input: BulkInsertMessageInput[],
) => Promise<string[]>;

const bulkInsertMessages: BulkInsertMessages = async (input) => {
  const now = new Date();
  const paramsSql = Prisma.join(
    input.map(
      (x) =>
        Prisma.sql`(${Prisma.join([now, now, x.userId, x.id, x.threadId])})`,
    ),
  );
  // console.log("bulk insert params sql: ", paramsSql.text, paramsSql.values);

  const sql = Prisma.sql`
      INSERT INTO "public"."Message" ("createdAt", "updatedAt", "userId", "id", "threadId")
      values
      ${paramsSql}
      ON CONFLICT
      DO NOTHING
      returning id;`;

  // console.info("bulk insert sql: ", sql.text, sql.values);

  const results = await prisma.$queryRaw<{ id: string }[]>(sql);

  return results.map((record) => record.id);
};

export default bulkInsertMessages;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: "sandeep@brandweaver.ai",
      },
    });

    const response = await bulkInsertMessages([
      {
        userId: user.id,
        id: "1",
        threadId: "1",
      },
      {
        userId: user.id,
        id: "2",
        threadId: "1",
      },
    ]);

    console.log(response);
  })();
}
