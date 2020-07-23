###############################################
###               Variables                 ###
###############################################
variable "db-distribution-dockerfile" {
  default = "."
}

variable "db-distribution-service-name" {
  default = "db-distribution-service"
}
variable "db-distribution-service-directory" {
  default = "db-distribution"
}
variable "db-distribution-service-source" {
  default = "source"
}
variable "db-distribution-service-npminstall" {
  default = "npm install"
}
variable "db-distribution-service-npmtest" {
  default = "npm test"
}
variable "db-distribution-service-npmprune" {
  default = "npm prune --production"
}


#################################################
### DB-DISTRIBUTION-API : Build Image Service ###
#################################################
resource "null_resource" "db-distribution-install" {
  provisioner "local-exec" {
    working_dir = "${var.db-distribution-service-source}"
    command = "${var.db-distribution-service-npminstall}"
  }
}

resource "null_resource" "db-distribution-test" {
  depends_on = [null_resource.db-distribution-install]
  provisioner "local-exec" {
    working_dir = "${var.db-distribution-service-source}"
    command = "${var.db-distribution-service-npmtest}"
  }
}

resource "null_resource" "db-distribution-prune" {
  depends_on = [null_resource.db-distribution-test]
  provisioner "local-exec" {
    working_dir = "${var.db-distribution-service-source}"
    command = "${var.db-distribution-service-npmprune}"
  }
}

resource "null_resource" "db-distribution-service" {
  depends_on = [null_resource.db-distribution-prune]
  provisioner "local-exec" {
    command = "docker build --target api -t ${var.db-distribution-service-name} ${var.db-distribution-dockerfile}"
  }
}
