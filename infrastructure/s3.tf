resource "aws_s3_bucket" "cv_page" {
  bucket        = var.project_name
  force_destroy = "false"
  website {
    index_document = "index.html"
    error_document = "error.html"
  }
  acl = "public-read"
}

resource "aws_s3_bucket_public_access_block" "cv_page" {
  bucket = aws_s3_bucket.cv_page.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}