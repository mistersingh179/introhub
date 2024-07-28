import IntroCancelForm from "@/app/dashboard/introductions/list/IntroCancelForm";
import { User } from "@prisma/client";
import { IntroWithContactFacilitatorAndRequester } from "@/app/dashboard/introductions/list/page";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  introduction: IntroWithContactFacilitatorAndRequester;
  user: User;
  className?: string;
};

const ActionButtons = (props: ActionButtonProps) => {
  const { introduction, user, className } = props;

  return (
    <>
      <div className={cn("flex flex-col gap-4", className)}>
        {introduction.requesterId === user.id && (
          <>
            <IntroCancelForm intro={introduction} />
          </>
        )}
      </div>
    </>
  );
};

export default ActionButtons;
