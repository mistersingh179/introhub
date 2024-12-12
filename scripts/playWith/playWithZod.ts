import { z, ZodError } from "zod";

// @ts-ignore
// prisma.$on("query", (e) => {
//   const { timestamp, query, params, duration, target } = e;
//   console.log(query, params);
//   // console.log({ timestamp, params, duration, target });
// });

(async () => {
  console.log("in repl");

  const schema = z.object({
    name: z.string(),
    image: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: "Only image files are allowed",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Image size must be 5MB or less",
      })
      .optional(),
  });

  const fd = new FormData();
  fd.set("name", "hi");

  try {
    const ans = schema.parse({
      name: fd.get("name"),
    });
    console.table(ans);
  } catch (e) {
    console.log("got error parsing");
    if (e instanceof ZodError) {
      // console.log(e.errors)
      // console.log(e.format()?.name._errors);
      console.log(e.flatten());
    } else if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log("an unknown error has occurred: ", e);
    }
  }
})();

export {};
