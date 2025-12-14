import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

interface IUploadConfig {
    file: Buffer | fs.ReadStream;
    filename: string;
    contentType: string;
    folder?: string;
}

interface IDeleteConfig {
    fileUrl: string;
}

class CloudflareR2Service {
    private s3Client: S3Client;
    private bucketName: string;
    private publicUrl: string;

    constructor() {
        // Validar variáveis de ambiente
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const bucketName = process.env.R2_BUCKET_NAME;
        const publicUrl = process.env.R2_PUBLIC_URL;

        if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
            throw new BadRequestException(
                'Cloudflare R2 configuration is missing. Check environment variables.',
                ErrorCodes.SYSTEM_ERROR
            );
        }

        this.bucketName = bucketName;
        this.publicUrl = publicUrl;

        // Configurar cliente S3 para Cloudflare R2
        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    /**
     * Upload de arquivo para Cloudflare R2
     */
    async upload({ file, filename, contentType, folder = '' }: IUploadConfig): Promise<string> {
        try {
            const key = folder ? `${folder}/${filename}` : filename;

            // Upload usando @aws-sdk/lib-storage para melhor performance
            const upload = new Upload({
                client: this.s3Client,
                params: {
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file,
                    ContentType: contentType,
                    CacheControl: contentType.includes('optimized') 
                        ? 'public, immutable, max-age=2592000' // 30 dias para otimizadas
                        : 'public, max-age=604800', // 7 dias para demais
                },
            });

            await upload.done();

            const fileUrl = `${this.publicUrl}/${key}`;

            return fileUrl;
        } catch (error: any) {
            console.error('[CloudflareR2Service] Upload failed:', error);
            throw new BadRequestException(
                `Failed to upload file to R2: ${error.message}`,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }

    /**
     * Upload de arquivo local para R2
     */
    async uploadFromPath(filePath: string, folder: string = ''): Promise<string> {
        try {
            if (!fs.existsSync(filePath)) {
                throw new BadRequestException(
                    'File not found',
                    ErrorCodes.BAD_REQUEST
                );
            }

            const filename = path.basename(filePath);
            const fileStream = fs.createReadStream(filePath);
            const contentType = this.getContentType(filename);

            return await this.upload({
                file: fileStream,
                filename,
                contentType,
                folder,
            });
        } catch (error: any) {
            console.error('[CloudflareR2Service] Upload from path failed:', error);
            throw error;
        }
    }

    /**
     * Deletar arquivo do R2
     */
    async delete({ fileUrl }: IDeleteConfig): Promise<void> {
        try {
            // Extrair a key da URL
            const key = fileUrl.replace(`${this.publicUrl}/`, '');

            // console.log(`[CloudflareR2Service] Deleting: ${key}`);

            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);

            // console.log(`[CloudflareR2Service] Delete successful: ${key}`);
        } catch (error: any) {
            // Não falhar se o arquivo não existir
            if (error.name === 'NoSuchKey') {
                console.log(`[CloudflareR2Service] File not found, skipping: ${fileUrl}`);
                return;
            }

            console.error('[CloudflareR2Service] Delete failed:', error);
            throw new BadRequestException(
                `Failed to delete file from R2: ${error.message}`,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }

    /**
     * Determinar Content-Type baseado na extensão
     */
    private getContentType(filename: string): string {
        const ext = path.extname(filename).toLowerCase();
        const contentTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
        };

        return contentTypes[ext] || 'application/octet-stream';
    }
}

export { CloudflareR2Service };
