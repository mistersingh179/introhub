import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  HeadObjectCommand,
  NotFound
} from "@aws-sdk/client-s3";

(async () => {
  console.log("hello world from repl");
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
  console.log(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

  const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });

  const bucketName = `introhub`;

  // const result = await s3Client.send(
  //   new PutObjectCommand({
  //     Bucket: bucketName,
  //     Key: "my-first-object.html",
  //     Body: "Hello JavaScript SDK!",
  //     ContentType: 'text/html'
  //   }),
  // );

  try{
    const result = await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: "foobar@gmail.com",
      }),
    );

    console.log("result: ", result);
  }catch(err){
    if(err instanceof NotFound){
      const e = err as NotFound;
      console.log("got NotFound error: ", err.$metadata.httpStatusCode);
    }else{
      console.log("got unknwon error: ", err);
    }


  }

})();

export {};
