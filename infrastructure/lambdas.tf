################################################################################
# Quote AI Lambdas — api + processor
#
# Lambda code is packaged externally (see backend/) and uploaded out-of-band.
# Terraform creates the function shells with a dummy zip; lifecycle.ignore_changes
# prevents TF from clobbering subsequent code deploys.
################################################################################

# --- Dummy zip used for initial function creation ---
data "archive_file" "lambda_dummy" {
  type        = "zip"
  output_path = "${path.module}/lambda_dummy.zip"

  source {
    content  = "exports.handler = async () => ({ statusCode: 200, body: 'placeholder' })"
    filename = "index.mjs"
  }
}

# --- API Lambda (handles public quote routes + admin HTML) ---------------------
resource "aws_iam_role" "quote_api" {
  name = "${var.project_name}-quote-api-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "quote_api_basic" {
  role       = aws_iam_role.quote_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "quote_api_perms" {
  name = "${var.project_name}-quote-api-perms"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan",
        ]
        Resource = [
          aws_dynamodb_table.ai_quote_jobs.arn,
          aws_dynamodb_table.quote_submissions.arn,
          "${aws_dynamodb_table.quote_submissions.arn}/index/*",
        ]
      },
      {
        Effect   = "Allow"
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.ai_quote.arn
      },
      {
        Effect   = "Allow"
        Action   = "sns:Publish"
        Resource = aws_sns_topic.quote_submissions.arn
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "quote_api_perms" {
  role       = aws_iam_role.quote_api.name
  policy_arn = aws_iam_policy.quote_api_perms.arn
}

resource "aws_cloudwatch_log_group" "quote_api" {
  name              = "/aws/lambda/${var.project_name}-quote-api"
  retention_in_days = 14
}

resource "aws_lambda_function" "quote_api" {
  function_name    = "${var.project_name}-quote-api"
  role             = aws_iam_role.quote_api.arn
  runtime          = "nodejs22.x"
  handler          = "index.handler"
  memory_size      = 256
  timeout          = 10
  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256

  environment {
    variables = {
      JOBS_TABLE        = aws_dynamodb_table.ai_quote_jobs.name
      SUBMISSIONS_TABLE = aws_dynamodb_table.quote_submissions.name
      SQS_QUEUE_URL     = aws_sqs_queue.ai_quote.id
      SNS_TOPIC_ARN     = aws_sns_topic.quote_submissions.arn
      ADMIN_KEY         = var.admin_key
      SITE_DOMAIN       = var.domain
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.quote_api_basic,
    aws_iam_role_policy_attachment.quote_api_perms,
    aws_cloudwatch_log_group.quote_api,
  ]

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

# --- Processor Lambda (SQS-triggered, calls OpenAI) ----------------------------
resource "aws_iam_role" "quote_processor" {
  name = "${var.project_name}-quote-processor-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "quote_processor_basic" {
  role       = aws_iam_role.quote_processor.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "quote_processor_perms" {
  name = "${var.project_name}-quote-processor-perms"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
        ]
        Resource = aws_dynamodb_table.ai_quote_jobs.arn
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
        ]
        Resource = aws_sqs_queue.ai_quote.arn
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "quote_processor_perms" {
  role       = aws_iam_role.quote_processor.name
  policy_arn = aws_iam_policy.quote_processor_perms.arn
}

resource "aws_cloudwatch_log_group" "quote_processor" {
  name              = "/aws/lambda/${var.project_name}-quote-processor"
  retention_in_days = 14
}

resource "aws_lambda_function" "quote_processor" {
  function_name    = "${var.project_name}-quote-processor"
  role             = aws_iam_role.quote_processor.arn
  runtime          = "nodejs22.x"
  handler          = "index.handler"
  memory_size      = 256
  timeout          = 60
  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256

  environment {
    variables = {
      JOBS_TABLE     = aws_dynamodb_table.ai_quote_jobs.name
      OPENAI_API_KEY = var.openai_api_key
      OPENAI_MODEL   = var.openai_model
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.quote_processor_basic,
    aws_iam_role_policy_attachment.quote_processor_perms,
    aws_cloudwatch_log_group.quote_processor,
  ]

  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_event_source_mapping" "quote_sqs" {
  event_source_arn = aws_sqs_queue.ai_quote.arn
  function_name    = aws_lambda_function.quote_processor.arn
  batch_size       = 1
}

# --- API Gateway → Lambda permission -------------------------------------------
resource "aws_lambda_permission" "quote_api_apigw" {
  statement_id  = "AllowAPIGatewayInvokeQuoteApi"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.quote_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.default.execution_arn}/*/*"
}
