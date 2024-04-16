import IntroApproveForm from "@/app/dashboard/introductions/list/IntroApproveForm";
import IntroRejectDialog from "@/app/dashboard/introductions/list/IntroRejecDialog";
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
        {introduction.facilitatorId === user.id && (
          <>
            <IntroApproveForm intro={introduction} />
            <IntroRejectDialog intro={introduction} />
          </>
        )}

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
