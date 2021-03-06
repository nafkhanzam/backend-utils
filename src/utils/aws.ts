import AWS from "aws-sdk";
import fs from "fs";

export class AWSUtils {
  public s3: AWS.S3;
  public ses: AWS.SES;
  constructor(args: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }) {
    const options: AWS.S3.ClientConfiguration = {
      accessKeyId: args.accessKeyId,
      secretAccessKey: args.secretAccessKey,
      region: args.region,
    };

    this.s3 = new AWS.S3(options);
    this.ses = new AWS.SES(options);
  }

  uploadS3 = async (args: {
    bucket: string;
    key: string;
    reader: fs.ReadStream;
    contentType?: string;
  }) => {
    return new Promise<void>((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: args.bucket,
          Key: args.key,
          Body: args.reader,
          ContentType: args.contentType,
        },
        (err) => {
          args.reader.destroy();
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  };

  deleteS3 = async (args: {bucket: string; key: string}) => {
    return new Promise<void>((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: args.bucket,
          Key: args.key,
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  };
}
