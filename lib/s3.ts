import { S3Client } from "@aws-sdk/client-s3";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const AWS_REGION = required("AWS_REGION");
export const S3_BUCKET = required("S3_BUCKET_NAME");

export const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: required("AWS_ACCESS_KEY_ID"),
    secretAccessKey: required("AWS_SECRET_ACCESS_KEY"),
  },
});
