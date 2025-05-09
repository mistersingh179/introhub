import prisma from "@/prismaClient";
import { Contact, PersonExperience, PersonProfile, User } from "@prisma/client";
import { auth } from "@/auth";
import { Session } from "next-auth";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import {
  CompanyBox,
  getCategoryNames,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import getProfiles from "@/services/getProfiles";

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
  const email = contact.email;
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  const { personExp, companyProfile, personProfile } = getProfiles(
    email,
    emailToProfile,
    companyUrlToProfile,
  );
  const categoryNames = getCategoryNames(companyProfile);

  return (
    <div className={"flex flex-col gap-4 my-4"}>
      <h1 className={"text-2xl"}>Create an Introduction</h1>
      <div className={"flex flex-col md:flex-row gap-8"}>
        <ProspectBox
          contact={contact}
          personProfile={personProfile}
          personExp={personExp}
        />
        <CompanyBox companyProfile={companyProfile} personExp={personExp} />
      </div>
    </div>
  );
}
