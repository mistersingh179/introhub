import {signOutAction} from "@/app/actions/auth";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";

const LogoutButton = () => {
  return (
    <form action={signOutAction}>
      <Button type={"submit"}>
        Logout
        <LogOut size={18} className={"ml-2"}/>
      </Button>
    </form>
  );
};

export default LogoutButton