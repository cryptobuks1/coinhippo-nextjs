terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Main AWS region where the resources should be created in
# Should be close to where your Next.js deployment is located
provider "aws" {
  region = "us-east-1"
}

module "next_image_optimizer" {
  source = "dealmore/next-js-image-optimization/aws"

  next_image_domains = ["assets.coingecko.com", "www.covalenthq.com", "coinhippo.io", "www.coinhippo.io", "bitcoin.org", "ethereum.org", "bin.bnbstatic.com"]
}

output "domain" {
  value = module.next_image_optimizer.cloudfront_domain_name
}