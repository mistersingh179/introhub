"use client";

import { signInWithGoogleAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";

const MySignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <form action={signInWithGoogleAction}>
      <Input
        type={"hidden"}
        name={"callbackUrl"}
        value={callbackUrl ?? undefined}
      />
      <Button type={"submit"}>
        <div className={"mr-2"}>Sign-in with google</div>
        <LogIn size={"18px"} strokeWidth={"2px"} />
      </Button>
    </form>
  );
};

export default function SignIn() {
  return (
    <div className={"flex flex-col justify-center items-center gap-4"}>
      <div className={"font-bold text-purple-600"}>IntroHub</div>
      <div>
        <Suspense>
          <MySignInForm />
        </Suspense>
      </div>
    </div>
  );
}
