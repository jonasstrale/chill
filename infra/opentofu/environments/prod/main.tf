terraform {
  required_version = ">= 1.9.0"
}

module "economy_namespace" {
  source = "../../modules/k8s_namespace"
  name   = "economy"
}
