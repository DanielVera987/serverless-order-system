import OrdersTable from './OrdersTable';
import SNSOrdersCreated from './SNSOrdersCreated';
import SQSOrdersProcess, { SQSOrdersProcessDLQ } from './SQSOrdersProcess';
import SQSOrdersProcessPolicy from './SQSOrdersProcessPolicy';
import { SNSDLQAlarm, OrdersProcessDLQAlarm } from './DLQAlarm';

export const resources = {
  Resources: {
    OrdersTable,
    SQSOrdersProcessDLQ,
    SQSOrdersProcess,
    SQSOrdersProcessPolicy,
    SNSOrdersCreated,
    SNSDLQAlarm,
    OrdersProcessDLQAlarm,
  },
};
