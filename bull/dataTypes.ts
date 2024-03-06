import { DownloadMetaDataInput } from "@/services/downloadMetaData";
import {
  DownloadMessagesInput,
  DownloadMessagesOutput,
} from "@/services/downloadMessages";

export type MediumInputDataType =
  | DownloadMessagesInput
  | DownloadMetaDataInput
  | null;

export type MediumOutputDataType =
  | DownloadMessagesOutput
  | number
  | undefined
  | void;

export type MediumJobNames =
  | "downloadMessages"
  | "downloadMetaData"
  | "setupDownloadMessages";
