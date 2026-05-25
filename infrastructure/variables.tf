variable "project_name" {
  type    = string
  default = "personal-cv-page"
}

variable "deployment_number" {
  type    = string
  default = "initial"
}

variable "domain" {
  type    = string
  default = "valiunas.dev"
}

# --- Quote AI ---
# Sensitive values default to empty so `terraform plan` on PRs (which may not
# have access to the Prod environment) doesn't fail on missing inputs. The
# real values come from TF_VAR_* env vars set in the workflow on main pushes.
variable "openai_api_key" {
  type        = string
  description = "OpenAI API key passed to the quote processor lambda."
  sensitive   = true
  default     = ""
}

variable "openai_model" {
  type        = string
  description = "OpenAI model id for the quote processor (Responses API)."
  default     = "gpt-5.5"
}

variable "admin_key" {
  type        = string
  description = "Shared secret required to view the admin submissions page."
  sensitive   = true
  default     = ""
}

variable "notify_email" {
  type        = string
  description = "Email address that receives new quote submission notifications via SNS."
  default     = ""
}
