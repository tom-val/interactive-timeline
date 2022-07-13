resource "aws_apigatewayv2_api" "default" {
  name          = "default-api"
  protocol_type = "HTTP"
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