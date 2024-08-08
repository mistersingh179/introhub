import { cache } from "react";

const foo = cache(async (id: string) => {
  console.log("*** in foo");
});

export default foo;
