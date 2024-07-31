import { Button } from "@/components/ui/button";

const Approved = () => {
  return (
    <>
      <main className={"flex flex-col min-h-lvh justify-center items-center"}>
        <p className="hidden sm:block text-xl text-muted-foreground p-4 text-center">
          Thanks, {"I'll"} go ahead and make the intro now ✌️.
        </p>
        <p className="block sm:hidden text-xl text-muted-foreground p-4 text-center">
          Thanks, {"I'll"} make the intro now ✌️.
        </p>
      </main>
    </>
  );
};

export default Approved;
