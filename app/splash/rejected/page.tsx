import { Button } from "@/components/ui/button";

const Rejected = () => {
  return (
    <>
      <main className={"flex flex-col min-h-lvh justify-center items-center"}>
        <p className="hidden sm:block text-xl text-muted-foreground p-4 text-center">
          Okay, {"I'll"} go ahead and deny the intro request. 🫡️
        </p>
        <p className="block sm:hidden text-xl text-muted-foreground p-4 text-center">
          Okay, {"I'll"} deny the intro request. 🫡
        </p>
      </main>
    </>
  );
};

export default Rejected;
