import { DownloadMetaDataInput } from "@/services/downloadMetaData";
import {
  DownloadMessagesInput,
  DownloadMessagesOutput,
} from "@/services/downloadMessages";
import { User } from "@prisma/client";
import { SendEmailInput } from "@/services/sendEmail";
import { gmail_v1 } from "googleapis";
import Schema$Message = gmail_v1.Schema$Message;

export type MediumInputDataType =
  | DownloadMessagesInput
  | DownloadMetaDataInput
  | SendEmailInput
  | User
  | null;

export type MediumOutputDataType =
  | DownloadMessagesOutput
  | Schema$Message
  | number
  | undefined
  | void;

export type MediumJobNames =
  | "downloadMessages"
  | "downloadMetaData"
  | "sendEmail"
  | "downloadMessagesForAllAccounts"
  | "buildContacts"
  | "buildContactsForAllUsers";
