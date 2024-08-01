import ProfileImageForm from "@/app/dashboard/profile/ProfileImageForm";
import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import getProfiles from "@/services/getProfiles";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import Link from "next/link";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";

export default async function Profile() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });

  const email = user.email!;
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  const profiles = getProfiles(email, emailToProfile, companyUrlToProfile);

  return (
    <>
      <div className={"flex flex-row justify-start items-center gap-4"}>
        <h1 className={"text-2xl my-4"}>Profile</h1>
      </div>
      <div className={"flex flex-col gap-4"}>
        <ProfileImageForm user={user}/>
        <div>Name: {user.name} </div>
        <div>Job Title: {profiles.personExp.jobTitle} </div>
        <div className={'flex flex-row gap-4 items-center'}>
          <div>Personal LinkedIn Url:</div>
          <LinkWithExternalIcon href={profiles.personProfile.linkedInUrl!}/>
        </div>
        <div className={'flex flex-row gap-4 items-center'}>
          <div>Company LinkedIn Url:</div>
          <LinkWithExternalIcon href={profiles.companyProfile.linkedInUrl}/>
        </div>
      </div>
    </>
  );
}
