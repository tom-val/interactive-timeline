terraform {
  backend "s3" {
    bucket = "cvpagestatebucket"
    key    = "state"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
}