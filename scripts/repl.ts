import prisma from "../prismaClient";
import sleep from "@/lib/sleep";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { startOfToday, subDays } from "date-fns";
import getProspectsBasedOnFilters, {
  PaginatedValues,
  SelectedFilterValues,
} from "@/services/getProspectsBasedOnFilters";
import {IntroStates} from "@/lib/introStates";
import getFirstName from "@/services/getFirstName";
import getAllProfiles from "@/services/getAllProfiles";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles"; // path to your JSON key file

// @ts-ignore
prisma.$on("query", (e) => {
  // const { timestamp, query, params, duration, target } = e;
  // console.log("***");
  // console.log(query, params);
  // console.log("***");
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  console.log("hello world fro repl!")

  const users = await prisma.user.findMany({
    where: {
      agreedToAutoProspecting: true,
    },
  });

  console.log(users.length);


  // const intros = await prisma.introduction.findMany({
  //   where:{
  //     messageForContact: "",
  //     status: IntroStates["introducing email sent"],
  //     // requester:{
  //     //   email: 'rod@introhub.net'
  //     // }
  //   },
  //   include: {
  //     requester: true,
  //     facilitator: true,
  //     contact: true,
  //   },
  //   // take: 10
  // })
  // for(const intro of intros){
  //   let emails = [
  //     intro.contact.email!,
  //     intro.requester.email!,
  //     intro.facilitator.email!,
  //   ];
  //
  //   const { emailToProfile, companyUrlToProfile } =
  //     await getEmailAndCompanyUrlProfiles(emails);
  //   const { contactProfiles, requestProfiles, facilitatorProfiles } =
  //     getAllProfiles(intro, emailToProfile, companyUrlToProfile);
  //
  //   const requesterName = getFirstName(
  //     requestProfiles.personProfile.fullName,
  //     "An IntroHub user",
  //   );
  //   const contactName = getFirstName(contactProfiles.personProfile?.fullName);
  //   if(!contactName){
  //     continue;
  //   }
  //   const subject  = `Introduction: ${contactName} & ${requesterName}`
  //   const message = await prisma.message.findMany({
  //     where:{
  //       userId: intro.requesterId,
  //       subject
  //     }
  //   })
  //   // console.log("intro: ", intro);
  //   console.log("subject: ", subject);
  //   if(message.length === 1){
  //     console.log("message:  ",message.length, message);
  //     const threadId = message[0].threadId;
  //
  //     console.log("threadId: ", threadId);
  //     if(!intro.threadId){
  //       await prisma.introduction.update({
  //         where:{
  //           id: intro.id
  //         },
  //         data:{
  //           threadId
  //         }
  //       })
  //     }
  //
  //     // const messages = await prisma.message.findMany({
  //     //   where: {
  //     //     userId: intro.requesterId,
  //     //     threadId
  //     //   }
  //     // })
  //     //
  //     // console.log("messages: ", messages.length, messages);
  //   }
  //
  //   console.log("***")
  // }
})();

export {};
