import {
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
} from "@react-email/components";
import { render } from "@react-email/render";
import * as React from "react";
import { ContactWithUser } from "@/app/dashboard/introductions/create/[contactId]/page";
import {
  CompanyUrlToProfile,
  EmailToProfile,
} from "@/services/getEmailAndCompanyUrlProfiles";
import { Profiles } from "@/app/dashboard/introductions/list/IntroTable";
import { buildS3ImageUrl } from "@/lib/url";
import { PersonExperience } from "@prisma/client";
import getClosestPersonExp from "@/services/helpers/getClosestPersonExp";
import { lightFormat } from "date-fns";

type NewProspectsProps = {
  prospectsWithUser: ContactWithUser[];
  emailToProfile: EmailToProfile;
  companyUrlToProfile: CompanyUrlToProfile;
  date: Date;
};

const getProfiles = (
  email: string,
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
): Profiles => {
  const personProfile = emailToProfile[email];
  const personExp = (getClosestPersonExp(
    email,
    emailToProfile,
    companyUrlToProfile,
  ) ?? {}) as PersonExperience;

  const companyProfile =
    companyUrlToProfile[personExp.companyLinkedInUrl] || {};
  return { personProfile, personExp, companyProfile };
};

const NewProspects = (props: NewProspectsProps) => {
  const { prospectsWithUser, emailToProfile, companyUrlToProfile, date } =
    props;
  const personProfiles = Object.values(emailToProfile || {});
  const companyNames = personProfiles
    .map((pp) => pp.personExperiences?.[0]?.companyName ?? "")
    .join(", ");
  const count = prospectsWithUser.length;
  return (
    <>
      <Html lang="en" dir="ltr">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Preview> {companyNames || "nothing here to see :-/"} </Preview>
        <Container>
          <Heading as="h2">
            {count} New Prospect{count == 1 ? "" : "s"} –{" "}
            {lightFormat(date, "MM-dd-yyyy")}
          </Heading>
          <Hr />
          <Tailwind>
            <table
              style={{
                borderCollapse: "separate",
                borderSpacing: "2em",
              }}
            >
              {prospectsWithUser.map((prospect) => {
                const contactProfiles = getProfiles(
                  prospect.email,
                  emailToProfile,
                  companyUrlToProfile,
                );

                return (
                  <tr key={prospect.id}>
                    <td>
                      <a
                        href={`${process.env.BASE_API_URL}/dashboard/prospects/${prospect.id}`}
                        target={"_blank"}
                        className={"no-underline text-current"}
                      >
                        <img
                          className={"rounded-full"}
                          src={buildS3ImageUrl("avatar", prospect.email ?? "")}
                          alt={"avatar"}
                          width="50"
                          height="50"
                        />
                        <div>{contactProfiles.personProfile.fullName}</div>
                        <div>{contactProfiles.personExp.jobTitle}</div>
                      </a>
                    </td>
                    <td>
                      <a
                        href={`${process.env.BASE_API_URL}/dashboard/prospects/${prospect.id}`}
                        target={"_blank"}
                        className={"no-underline text-current"}
                      >
                        <img
                          className={"rounded-full"}
                          src={buildS3ImageUrl(
                            "logo",
                            contactProfiles.companyProfile.website ?? "",
                          )}
                          alt={"logo"}
                          width="50"
                          height="50"
                        />

                        <div>{contactProfiles.personExp.companyName}</div>
                        <div>{contactProfiles.companyProfile.industry}</div>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </table>
          </Tailwind>
        </Container>
      </Html>
    </>
  );
};

export default NewProspects;

export const getNewProspectsHtml = (
  prospectsWithUser: ContactWithUser[],
  emailToProfile: EmailToProfile,
  companyUrlToProfile: CompanyUrlToProfile,
  date: Date,
) => {
  return render(
    <NewProspects
      prospectsWithUser={prospectsWithUser}
      emailToProfile={emailToProfile}
      companyUrlToProfile={companyUrlToProfile}
      date={date}
    />,
    {
      pretty: true,
    },
  );
};
