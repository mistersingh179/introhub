import prisma from "@/prismaClient";
import redisClient from "@/lib/redisClient";
import RedisClient from "@/lib/redisClient";

export type ContactStats = {
  contactsCount: number;
  personProfileCount: number;
  cityCount: { _count: number; city: string | null }[];
  stateCount: { _count: number; state: string | null }[];
  countryCount: { _count: number; country: string | null }[];
  jobTitleCount: { _count: number; jobTitle: string | null }[];
  industryCount: { _count: number; industry: string | null }[];
  categoryCount: { _count: number; name: string | null }[];
};

const keyName = "getContactStats";

type GetContactStats = (fetchLatest?: boolean) => Promise<ContactStats>;
const getContactStats: GetContactStats = async (fetchLatest) => {
  if (!fetchLatest) {
    const ans = await redisClient.get(keyName);
    if (ans) {
      console.log("returning cached data");
      return JSON.parse(ans) as ContactStats;
    }
  }

  const contactsCount = await prisma.contact.count();
  const personProfileCount = await prisma.personProfile.count();

  const cityCount = await prisma.personProfile.groupBy({
    by: "city",
    _count: true,
    where: {
      city: {
        not: null,
      },
    },
  });

  const stateCount = await prisma.personProfile.groupBy({
    by: "state",
    _count: true,
    where: {
      state: {
        not: null,
      },
    },
  });

  const countryCount = await prisma.personProfile.groupBy({
    by: "country",
    _count: true,
    where: {
      country: {
        not: null,
      },
    },
  });

  const jobTitleCount = await prisma.personExperience.groupBy({
    by: "jobTitle",
    _count: true,
    where: {
      jobTitle: {
        not: null,
      },
    },
  });

  const industryCount = await prisma.companyProfile.groupBy({
    by: "industry",
    _count: true,
    where: {
      industry: {
        not: null,
      },
    },
  });

  const categoryCount = await prisma.category.groupBy({
    by: "name",
    _count: true,
  });

  const result = {
    contactsCount,
    personProfileCount,
    cityCount,
    stateCount,
    countryCount,
    jobTitleCount,
    industryCount,
    categoryCount,
  };
  // console.log(result);

  console.log("saving to cache");
  await RedisClient.set(keyName, JSON.stringify(result), "EX", 24 * 60 * 60);
  return result;
};

export default getContactStats;

if (require.main === module) {
  (async () => {
    const stats = await getContactStats();
    console.log("stats: ", stats);
    process.exit(0);
  })();
}
