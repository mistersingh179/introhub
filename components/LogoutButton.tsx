import {signOutAction} from "@/app/actions/auth";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";

const LogoutButton = () => {
  return (
    <form action={signOutAction} className={'p-0 m-0'}>
      <Button type={"submit"} variant={'link'} className={'pl-0 m-0 h-4 w-full'}>
        Logout
        <LogOut size={'16px'} className={"ml-2"}/>
      </Button>
    </form>
  );
};

export default LogoutButton