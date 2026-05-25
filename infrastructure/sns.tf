# Quote-submission notifications go here.
# After first apply, an SES/SNS confirmation email is sent to var.notify_email
# — click the link once to start receiving notifications.

resource "aws_sns_topic" "quote_submissions" {
  name = "${var.project_name}-quote-submissions"
}

resource "aws_sns_topic_subscription" "quote_submissions_email" {
  topic_arn = aws_sns_topic.quote_submissions.arn
  protocol  = "email"
  endpoint  = var.notify_email
}
