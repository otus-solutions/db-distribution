variable "db-distribution-database" {
  type = "map"
  default = {
	"name" = "db-distribution-database"
	"persistence-directory" = "/home/drferreira/otus-platform/docker-persistence/db-distribution/database"
	"port" = 53001
  }
}
variable "db-distribution-service" {
  type = "map"
  default = {
	"name" = "db-distribution-service"
	"port" = 53002
  }
}

resource "docker_image" "db-distribution-database" {
  name = "db-distribution-database:latest"
}
resource "docker_image" "db-distribution-service" {
  name = "db-distribution-service:latest"
}

resource "docker_network" "db-distribution-network"{
  name = "db-distribution-network"
}

resource "docker_container" "db-distribution-database" {
  name = "db-distribution-database"
  image = "${docker_image.db-distribution-database.latest}"
  ports {
	internal = 27017
	external = "${var.db-distribution-database["port"]}"
  }
  volumes {
	host_path = "${var.db-distribution-database["persistence-directory"]}"
	container_path = "/data/db"
  }
  networks_advanced {
    name = "${docker_network.db-distribution-network.name}"
  }
}
resource "docker_container" "db-distribution-service" {
  depends_on = [docker_container.db-distribution-database]
  name = "db-distribution-service"
  image = "${docker_image.db-distribution-service.latest}"
  ports {
	internal = 8080
	external = "${var.db-distribution-service["port"]}"
  }
  networks_advanced {
    name = "${docker_network.db-distribution-network.name}"
  }
}
