import prisma from "@/prismaClient";

export default async function EditIntroduction({
  params,
}: {
  params: { id: string };
}) {
  const introduction = await prisma.introduction.findFirstOrThrow({
    where: {
      id: params.id,
    },
  });
  return (
    <>
      <h1 className={"text-2xl my-2"}>Edit Introduction – {introduction.id}</h1>
    </>
  );
}
