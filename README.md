# Otus Database Distribuition

Project to archive and control database distribution.

## Getting Started

This project uses feature made available in docker containers, its settings are defined in environment variables. By default the database must have a volume and the application must be in the API folder.

### Prerequisites


- docker
- docker-compose


### Installing

To build the containers run the following command

```
sudo docker-compose up -d --build
```


If api communication problems occur with the database, run this command
```
sudo docker restart otus-db-distribuition-api
```

## Running the tests


This project should have unit tests reaching at least 80% coverage.




## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/ccem-dev/db-distribution/tags). 

## Authors

See also the list of [contributors](https://github.com/ccem-dev/db-distribution/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

