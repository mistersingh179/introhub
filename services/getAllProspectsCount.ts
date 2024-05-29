import { Prisma, User } from "@prisma/client";
import prisma from "@/prismaClient";

const getAllProspectsCount = async (user: User): Promise<number> => {
  const sql = Prisma.sql`
      select count(distinct C.email)
      from "Contact" C
               inner join public."User" U on U.id = C."userId"
               inner join public."PersonProfile" PP on C.email = PP.email and PP."linkedInUrl" is not null
               inner join public."PersonExperience" PE on PP.id = PE."personProfileId"
               inner join public."CompanyProfile" CP on CP."linkedInUrl" = PE."companyLinkedInUrl"
          and C."userId" != ${user.id}
  `;

  const result = await prisma.$queryRaw<{ count: number }[]>(sql);
  const count = result[0].count;
  console.log("prospects found: ", count);

  return Number(count);
};

export default getAllProspectsCount;

if (require.main === module) {
  (async () => {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: "clwrwfkm00000w98m2jfyc4k6"
      }
    });

    const count = await getAllProspectsCount(user);
    console.log(count);
    process.exit(0);
  })();
}
