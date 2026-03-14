import { SQSRecord } from 'aws-lambda';
import { SqsHandler, SQSBody } from '../../../../../../context/shared/infrastructure/controller/ControllerBase';

export class SQSController implements SqsHandler {
    async handleRecord(record: SQSRecord, body: SQSBody): Promise<void> {
        console.log('🚀 SQSController handleRecord record', record);
        console.log('🚀 SQSController handleRecord body', body);
        console.log('🚀 SQSController handleRecord message', JSON.parse(body.Message));
    }
}