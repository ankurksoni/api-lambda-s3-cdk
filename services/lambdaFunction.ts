import { S3 } from '@aws-sdk/client-s3';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Readable } from 'stream';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    const s3 = new S3();
    const balanceStatusBucket = process.env.BALANCE_STATUS_BUCKET || `balance-status-698926940450-us-east-1`;
    const objectKey = 'accountStatus.json';
    try {
        const s3Response = await s3.getObject({ Bucket: balanceStatusBucket, Key: objectKey });

        if (!s3Response.Body) {
            console.error('Error: Empty response body from S3', { bucket: balanceStatusBucket, key: objectKey });
            return preparedResponse(404, JSON.stringify({
                message: 'Requested resource not found'
            }));
        }

        const jsonFileContent = await streamToString(s3Response.Body as Readable);
        return preparedResponse(200, jsonFileContent);
    } catch (error) {
        console.error('Error fetching file from S3:', { 
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            bucket: balanceStatusBucket,
            key: objectKey
        });
        
        if (error instanceof Error && error.name === 'NoSuchKey') {
            console.error('S3 object not found:', {
                error: error.message,
                stack: error.stack,
                bucket: balanceStatusBucket,
                key: objectKey
            });
            return preparedResponse(404, JSON.stringify({
                message: 'Requested resource not found'
            }));
        }
        return preparedResponse(500, JSON.stringify({
            message: 'An internal server error occurred'
        }));
    }
};

// Convert S3 Readable Stream to String
async function streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = '';
        stream.on("data", (chunk) => data += chunk);
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
    });
}

// Helper function to prepare API Gateway response
function preparedResponse(statusCode: number, body: string) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body
    };
}
