import {signOutAction} from "@/app/actions/auth";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";

const LogoutButton = () => {
  return (
    <form action={signOutAction} className={'p-0 m-0'}>
      <Button type={"submit"} variant="outline" size="icon" className={"w-8 h-8"}>
        <LogOut size={'16px'} className={"ml-2"}/>
      </Button>
    </form>
  );
};

export default LogoutButton