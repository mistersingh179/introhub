import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  HeadObjectCommand,
  NotFound, ListObjectsCommand,
} from "@aws-sdk/client-s3";
import loadEnvVariables from "@/lib/loadEnvVariables";

(async () => {
  console.log("hello world from repl");
  loadEnvVariables();

  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
  console.log(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

  const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });

  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
  console.log("bucketName: ", bucketName);

  const listAns = await s3Client.send(
    new ListObjectsCommand({
      Bucket: bucketName,
      MaxKeys: 100000
    })
  )
  const images = listAns?.Contents ?? [];
  for(const item of images){
    const HeadAns = await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: item.Key
      })
    );
    console.log(item.Key, HeadAns.ContentType);
    const badHeaders = ["application/xml", "image/svg+xml", "text/plain"]
    if(HeadAns.ContentType && badHeaders.includes(HeadAns.ContentType)){
      console.log("delete!");
      const DeleteAns = await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: item.Key
        })
      );
      console.log(DeleteAns)
    }
  }

  // const resp = await fetch(
  //   "https://introhub-production.s3.us-east-2.amazonaws.com/avatar/fca8b528c5b75b9ba1afb4454a1432d8",
  // );
  // console.log(resp.headers.get("content-type"));
  // const arrayBuffer = await resp.arrayBuffer();
  // const buffer = Buffer.from(arrayBuffer);
  //
  // console.log(buffer);

  // const result = await s3Client.send(
  //   new PutObjectCommand({
  //     Bucket: bucketName,
  //     Key: "foo-bar/foo.png",
  //     Body: buffer,
  //   }),
  // );

  // console.log("result: ", result);

  // await s3Client.send(
  //   new DeleteObjectCommand({
  //     Bucket: bucketName,
  //     Key: "abc.png"
  //   })
  // );

  // try{
  //   const result = await s3Client.send(
  //     new HeadObjectCommand({
  //       Bucket: bucketName,
  //       Key: "foo-bar/foo.png",
  //     }),
  //   );

  // console.log("result: ", result);
  // }catch(err){
  //   if(err instanceof NotFound){
  //     const e = err as NotFound;
  //     console.log("got NotFound error: ", err.$metadata.httpStatusCode);
  //   }else{
  //     console.log("got unknwon error: ", err);
  //   }
  // }
})();

export {};
