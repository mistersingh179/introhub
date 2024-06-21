import prisma from "@/prismaClient";
import capitalize from 'capitalize';

type RecordWithCount<Key extends string> = {
  _count: Record<Key, number>;
} & Record<Key, string | null>;

const getUniqueValuesWithOrderPreserved = <Key extends string>(
  records: RecordWithCount<Key>[],
  key: Key
) => {
  console.log("Hello world: ", records);
  const uniqueJobTitles = new Map<string, null>();
  records.forEach(rec => {
    const trimmedValue = rec[key]?.trim();
    if (trimmedValue && trimmedValue !== "") {
      uniqueJobTitles.set(capitalize.words(trimmedValue), null);
    }
  });
  return [...uniqueJobTitles.keys()];
};

export default getUniqueValuesWithOrderPreserved;

if (require.main === module) {
  (async () => {
    const industriesWithCount = await prisma.companyProfile.groupBy({
      by: "industry",
      _count: {
        industry: true,
      },
      orderBy: {
        _count: {
          industry: 'desc'
        }
      }
    });

    const ans = getUniqueValuesWithOrderPreserved(industriesWithCount, "industry");
    console.log("ans: ", ans);
  })();
}