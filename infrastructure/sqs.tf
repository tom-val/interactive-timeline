resource "aws_sqs_queue" "ai_quote" {
  name                       = "${var.project_name}-ai-quote"
  visibility_timeout_seconds = 90
  message_retention_seconds  = 86400 # 1 day
  receive_wait_time_seconds  = 5
}

resource "aws_sqs_queue" "ai_quote_dlq" {
  name                      = "${var.project_name}-ai-quote-dlq"
  message_retention_seconds = 604800 # 7 days
}

resource "aws_sqs_queue_redrive_policy" "ai_quote" {
  queue_url = aws_sqs_queue.ai_quote.id
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.ai_quote_dlq.arn
    maxReceiveCount     = 2
  })
}
