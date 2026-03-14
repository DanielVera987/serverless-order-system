import OrdersTable from './OrdersTable';
import SNSOrdersCreated from './SNSOrdersCreated';
import SQSOrdersProcess from './SQSOrdersProcess';
import SQSOrdersProcessPolicy from './SQSOrdersProcessPolicy';

export const resources = {
  Resources: {
    OrdersTable,
    SQSOrdersProcess,
    SQSOrdersProcessPolicy,
    SNSOrdersCreated,
  },
};
