import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import * as React from "react";

const LogOutSimpleLink = () => {
  return (
    <>
      <form action={signOutAction} className={"inline my-0"}>
        <Button
          type={"submit"}
          className={"w-fit mx-0 py-0 h-fit px-0 underline text-inherit"}
          variant={"link"}
        >
          Log out
        </Button>
      </form>
    </>
  );
};

export default LogOutSimpleLink