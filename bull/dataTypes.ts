import { DownloadMetaDataInput } from "@/services/downloadMetaData";
import {
  DownloadMessagesInput,
  DownloadMessagesOutput,
} from "@/services/downloadMessages";
import {User} from "@prisma/client";

export type MediumInputDataType =
  | DownloadMessagesInput
  | DownloadMetaDataInput
  | User
  | null;

export type MediumOutputDataType =
  | DownloadMessagesOutput
  | number
  | undefined
  | void;

export type MediumJobNames =
  | "downloadMessages"
  | "downloadMetaData"
  | "downloadMessagesForAllAccounts"
  | "buildContacts"
  | "buildContactsForAllUsers";
