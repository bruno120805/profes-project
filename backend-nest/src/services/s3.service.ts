import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private client: S3Client;
  private bucketName: string;
  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME;
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }

  private getFileExtension(mimeType: string): string | null {
    const mimeTypes: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/pdf': 'pdf',
    };

    return mimeTypes[mimeType] || null;
  }

  async upload(file: Express.Multer.File, key: string) {
    const fileExtension = this.getFileExtension(file.mimetype);

    if (!fileExtension) throw new BadRequestException('Unsupported file type');

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${key}.${fileExtension}`,
      Body: file.buffer,
    });

    await this.client.send(command);

    return `https://${this.bucketName}.s3.amazonaws.com/${key}.${fileExtension}`;
  }

  async getSignedUrl(key: string, extension: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: `${key}.${extension}`,
    });

    return await getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async delete(key: string, extension: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: `${key}.${extension}`,
    });

    await this.client.send(command);
  }
}
