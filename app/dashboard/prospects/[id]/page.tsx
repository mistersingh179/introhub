import prisma from "@/prismaClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buildS3ImageUrl } from "@/lib/url";
import Link from "next/link";
import { ExternalLink, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import getEmailAndCompanyUrlProfiles, {
  CompanyProfileWithCategories,
} from "@/services/getEmailAndCompanyUrlProfiles";
import {
  CompanyBox,
  getCategoryNames,
  getProfiles,
  ProspectBox,
} from "@/app/dashboard/introductions/list/IntroTable";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { Session } from "next-auth";
import LinkWithExternalIcon from "@/components/LinkWithExternalIcon";
import ShowChildren from "@/components/ShowChildren";

export default async function ShowContact({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
  });
  const { id } = params;
  const contact = await prisma.contact.findFirstOrThrow({
    where: { id },
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
    <>
      <div className={"flex flex-col gap-4 mt-6"}>
        <div className={"flex flex-row gap-8 items-center"}>
          <h1 className={"text-2xl my-2"}>Prospect Profile</h1>
          <ShowChildren showIt={contact.userId !== user.id}>
            <Button asChild className={"max-w-96"}>
              <Link href={`/dashboard/introductions/create/${id}`}>
                Create Intro
                <SquarePen size={18} className={"ml-2"} />
              </Link>
            </Button>
          </ShowChildren>
        </div>
        <ProspectBox
          contact={contact}
          personProfile={personProfile}
          personExp={personExp}
          showLinkedInUrls={true}
        />
        <CompanyBox companyProfile={companyProfile} personExp={personExp} showLinkedInUrls={true} />

        <div className={"flex flex-row gap-4"}>
          <div>Job Description:</div>
          <div>{personExp.jobDescription}</div>
        </div>

        <div className={"flex flex-row gap-4 items-center"}>
          <div>Website:</div>
          <div>
            <LinkWithExternalIcon href={companyProfile.website!} />
          </div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Size Range:</div>
          <div>
            {companyProfile.sizeFrom} - {companyProfile.sizeTo}
          </div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Size:</div>
          <div>{companyProfile.size}</div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Location:</div>
          <div>
            {personProfile.city} {personProfile.state} {personProfile.country}
          </div>
        </div>

        <div className={"flex flex-row gap-4"}>
          <div>Industry:</div>
          <div>{companyProfile.industry}</div>
        </div>

        <ShowChildren showIt={!!companyProfile.foundedYear}>
          <div className={"flex flex-row gap-4"}>
            <div>Founded Year:</div>
            <div>{companyProfile.foundedYear}</div>
          </div>
        </ShowChildren>

        <ShowChildren showIt={categoryNames.length > 0}>
          <div className={"flex flex-row gap-4"}>
            <div>Company Categories:</div>
            <div className={"space-x-2"}>
              {categoryNames.map((x) => (
                <Badge key={"x"}>{x}</Badge>
              ))}
            </div>
          </div>
        </ShowChildren>
      </div>
    </>
  );
}