import { signOutAction } from "@/app/actions/auth";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import {auth} from "@/auth";
import {Session} from "next-auth";

export default async function Home() {
  const session = await auth() as Session;
  return (
    <>
      <h1>At Home</h1>
      <pre className={'bg-yellow-50 my-4'}>
        {JSON.stringify(session, null, 2)}
      </pre>
    </>
  );
}
