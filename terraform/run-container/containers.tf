variable "db-distribution-service-port"{
  default = 53002
}

variable "db-distribution-service-version"{
  default = "latest"
}

variable "db-distribution-network"{
  default = "otus-api-network"
}
resource "docker_image" "db-distribution-service" {
  name = "db-distribution-service:${var.db-distribution-service-version}"
}

resource "docker_network" "db-distribution-network"{
  name = "db-distribution-network"
}

resource "docker_container" "db-distribution-service" {
  name = "db-distribution-service"
  image = "${docker_image.db-distribution-service.name}"
  restart = "on-failure"
  ports {
	internal = 8080
	external = "${var.db-distribution-service-port}"
  }
  networks_advanced {
    name = "${var.db-distribution-network}"
  }
}
