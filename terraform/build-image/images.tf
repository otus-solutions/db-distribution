###############################################
###               Variables                 ###
###############################################
variable "db-distribution-database" {
  type = "map"
  default = {
    "name" = "db-distribution-database"
    "directory" = "db-distribution"
    "source" = "/source"
  }
}
variable "db-distribution-api" {
  type = "map"
  default = {
    "name" = "db-distribution-api"
    "directory" = "db-distribution"
    "source" = "/source"
  }
}

###############################################
###  DB-DISTRIBUTION : Build Image Database ###
###############################################
resource "null_resource" "db-distribution-database" {
  provisioner "local-exec" {
    command = "sudo docker build --target database -t ${var.db-distribution-database["name"]} ${var.db-distribution-database["directory"]}"
  }
}

#################################################
### DB-DISTRIBUTION-API : Build Image Service ###
#################################################
resource "null_resource" "db-distribution-api" {
  provisioner "local-exec" {
    command = "cd ${var.db-distribution-api["directory"]}/${var.db-distribution-api["source"]} && npm install"
  }
  provisioner "local-exec" {
    command = "sudo docker build --target api -t ${var.db-distribution-api["name"]} ${var.db-distribution-api["directory"]}"
  }
}