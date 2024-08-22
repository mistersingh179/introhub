import { DownloadMetaDataInput } from "@/services/downloadMetaData";
import {
  DownloadMessagesInput,
  DownloadMessagesOutput,
} from "@/services/downloadMessages";
import { Introduction, User } from "@prisma/client";
import { SendEmailInput } from "@/services/emails/sendEmail";
import { gmail_v1 } from "googleapis";
import { EnrichContactInput } from "@/services/enrichContact";
import { OnBoardUserInput } from "@/services/onBoardUser";
import { SendProspectsCreatedTodayOutput } from "@/services/emails/sendProspectsCreatedToday";
import Schema$Message = gmail_v1.Schema$Message;
import { ProcessAllFiltersForEmailOutput } from "@/services/process/processAllFiltersForEmail";

export type HighInputDataType = OnBoardUserInput | undefined | User;

export type ProxyCurlInputDataType = EnrichContactInput | null;

export type ApolloInputDataType = string | null;

export type MediumInputDataType =
  | DownloadMessagesInput
  | DownloadMetaDataInput
  | SendEmailInput
  | User
  | OnBoardUserInput
  | null;

export type HighOutputDataType =
  | void
  | SendProspectsCreatedTodayOutput
  | ProcessAllFiltersForEmailOutput
  | Introduction
  | null;

export type ProxyCurlOutputDataType = void;

export type ApolloOutputDataType = void | PeopleEnrichmentResponse;

export type MediumOutputDataType =
  | DownloadMessagesOutput
  | Schema$Message
  | number
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

export type MediumJobNames =
  | "downloadMessages"
  | "downloadMetaData"
  | "sendEmail"
  | "downloadMessagesForAllAccounts"
  | "buildContacts"
  | "buildContactsForAllUsers";
