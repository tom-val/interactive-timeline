# --- DynamoDB: ai_quote_jobs (ephemeral — 24h TTL) -----------------------------
resource "aws_dynamodb_table" "ai_quote_jobs" {
  name         = "${var.project_name}-ai-quote-jobs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "jobId"

  attribute {
    name = "jobId"
    type = "S"
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
}

# --- DynamoDB: quote_submissions (persistent — durable record) -----------------
# Single-table design with a fixed partition key so we can paginate
# all submissions newest-first via the createdAt sort key.
resource "aws_dynamodb_table" "quote_submissions" {
  name         = "${var.project_name}-quote-submissions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "submissionId"

  attribute {
    name = "submissionId"
    type = "S"
  }

  attribute {
    name = "all"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name            = "by-created-at"
    hash_key        = "all"
    range_key       = "createdAt"
    projection_type = "ALL"
  }
}
