"use client";

import { signInWithGoogleAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import React, { Suspense } from "react";
import googleImage from "../web_light_sq_ctn@1x.png";
import Image from "next/image";

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
      <Button type={"submit"} className={"m-0 p-0"}>
        <Image
          src={googleImage}
          alt={"google logo"}
          className="hover:brightness-90"
        />
      </Button>

      {/*<Button type={"submit"}>*/}
      {/*  <img*/}
      {/*    className="w-6 h-6"*/}
      {/*    src="https://www.svgrepo.com/show/475656/google-color.svg"*/}
      {/*    alt="Google logo"*/}
      {/*  />*/}
      {/*  <div className={"ml-2"}>Continue with Google</div>*/}
      {/*</Button>*/}
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
