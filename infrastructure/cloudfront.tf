resource "aws_cloudfront_distribution" "default" {
  enabled     = true
  price_class = "PriceClass_All"

  origin {
    domain_name = "${aws_s3_bucket.cv_page.id}.s3-website-${aws_s3_bucket.cv_page.region}.amazonaws.com"
    origin_id   = "s3-${aws_s3_bucket.cv_page.id}"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_keepalive_timeout = 5
      origin_protocol_policy   = "http-only"
      origin_read_timeout      = 30
      origin_ssl_protocols     = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = replace(replace(aws_apigatewayv2_api.default.api_endpoint, "https://", ""), "/", "")
    origin_id   = "api-gateway-${aws_apigatewayv2_api.default.id}"
    origin_path = "/${aws_apigatewayv2_stage.default_api.name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  aliases = ["${var.domain}"]

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "s3-${aws_s3_bucket.cv_page.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["Access-Control-Request-Headers", "Access-Control-Request-Method", "Origin"]
    }
  }

  # /api/* → API Gateway (same-origin proxy, no caching, all methods allowed).
  # The CF Function strips the leading /api/ before forwarding, so the API GW
  # stage prefix (also "/api") doesn't get doubled.
  ordered_cache_behavior {
    path_pattern             = "/api/*"
    target_origin_id         = "api-gateway-${aws_apigatewayv2_api.default.id}"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = aws_cloudfront_cache_policy.api_gateway_optimized.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.api_gateway_optimized.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.strip_api_prefix.arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate_validation.cert.certificate_arn
    ssl_support_method  = "sni-only"
  }

  is_ipv6_enabled = true
}

resource "aws_cloudfront_cache_policy" "api_gateway_optimized" {
  name = "ApiGatewayOptimized"

  default_ttl = 0
  max_ttl     = 0
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_function" "strip_api_prefix" {
  name    = "${var.project_name}-strip-api-prefix"
  runtime = "cloudfront-js-2.0"
  code    = <<-EOT
    function handler(event) {
      var req = event.request;
      if (req.uri.indexOf('/api/') === 0) {
        req.uri = req.uri.substring(4);
      } else if (req.uri === '/api') {
        req.uri = '/';
      }
      return req;
    }
  EOT
}

resource "aws_cloudfront_origin_request_policy" "api_gateway_optimized" {
  name = "ApiGatewayOptimized"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = ["Accept-Charset", "Accept", "User-Agent", "Referer"]
    }
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}