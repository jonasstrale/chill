terraform {
  required_version = ">= 1.9.0"
}

variable "name" {
  type = string
}

resource "kubernetes_namespace" "this" {
  metadata {
    name = var.name
  }
}
