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
  default = "/source" 
}
variable "db-distribution-service-name" {
  default = "db-distribution-service"
}
variable "db-distribution-service-directory" {
  default = "db-distribution"
}
variable "db-distribution-service-source" {
  default = "/source"
}
variable "db-distribution-service-npmbuild" {
  default = "install"
}
###############################################
###  DB-DISTRIBUTION : Build Image Database ###
###############################################
resource "null_resource" "db-distribution-database" {
  provisioner "local-exec" {
    working_dir = "db-distribution"
    command = "docker build --target database -t ${var.db-distribution-database-name} ."
  }
}

#################################################
### DB-DISTRIBUTION-API : Build Image Service ###
#################################################
resource "null_resource" "db-distribution-build" {
  provisioner "local-exec" {
    working_dir = "db-distribution/source"
    command = "npm ${var.db-distribution-service-npmbuild}"
  }
}
resource "null_resource" "db-distribution-service" {
  depends_on = [null_resource.db-distribution-build]
  provisioner "local-exec" {
    working_dir = "db-distribution"
    command = "docker build --target api -t ${var.db-distribution-service-name} ."
  }
}