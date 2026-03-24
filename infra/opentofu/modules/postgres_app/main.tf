terraform {
  required_version = ">= 1.9.0"
}

variable "namespace" {
  type = string
}

output "namespace" {
  value = var.namespace
}
