import prisma from "@/prismaClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {buildS3ImageUrl} from "@/lib/url";

export default async function ShowContact({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  console.log("id: ", id);
  const contact = await prisma.contact.findFirstOrThrow({
    where: { id },
  });
  console.log("contact: ", contact);
  const personProfile = await prisma.personProfile.findFirstOrThrow({
    where: {
      email: contact.email,
    },
    include: {
      personExperiences: true,
    },
  });
  console.log("personProfile: ", personProfile);
  console.log(
    personProfile.personExperiences.map((pe) => pe.companyLinkedInUrl),
  );

  const companyProfiles = await prisma.companyProfile.findMany({
    where: {
      linkedInUrl: {
        in: personProfile.personExperiences.map((pe) => pe.companyLinkedInUrl),
      },
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
  console.dir(companyProfiles, { depth: 4 });
  return (
    <>
      <h1 className={"text-2xl my-2"}>Show Prospect</h1>
      <div className={'flex flex-row gap-8'}>
        <Avatar>
          <AvatarImage src={buildS3ImageUrl('avatar', personProfile.email)} title={'X'} />
          <AvatarFallback>X</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src={buildS3ImageUrl('logo', companyProfiles?.[0]?.website ?? "")} title={'X'} />
          <AvatarFallback>X</AvatarFallback>
        </Avatar>
      </div>
      <div className={"whitespace-pre-wrap bg-yellow-50 text-black dark:bg-yellow-950 dark:text-white my-2"}>
        {JSON.stringify(personProfile, null, 2)}
      </div>
      <div className={"whitespace-pre-wrap bg-yellow-50 text-black dark:bg-yellow-950 dark:text-white my-2"}>
        {JSON.stringify(companyProfiles, null, 2)}
      </div>
    </>
  );
}
