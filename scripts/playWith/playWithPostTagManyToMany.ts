import prisma from "../../prismaClient";
import { Prisma } from "@prisma/client";

// @ts-ignore
prisma.$on("query", (e) => {
  const { timestamp, query, params, duration, target } = e;
  console.log(query, params);
  // console.log({ timestamp, params, duration, target });
});

(async () => {
  // const data: PostCreateInput = {
  //   title: "article 3",
  //   tags: {
  //     create: [
  //       {
  //         tag: {
  //           connectOrCreate: {
  //             create: {
  //               name: "nice",
  //             },
  //             where: {
  //               name: "nice",
  //             },
  //           },
  //         },
  //       },
  //       {
  //         tag: {
  //           connectOrCreate: {
  //             create: {
  //               name: "excellent",
  //             },
  //             where: {
  //               name: "excellent",
  //             },
  //           },
  //         },
  //       },
  //       {
  //         tag: {
  //           connectOrCreate: {
  //             create: {
  //               name: "fresh",
  //             },
  //             where: {
  //               name: "fresh",
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   },
  // };
  // const post = await prisma.post.create({
  //   data,
  // });

  // const postsWithTag = await prisma.post.findMany({
  //   where: {
  //     tags: {
  //       some: {
  //         tag: {
  //           name: 'nice'
  //         }
  //       }
  //     }
  //   },
  //   include: {
  //     tags: {
  //       include: {
  //         tag: true
  //       }
  //     }
  //   }
  // })
  // console.dir(postsWithTag, {depth: 4})

  const tag = await prisma.tag.findMany({
    where: {
      // name: 'nice',
    },
    include: {
      _count: true,
      posts: {
        include: {
          post: true,
        },
      },
    },
  });
  console.dir(tag, { depth: 4 });
})();

export {};
