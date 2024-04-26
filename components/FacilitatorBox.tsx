"use client";

import { PersonExperience, User } from "@prisma/client";
import { UserAvatar } from "@/app/dashboard/introductions/list/IntroTable";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const FacilitatorBox = ({
  user,
  personExp,
}: {
  user: User;
  personExp: PersonExperience;
}) => {
  const searchParams = useSearchParams();
  const blur = searchParams.get("blur");
  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center",
        blur ? "blur-sm" : null,
      )}
    >
      <UserAvatar user={user} />
      <div className={"flex flex-col gap-2"}>
        <div>{user.name}</div>
        {personExp.jobTitle && (
          <p className={"text-muted-foreground"}>{personExp.jobTitle} </p>
        )}
      </div>
    </div>
  );
};

export default FacilitatorBox;
