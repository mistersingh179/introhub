import { DownloadMetaDataInput } from "@/services/downloadMetaData";
import {
  DownloadMessagesInput,
  DownloadMessagesOutput,
} from "@/services/downloadMessages";
import { User } from "@prisma/client";
import { SendEmailInput } from "@/services/sendEmail";
import { gmail_v1 } from "googleapis";
import Schema$Message = gmail_v1.Schema$Message;
import { EnrichContactInput } from "@/services/enrichContact";
import { OnBoardUserInput } from "@/services/onBoardUser";

export type HighInputDataType = OnBoardUserInput;

export type ProxyCurlInputDataType = EnrichContactInput | null;

export type ApolloInputDataType = string | null;

export type MediumInputDataType =
  | DownloadMessagesInput
  | DownloadMetaDataInput
  | SendEmailInput
  | User
  | OnBoardUserInput
  | null;

export type HighOutputDataType = void;

export type ProxyCurlOutputDataType = void;

export type ApolloOutputDataType = void | PeopleEnrichmentResponse;

export type MediumOutputDataType =
  | DownloadMessagesOutput
  | Schema$Message
  | number
  | undefined
  | void;

export type HighJobNames = "onBoardUser";

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
