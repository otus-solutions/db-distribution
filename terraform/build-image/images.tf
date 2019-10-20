###############################################
###               Variables                 ###
###############################################
variable "db-distribution-database-name" {
  default = "db-distribution-database"
}
variable "db-distribution-database-directory" {
  default = "db-distribution"
}
variable "db-distribution-database-source" {
  default = "source" 
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
  default = "install --production"
}
variable "db-distribution-service-npmtest" {
  default = "test"
}
###############################################
###  DB-DISTRIBUTION : Build Image Database ###
###############################################
resource "null_resource" "db-distribution-database" {
  provisioner "local-exec" {
    command = "docker build --target database -t ${var.db-distribution-database-name} ."
  }
}

#################################################
### DB-DISTRIBUTION-API : Build Image Service ###
#################################################
resource "null_resource" "db-distribution-install" {
  provisioner "local-exec" {
    working_dir = "${var.db-distribution-service-source}"
    command = "npm ${var.db-distribution-service-npminstall}"
  }
}

resource "null_resource" "db-distribution-test" {
  depends_on = [null_resource.db-distribution-install]
  provisioner "local-exec" {
    working_dir = "${var.db-distribution-service-source}"
    command = "npm ${var.db-distribution-service-npmtest}"
  }
}
resource "null_resource" "db-distribution-service" {
  depends_on = [null_resource.db-distribution-test]
  provisioner "local-exec" {
    command = "docker build --target api -t ${var.db-distribution-service-name} ."
  }
}
