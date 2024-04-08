import prisma from "../../prismaClient";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  // await prisma.contact.create({
  //   data: {
  //     email: 'sandeep45@gmail.com',
  //     userId: 'cltrr4xxi00002j7clqcguiet',
  //     sentCount: 1,
  //     receivedCount: 1,
  //     sentReceivedRatio: 1,
  //     id: randomUUID()
  //   }
  // })

  await prisma.companyProfile.delete({
    where: {
      linkedInUrl: "https://www.linkedin.com/company/brandweaver-ai",
    },
  });
  await prisma.personProfile.delete({
    where: {
      email: "sandeep45@gmail.com",
    },
  });
  await prisma.reverseEmailLookupEndpoint.delete({
    where: {
      email: "sandeep45@gmail.com",
    },
  });
  await prisma.companyProfileEndpoint.delete({
    where: {
      url: "https://www.linkedin.com/company/brandweaver-ai",
    },
  });
})();

export {};
