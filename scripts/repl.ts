import prisma from "../prismaClient";
import redisClient from "@/lib/redisClient";
import ProxyCurlQueue from "@/bull/queues/proxyCurlQueue";
import { PersonExperience, Prisma, User } from "@prisma/client";
import { ContactWithUserInfo } from "@/app/dashboard/prospects/page";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import { distance } from "fastest-levenshtein";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  // console.log("***");
  // console.log(query, params);
  // console.log("***");
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("hello world from repl");
  const email = "rod@introhub.net";
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  console.dir(emailToProfile, { depth: 3 });
  console.dir(companyUrlToProfile, { depth: 3 });

  const emailDomainName = 'arrowheadcenter.nmsu.edu'; // email.match(/@(.*)/)?.[0]!;
  const personalProfile = emailToProfile[email];

  const bestPe = personalProfile.personExperiences.reduce<PersonExperience>((pe, cv) => {
    const existingDistance = distance(
      emailDomainName,
      companyUrlToProfile[pe.companyLinkedInUrl].website!,
    );
    const newDistance = distance(
      emailDomainName,
      companyUrlToProfile[cv.companyLinkedInUrl].website!,
    );
    if (newDistance < existingDistance) {
      return cv;
    } else {
      return pe;
    }
  }, personalProfile.personExperiences[0]);

  personalProfile.personExperiences.map((pe) => {
    const cp = companyUrlToProfile[pe.companyLinkedInUrl];
    distance(cp.website!, emailDomainName!);
  });

  console.log("bestPe", bestPe);
})();

export {};
