const UnableToProcessRequest = () => {
  return (
    <>
      <main className={"flex flex-col min-h-lvh justify-center items-center"}>
        <p className="hidden sm:block text-xl text-muted-foreground p-4 text-center">
          Sorry, but I am unable to process your request. 🤷‍♂️️
        </p>
        <p className="block sm:hidden text-xl text-muted-foreground p-4 text-center">
          Sorry, Unable to process request. 🤷‍♂️️
        </p>
      </main>
    </>
  );
};

export default UnableToProcessRequest;
