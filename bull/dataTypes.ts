import { DownloadMetaDataInput } from "@/services/downloadMetaData";
import {
  DownloadMessagesInput,
  DownloadMessagesOutput,
} from "@/services/downloadMessages";
import { User } from "@prisma/client";
import { SendEmailInput } from "@/services/sendEmail";
import { gmail_v1 } from "googleapis";
import { EnrichContactInput } from "@/services/enrichContact";
import { OnBoardUserInput } from "@/services/onBoardUser";
import { SendProspectsCreatedTodayOutput } from "@/services/sendProspectsCreatedToday";
import Schema$Message = gmail_v1.Schema$Message;
import {ProcessAllFiltersForEmailOutput} from "@/services/processAllFiltersForEmail";

export type HighInputDataType = OnBoardUserInput | undefined;

export type ProxyCurlInputDataType = EnrichContactInput | null;

export type ApolloInputDataType = string | null;

export type MediumInputDataType =
  | DownloadMessagesInput
  | DownloadMetaDataInput
  | SendEmailInput
  | User
  | OnBoardUserInput
  | null;

export type HighOutputDataType = void | SendProspectsCreatedTodayOutput | ProcessAllFiltersForEmailOutput;

export type ProxyCurlOutputDataType = void;

export type ApolloOutputDataType = void | PeopleEnrichmentResponse;

export type MediumOutputDataType =
  | DownloadMessagesOutput
  | Schema$Message
  | number
  | undefined
  | void;

export type HighJobNames = "onBoardUser" | "sendProspectsCreatedToday" | "processAllFiltersForEmail";

export type ProxyCurlJobNames = "enrichContact" | "enrichAllContacts";

export type ApolloJobNames =
  | "enrichContactUsingApollo"
  | "enrichAllRemainingContactsUsingApollo";

export type MediumJobNames =
  | "downloadMessages"
  | "downloadMetaData"
  | "sendEmail"
  | "downloadMessagesForAllAccounts"
  | "buildContacts"
  | "buildContactsForAllUsers";
