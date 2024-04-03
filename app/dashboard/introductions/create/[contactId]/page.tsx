import prisma from "@/prismaClient";
import CreateIntroductionForm from "@/app/dashboard/introductions/create/[contactId]/CreatIntroductionForm";
import {
  CompanyProfile,
  Contact,
  PersonExperience,
  PersonProfile,
  User,
} from "@prisma/client";
import {auth} from "@/auth";
import {Session} from "next-auth";

export type ContactWithUser = Contact & { user: User };
export type PersonProfileWithExperiences = PersonProfile & {
  personExperiences: PersonExperience[];
};

export default async function Introductions({
  params,
  searchParams,
}: {
  params: { contactId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("*** with params: ", params);
  console.log("*** with searchParams: ", searchParams);
  const session = (await auth()) as Session;
  const user: User = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const contact: ContactWithUser = await prisma.contact.findFirstOrThrow({
    where: { id: params.contactId },
    include: {
      user: true,
    },
  });
  const personProfile: PersonProfileWithExperiences =
    await prisma.personProfile.findFirstOrThrow({
      where: {
        email: contact.email,
      },
      include: {
        personExperiences: true,
      },
    });
  const personExperience: PersonExperience = personProfile.personExperiences[0];

  const companyProfile: CompanyProfile =
    await prisma.companyProfile.findFirstOrThrow({
      where: {
        linkedInUrl: personExperience?.companyLinkedInUrl,
      },
    });

  return (
    <>
      <h1 className={"text-2xl my-4"}>
        Create an Introduction – {contact.email}
      </h1>
      <CreateIntroductionForm
        contact={contact}
        personProfile={personProfile}
        personExperience={personExperience}
        companyProfile={companyProfile}
        user={user}
      />
    </>
  );
}
