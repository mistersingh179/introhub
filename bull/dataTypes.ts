import { DownloadMetaDataInput } from "@/services/downloadMetaData";
import {
  DownloadMessagesInput,
  DownloadMessagesOutput,
} from "@/services/downloadMessages";
import { Introduction, PersonProfile, User } from "@prisma/client";
import { SendEmailInput } from "@/services/emails/sendEmail";
import { gmail_v1 } from "googleapis";
import { EnrichContactInput } from "@/services/enrichContact";
import { OnBoardUserInput } from "@/services/onBoardUser";
import { SendProspectsCreatedTodayOutput } from "@/services/emails/sendProspectsCreatedToday";
import Schema$Message = gmail_v1.Schema$Message;
import { ProcessAllFiltersForEmailOutput } from "@/services/process/processAllFiltersForEmail";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/pendingQueue/page";

export type HighInputDataType = OnBoardUserInput | undefined | User;

export type ProxyCurlInputDataType = EnrichContactInput | null;

export type ApolloInputDataType = string | null;

export type OpenAiInputDataType = PersonProfile | null;

export type MediumInputDataType =
  | DownloadMessagesInput
  | DownloadMetaDataInput
  | SendEmailInput
  | User
  | OnBoardUserInput
  | undefined
  | null;

export type HighOutputDataType =
  | void
  | SendProspectsCreatedTodayOutput
  | ProcessAllFiltersForEmailOutput
  | Introduction
  | null;

export type ProxyCurlOutputDataType = void;

export type ApolloOutputDataType = void | PeopleEnrichmentResponse;

export type OpenAiOutputDataType = void;

export type MediumOutputDataType =
  | DownloadMessagesOutput
  | Schema$Message
  | IntroWithContactFacilitatorAndRequester[]
  | number
  | string
  | undefined
  | void;

export type HighJobNames =
  | "onBoardUser"
  | "sendProspectsCreatedToday"
  | "processAllFiltersForEmail"
  | "sendEmailForAllApprovedIntros"
  | "processUserForAutoProspecting"
  | "processAllUsersForAutoProspecting";

export type ProxyCurlJobNames = "enrichContact" | "enrichAllContacts";

export type ApolloJobNames =
  | "peopleEnrichmentApiResponse"
  | "enrichContactUsingApollo"
  | "enrichAllRemainingContactsUsingApollo"
  | "enrichAllRemainingUsersUsingApollo";

export type OpenAiJobNames =
  | "addLlmDescriptionOnPersonProfile"
  | "addLlmDescriptionOnAll";

export type MediumJobNames =
  | "downloadMessages"
  | "downloadMetaData"
  | "sendEmail"
  | "processOldPendingApprovalIntros"
  | "downloadMessagesForAllAccounts"
  | "buildContacts"
  | "buildContactsForAllUsers"
  | "buildThreadIds"
  | "sendIntroDigestEmail"
  | "processAllUsersForIntroDigest"
  | "setupMailboxWatchOnAllAccounts";
