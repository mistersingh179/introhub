import { redirect } from "next/navigation";
import {PlatformGroupName} from "@/app/utils/constants";

type SearchParams = { groupName?: string };

export default async function RootPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let { groupName } = searchParams;
  groupName = groupName || PlatformGroupName;

  console.log("In root page redirect: ", searchParams, groupName);
  redirect(`/dashboard/home?groupName=${groupName}`);
}
