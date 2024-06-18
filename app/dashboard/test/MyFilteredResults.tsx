import prisma from "@/prismaClient";

const MyFilteredResults = async ({
  searchParams,
}: {
  searchParams: { limit: number };
}) => {
  console.log(searchParams);

  const prospects = await prisma.contact.findMany({
    take: Number(searchParams.limit),
  });
  return (
    <>
      <h3>My Filtered Resuts:</h3>
      <div className={'whitespace-pre'}>{JSON.stringify(prospects, null, 2)}</div>
    </>
  );
};

export default MyFilteredResults;
