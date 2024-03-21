import {z, ZodError} from "zod";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {

  console.log("in repl");

  const schema = z.object({
    name: z.string(),
    age: z.coerce.number(),
    address: z.string().optional()
  })

  const fd = new FormData()
  fd.set("name", "hi");
  fd.set("age", "5");
  fd.set("address", "hello st");

  try{
    const ans = schema.parse({
      name: fd.get("name"),
      age: fd.get("age"),
      address: fd.get("address")
    });
    console.log("ans: ", ans);
  }catch(e){
    console.log("got error parsing");
    if(e instanceof ZodError){
      // console.log(e.errors)
      // console.log(e.format()?.name._errors);
      console.log(e.flatten())
    }else if (e instanceof Error){
      console.log(e.message)
    }else{
      console.log("an unknown error has occurred: ", e);
    }

  }




})();

export {};
