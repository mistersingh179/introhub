"use client";

import { Input } from "@/components/ui/input";
import uploadProfileImageAction from "@/app/actions/profile/uploadProfileImageAction";
import { useFormState } from "react-dom";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import * as React from "react";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getS3Url } from "@/lib/url";
import { getInitials } from "@/app/dashboard/UserProfileImageNav";
import { User } from "@prisma/client";

type ProfileImageFormProps = {
  user: User;
};

const ProfileImageForm = (props: ProfileImageFormProps) => {
  const { user } = props;
  const action = uploadProfileImageAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);

  return (
    <form action={dispatch} className={"flex flex-col gap-4"}>
      <ShowChildren showIt={!!errorMessage}>
        <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
      </ShowChildren>
      <div
        className={
          "flex flex-col items-start md:flex-row md:items-center gap-4"
        }
      >
        <Avatar className={"w-24 h-24"}>
          <AvatarImage
            src={getS3Url("user-profile-images", user.profileImageName ?? "")}
            alt={user.name ?? undefined}
            referrerPolicy={"no-referrer"}
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <Input type={"file"} name={"profileImage"} className={"w-64"} />
        <SubmitButton label={"Update Image"} />
      </div>
    </form>
  );
};

export default ProfileImageForm;
