variable "db-distribution-database-persistence"{
  default = "/otus-platform/docker-persistence/db-distribution/database"
}

variable "db-distribution-database-port"{
  default = 53001
}

variable "db-distribution-service-port"{
  default = 53002
}

variable "db-distribution-service-version"{
  default = "latest"
}

variable "db-distribution-database-version"{
  default = "latest"
}

resource "docker_image" "db-distribution-database" {
  name = "db-distribution-database:${var.db-distribution-database-version}"
}
resource "docker_image" "db-distribution-service" {
  name = "db-distribution-service:${var.db-distribution-service-version}"
}

resource "docker_network" "db-distribution-network"{
  name = "db-distribution-network"
}

resource "docker_container" "db-distribution-database" {
  name = "db-distribution-database"
  image = "${docker_image.db-distribution-database.name}"
  ports {
	internal = 27017
	external = "${var.db-distribution-database-port}"
  }
  volumes {
	host_path = "${var.db-distribution-database-persistence}"
	container_path = "/data/db"
  }
  networks_advanced {
    name = "${docker_network.db-distribution-network.name}"
  }
}
resource "docker_container" "db-distribution-service" {
  depends_on = [docker_container.db-distribution-database]
  name = "db-distribution-service"
  image = "${docker_image.db-distribution-service.name}"
  ports {
	internal = 8080
	external = "${var.db-distribution-service-port}"
  }
  networks_advanced {
    name = "${docker_network.db-distribution-network.name}"
  }
}
