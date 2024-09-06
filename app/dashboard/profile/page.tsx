import ProfileImageForm from "@/app/dashboard/profile/ProfileImageForm";
import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import getProfiles from "@/services/getProfiles";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";
import RefreshScopesForm from "@/app/dashboard/home/RefreshScopesForm";
import ShowChildren from "@/components/ShowChildren";
import { Badge } from "@/components/ui/badge";
import ProfileStatusUpdateForm from "@/app/dashboard/profile/ProfileStatusUpdateForm";

export default async function Profile() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });

  const email = user.email!;
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  const profiles = getProfiles(email, emailToProfile, companyUrlToProfile);

  const emailsCount = await prisma.message.count({
    where: {
      userId: user.id,
    },
  });
  const contactsCount = await prisma.contact.count({
    where: {
      userId: user.id,
    },
  });

  const googleAccount = user.accounts?.find((a) => a.provider === "google");
  const scopes = googleAccount?.scope?.split(" ") ?? [];
  const sendScope = `https://www.googleapis.com/auth/gmail.send`;
  const foundSendScope = !!scopes.find((val) => val === sendScope);

  return (
    <>
      <div className={"flex flex-row justify-start items-center gap-4"}>
        <h1 className={"text-2xl my-4"}>Profile</h1>
      </div>
      <div className={"flex flex-col gap-4"}>
        <ProfileImageForm user={user} />
        <div className={"flex flex-row"}>
          <div className={"min-w-48 self-center"}>Status :</div>
          <div className={"flex flex-row gap-4 items-center"}>
            {user.agreedToAutoProspecting && (
              <>
                <div>IntroHub is currently ON</div>
                <ProfileStatusUpdateForm setAgreedTo={false} />
              </>
            )}
            {!user.agreedToAutoProspecting && (
              <>
                <div>IntroHub is currently OFF</div>
                <ProfileStatusUpdateForm setAgreedTo={true} />
              </>
            )}
          </div>
        </div>
        <div className={"flex flex-row"}>
          <div className={"min-w-48"}>Name :</div>
          <div>{user.name}</div>
        </div>
        <div className={"flex flex-row"}>
          <div className={"min-w-48"}>Job Title :</div>
          {profiles.personExp.jobTitle && (
            <div>{profiles.personExp.jobTitle}</div>
          )}
          {!profiles.personExp.jobTitle && (
            <Badge variant={"destructive"}>Missing</Badge>
          )}
        </div>
        <div className={"flex flex-row items-center"}>
          <div className={"min-w-48 "}>Personal LinkedIn Url :</div>
          <div>
            {profiles.personProfile?.linkedInUrl && (
              <LinkWithExternalIcon href={profiles.personProfile.linkedInUrl} />
            )}
            {!profiles.personProfile?.linkedInUrl && (
              <Badge variant={"destructive"}>Missing</Badge>
            )}
          </div>
        </div>
        <div className={"flex flex-row items-center"}>
          <div className={"min-w-48"}>Company LinkedIn Url :</div>
          {profiles.companyProfile.linkedInUrl && (
            <LinkWithExternalIcon href={profiles.companyProfile.linkedInUrl} />
          )}
          {!profiles.companyProfile.linkedInUrl && (
            <Badge variant={"destructive"}>Missing</Badge>
          )}
        </div>
        <div className={"flex flex-row items-center"}>
          <div className={"min-w-48"}>Contacts :</div>
          <div>{contactsCount}</div>
        </div>
        <div className={"flex flex-row items-center"}>
          <div className={"min-w-48 "}>Emails :</div>
          <div>{emailsCount}</div>
        </div>
        <div className={"flex flex-row items-center"}>
          <div className={"min-w-48"}>User Id :</div>
          <div>{user.id}</div>
        </div>
        <div className={"flex flex-row items-center"}>
          <div className={"min-w-48 flex flex-row items-center"}>
            Google Scope : <RefreshScopesForm />{" "}
          </div>
          <div>
            <ShowChildren showIt={scopes.length > 0}>
              <ul className={"list-disc ml-4"}>
                {scopes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </ShowChildren>
            <ShowChildren showIt={scopes.length == 0}>None</ShowChildren>
          </div>
        </div>
      </div>
    </>
  );
}
