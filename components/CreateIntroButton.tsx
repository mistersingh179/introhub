"use client";

import * as React from "react";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Contact, User } from "@prisma/client";
import { useRouter } from "next/navigation";

type CreateIntroButtonProps = {
  prospect: Contact;
  user: User;
};

const CreateIntroButton = (props: CreateIntroButtonProps) => {
  const { user, prospect } = props;
  const router = useRouter();
  return (
    <Button
      className={"w-fit"}
      onClick={() => {
        router.push(`/dashboard/introductions/create/${prospect.id}`);
      }}
    >
      Create Intro
      <SquarePen size={18} className={"ml-2"} />
    </Button>
  );
};

export default CreateIntroButton;
