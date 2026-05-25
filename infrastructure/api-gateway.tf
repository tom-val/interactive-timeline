resource "aws_apigatewayv2_api" "default" {
  name          = "default-api"
  protocol_type = "HTTP"

  # CORS — allow same-origin (CloudFront) and direct calls from the site domain.
  cors_configuration {
    allow_origins = ["https://${var.domain}", "http://localhost:3000"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "default_api" {
  api_id      = aws_apigatewayv2_api.default.id
  name        = "api"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 10
    throttling_rate_limit  = 10
  }
}

# --- Quote routes (proxied to a single Node lambda) ----------------------------
resource "aws_apigatewayv2_integration" "quote_api" {
  api_id                 = aws_apigatewayv2_api.default.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.quote_api.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

locals {
  quote_routes = [
    "POST /quote/questions",
    "POST /quote/estimate",
    "GET /quote/jobs/{jobId}",
    "POST /quote/submit",
    "GET /admin/quotes",
  ]
}

resource "aws_apigatewayv2_route" "quote" {
  for_each  = toset(local.quote_routes)
  api_id    = aws_apigatewayv2_api.default.id
  route_key = each.value
  target    = "integrations/${aws_apigatewayv2_integration.quote_api.id}"
}
