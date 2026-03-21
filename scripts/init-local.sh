#!/bin/bash
set -euo pipefail

DYNAMO_ENDPOINT="http://localstack:4566"
LS_ENDPOINT="http://localstack:4566"
REGION="us-east-1"
STAGE="local"

# ─── DynamoDB Tables ──────────────────────────────────────────────────────────

echo "→ Creating DynamoDB tables..."

aws dynamodb create-table \
  --endpoint-url "$DYNAMO_ENDPOINT" \
  --region "$REGION" \
  --table-name "restaurant-orders-${STAGE}-orders" \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=entityType,AttributeType=S \
    AttributeName=orderNumber,AttributeType=N \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes '[
    {
      "IndexName": "orderNumber-index",
      "KeySchema": [
        {"AttributeName": "entityType", "KeyType": "HASH"},
        {"AttributeName": "orderNumber", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"}
    }
  ]' > /dev/null && echo "  ✓ orders table"

aws dynamodb create-table \
  --endpoint-url "$DYNAMO_ENDPOINT" \
  --region "$REGION" \
  --table-name "restaurant-kitchen-${STAGE}-ingredients" \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH > /dev/null && echo "  ✓ ingredients table"

aws dynamodb create-table \
  --endpoint-url "$DYNAMO_ENDPOINT" \
  --region "$REGION" \
  --table-name "restaurant-warehouse-${STAGE}-purchase-history" \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=entityType,AttributeType=S \
    AttributeName=purchaseDate,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes '[
    {
      "IndexName": "entityType-purchaseDate-index",
      "KeySchema": [
        {"AttributeName": "entityType", "KeyType": "HASH"},
        {"AttributeName": "purchaseDate", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"}
    }
  ]' > /dev/null && echo "  ✓ purchase-history table"

aws dynamodb create-table \
  --endpoint-url "$DYNAMO_ENDPOINT" \
  --region "$REGION" \
  --table-name "restaurant-artificial-intelligence-${STAGE}-recipes" \
  --billing-mode PAY_PER_REQUEST \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH > /dev/null && echo "  ✓ recipes table"

# ─── SQS Queues (DLQs first, then main queues) ───────────────────────────────

echo "→ Creating SQS queues..."

create_fifo_queue() {
  local name="$1"
  aws sqs create-queue \
    --endpoint-url "$LS_ENDPOINT" \
    --region "$REGION" \
    --queue-name "${name}.fifo" \
    --attributes FifoQueue=true,ContentBasedDeduplication=true \
    --output text --query 'QueueUrl' 2>/dev/null
}

get_queue_arn() {
  local queue_url="$1"
  aws sqs get-queue-attributes \
    --endpoint-url "$LS_ENDPOINT" \
    --region "$REGION" \
    --queue-url "$queue_url" \
    --attribute-names QueueArn \
    --query 'Attributes.QueueArn' --output text
}

# DLQs
ORDERS_PROCESS_DLQ_URL=$(create_fifo_queue "restaurant-orders-${STAGE}-orders-process-dlq") && echo "  ✓ orders-process-dlq"
RECIPE_PROCESS_DLQ_URL=$(create_fifo_queue "restaurant-kitchen-${STAGE}-recipe-process-dlq") && echo "  ✓ recipe-process-dlq"
ORDER_DELIVERY_DLQ_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-order-delivery-dlq") && echo "  ✓ order-delivery-dlq"
BUY_MARKET_DLQ_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-buy-market-dlq") && echo "  ✓ buy-market-dlq"
RESTOCK_DLQ_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-restock-dlq") && echo "  ✓ restock-dlq"
INVENTORY_READY_DLQ_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-inventory-ready-dlq") && echo "  ✓ inventory-ready-dlq"
INVENTORY_SHORTAGE_DLQ_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-inventory-shortage-dlq") && echo "  ✓ inventory-shortage-dlq"

# Main queues
ORDERS_PROCESS_URL=$(create_fifo_queue "restaurant-orders-${STAGE}-orders-process") && echo "  ✓ orders-process"
RECIPE_PROCESS_URL=$(create_fifo_queue "restaurant-kitchen-${STAGE}-recipe-process") && echo "  ✓ recipe-process"
ORDER_DELIVERY_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-order-delivery") && echo "  ✓ order-delivery"
BUY_MARKET_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-buy-market") && echo "  ✓ buy-market"
RESTOCK_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-restock") && echo "  ✓ restock"
INVENTORY_READY_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-inventory-ready") && echo "  ✓ inventory-ready"
INVENTORY_SHORTAGE_URL=$(create_fifo_queue "restaurant-warehouse-${STAGE}-inventory-shortage") && echo "  ✓ inventory-shortage"

# ─── SNS Topics ──────────────────────────────────────────────────────────────

echo "→ Creating SNS topics..."

create_fifo_topic() {
  local name="$1"
  aws sns create-topic \
    --endpoint-url "$LS_ENDPOINT" \
    --region "$REGION" \
    --name "${name}.fifo" \
    --attributes FifoTopic=true,ContentBasedDeduplication=true \
    --query 'TopicArn' --output text
}

ORDERS_CREATED_ARN=$(create_fifo_topic "restaurant-orders-${STAGE}-orders-created") && echo "  ✓ orders-created"
RECIPE_CREATED_ARN=$(create_fifo_topic "restaurant-kitchen-${STAGE}-recipe-created") && echo "  ✓ recipe-created"
ORDER_READY_ARN=$(create_fifo_topic "restaurant-warehouse-${STAGE}-order-ready") && echo "  ✓ order-ready"
INGREDIENTS_NEEDED_ARN=$(create_fifo_topic "restaurant-warehouse-${STAGE}-ingredients-needed") && echo "  ✓ ingredients-needed"
INGREDIENTS_PURCHASED_ARN=$(create_fifo_topic "restaurant-warehouse-${STAGE}-ingredients-purchased") && echo "  ✓ ingredients-purchased"
INVENTORY_READY_ARN=$(create_fifo_topic "restaurant-warehouse-${STAGE}-inventory-ready") && echo "  ✓ inventory-ready"
INVENTORY_SHORTAGE_ARN=$(create_fifo_topic "restaurant-warehouse-${STAGE}-inventory-shortage") && echo "  ✓ inventory-shortage"

# ─── SNS → SQS Subscriptions ─────────────────────────────────────────────────

echo "→ Subscribing queues to topics..."

subscribe() {
  local topic_arn="$1"
  local queue_url="$2"
  local queue_arn
  queue_arn=$(get_queue_arn "$queue_url")
  aws sns subscribe \
    --endpoint-url "$LS_ENDPOINT" \
    --region "$REGION" \
    --topic-arn "$topic_arn" \
    --protocol sqs \
    --notification-endpoint "$queue_arn" \
    --output text --query 'SubscriptionArn' > /dev/null
}

subscribe "$ORDERS_CREATED_ARN"     "$ORDERS_PROCESS_URL"     && echo "  ✓ orders-created → orders-process"
subscribe "$RECIPE_CREATED_ARN"     "$RECIPE_PROCESS_URL"     && echo "  ✓ recipe-created → recipe-process"
subscribe "$ORDER_READY_ARN"        "$ORDER_DELIVERY_URL"     && echo "  ✓ order-ready → order-delivery"
subscribe "$INGREDIENTS_NEEDED_ARN" "$BUY_MARKET_URL"         && echo "  ✓ ingredients-needed → buy-market"
subscribe "$INGREDIENTS_PURCHASED_ARN" "$RESTOCK_URL"         && echo "  ✓ ingredients-purchased → restock"
subscribe "$INVENTORY_READY_ARN"    "$INVENTORY_READY_URL"    && echo "  ✓ inventory-ready → inventory-ready"
subscribe "$INVENTORY_SHORTAGE_ARN" "$INVENTORY_SHORTAGE_URL" && echo "  ✓ inventory-shortage → inventory-shortage"

echo ""
echo "✅ Local environment ready."
