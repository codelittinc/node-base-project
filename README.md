# NodeJS project starter

## 👋 Intro

This is basic Nodejs project starter. Its goal is to offer a simple way to start new api applications. It offers:

- Models
- Controllers
- Services
- Migrations
- Environment specific configurations
- Docker development environment
- Tests

## Running the project

### Dependencies

- Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Commands

1. clone this project
2. run `cd <project_name>`
3. run `npm run config`
4. run `npm run docker:start:dev`
5. run `npm install`
6. run `npm run db:create:all`
7. run `npm start`

visit `http://localhost:9090/users`

## Tests

The project contains unit & integrations tests to cover the full solution.

### Running:

All: `npm test`

Unit: `npm test:unit`

Integration: `npm test:integration`

For more information about our tests:

- [General](tests/README.md) - Test general guidelines
- [Unit](tests/unit/README.md) - Unit testing guidelines
- [Integration](tests/integration/README.md) - Integration testing guidelines

## Project Structure

The full folder structure of this app is explained below:

| Name                                             | Description                                                                                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **.vscode**                                      | Contains VS Code specific settings                                                         |
| **dist**                                         | Contains the distributable (or output) from the TypeScript build. This is the code we ship |
| **src**                                          | Contains the source code                                                                   |
| **src/config**                                   | Contains the project general configuration                                                 |
| [**src/controllers**](src/controllers/README.md) | Controllers define functions that respond to various http requests                         |
| [**src/models**](src/models/README.md)           | Models define Sequelize schemas that will be used in storing and retrieving data           |
| **src/server**                                   | Server methods to run the server                                                           |
| **src/services**                                 | Services that group logic to process information                                           |
| **src/types**                                    | Holds .d.ts files not found on DefinitelyTyped.                                            |
| **src**/index.ts                                 | Entry point to the express app                                                             |
| [**tests**](tests/README.md)                     | Contains the tests                                                                         |

## Contributing guidelines

### Branches

The name of the branch should follow:

- fix/fix-name
- feature/feature-name

### Commits

We are using [Codelitt's commit styleguide](https://github.com/codelittinc/incubator-resources/blob/master/engineering/dev_best_practices/project-structure/commits.md)

### Steps

- Create a branch from the default branch
- Create one commit per fix/feature
- Create a pull request
- Request someone to review it
- Once approved, rebase and merge

## NPM Scripts

The project comes with multiple `Package.json` scripts created to run usefull commands.
The following are the current command list:

- `build`: runs all the builds necessary for the project
- `build:tsc`: runs the typescript build of the project
- `config`: creates a basic env file to run your server, no sensible keys are available
- `docker:build`: builds the docker-compose containers
- `docker:db`: starts the database container
- `docker:start:dev`: runs docker-compose containers, and starts bash. (Database will be not populated you will need to run extra commands)
- `docker:start`: same as `start:dev` but it will run the server
- `docker:stop`: stops the docker service (docker-compose down)
- `db:setup / db:setup:test`: creates the database if it not exists for dev / test environment
- `db:create / db:create:test`: creates & execute migrations of the database if it not exists for dev / test environment
- `db:migrate:schema / db:migrate:schema:test`: runs the database migration client of the schema for dev / test environment
- `db:migrate:data`: runs the database migration client of the data for dev environment
- `db:seed`: runs the seeds of the project for dev environment
- `start`: compiles and starts the application
- `start:dev`: watch the TS files, on a change it builds the hole application and starts.
- `start:prod`: starts the application using node for built js.
- `test:unit`: runs the unit tests
- `test:integration`: runs the integration tests on the test environment
- `test:all`: runs all test types

Execute a command via:

```shell
npm run <command>
```

## Continuous Integration

For continuous integration we have opted to use Azure Pipelines,
the reason for it is that we are going to use all azure services and the integration is very smooth.

### Introduction

**Azure Pipelines** is a integration provided directly into Github that creates a CI/CD environment for Builds/Releases in each case.
It provides a easy and friendly UI to crete builds, track their progress, issues and understand what is being released.
After installing Azure Pipelines on the repository we are going to be redirected to a **Azure DevOps portal**, this will be where we are going to manage everything for that user.

### Create a project

To start with continuous integration, the first thing you need to do is create a new project on your Azure DevOps account,
and after you need to enable the Pipelines service:
1. Go to https://dev.azure.com/<organization name>
2. Create a new private project.

Now that we have the project created, we need to enable the Pipelines service on it:
3. Go to the Project Settings page by hovering the project name and clicking on the cog button.
4. Under the Services section enable the Pipelines service.

### Configuration

Even though configurations can be done using the UI provided by **Azure DevOps**, we opt to use yml files like `test-pipeline.yml` or `build-pipeline.yml`.
The reasoning is to track the configuration and easily migrate to any other repository or project.
Also we can provide different configurations for different providers and the base project will be capable of be deployed to any of the available providers.

#### Create build in Azure DevOps

When creating a new build, we can import settings from a **yml** file, use the `test-pipeline.yml` as the config file, and it will use it to provide the build steps.

Under the Pipeline menu you can create a _new build pipeline_. This process is done with 4 steps:
1. You need to connect Azure to our Github repository. So, select the **Github YAML** option.
2. Select this project's repository.
3. Select the option: **Existing Azure Pipelines YAML file**. It will open a form where you need to select the `test-piline.yml` from the git repository.
4. Test the pipeline and finish.

#### Test configuration

For the test steps we have provided a basic node js testing flow.
The app project will be build using nodejs (currently docker test are not supported) and validate that the build is working as expected.
Then will validate unit tests, configure the environment variables and run integration tests.
In the case of environment variables, for security reasons, it should be stored on the **Azure DevOps portal** to avoid having those variables in plain text on the repository.
By default the `.env.test` file will be used as configuration file.

##### Running integration tests

To run integration test a database for that porpouse must be setted up to connect from the CI, it could be a small dev/test tier, since it will always be cleanned after tests are run.

To configure the database on the task, edit the build settings and access the variables list.
Add configuration settings for `DB_DATABASE`, `DB_HOST`, `DB_USER` & `DB_PASSWORD`.
This configuration will override whatever is on `env.test`.

Do not store sensible information in the `.env` files.

##### Forcing test build to run on PRs

To avoid any PR to be merged without the test build successfully ran, you can configure that on the github repository's branch settings.
Create a new _Branch Rule_, this rule should apply to all branches, so the pattern should be `*`.
Check the **Require status checks to pass before merging**, and select the test build.
This will enforce that each time a PR is created, the tests will run and if are not run succesfully it can't be merged.

#### Build release configuration

The app project will be built based on the `docker-compose.yml` file.
Azure will look up image that need to be built, and will build those images, and push it to the `Azure Container Registry` where the images tags are stored.
To configure that you have to update the `azureContainerRegistry` property, with the registry that you want to use. Using the Azure UI is easy to configure the azure registry.

##### Container registry

For the purpose of reviewing full azure integration we have setted up a **Azure Container Registry**.
For that we have created the corresponding resource on azure, and once created we have to do some small configurations:

- Enable Admin access, from the Security Tab.
- Copy one of the two password provided, you will need that for future access.

When configuring access to this registry from Azure Pipelines, the microsoft wizard will be pretty straight forward, just selecting the repository and the image, from the suscription you have on azure, will be enough to set up the connection.

## Continuous Deployment

### Introduction

The deployed solution consist of a PostgreSQL database and a NodeJS application. This solution can be deployed in different ways using docker containers or even as a basic webapp running Node.js.
For now we have configured different docker container settings.

### Docker Single Container

The Docker single container configuration uses the image configured with the specific tag, applications settings and run it. Is important that the image exposes port 8080 or 80, so this is mapped from the image. This is a limitation of azure.

**Extra considerations:**

- Logging is not activated by default, go to the `App Services Log` settings and activate it.
- Accessing the logs can be done through the `Log Stream`, the `Container Settings` tab or by accessing the advanced tools.
- Even though azure provides `Dev` environments for containers, they have issues. Always use production settings even on a testing environment.
- Update the service app settings with the necessary environment settings, ie. `SERVER_PORT` or `DB_HOST`.
- Enable firewall rules as explain later, to allow the container to access the DB.

#### Release Job

The release job is automatically triggered after a deployment build completes, and executes the first stage as part of the Continuous deployment process. Normally this will deploy to the DEV environment, 
and force for authorization on the following environments.

The job consists on a set of **steps** for each **stage**.
For now we are only using one step for this release, but database specific jobs like migrations can be run as part of the release process.

The step we are using is `Deploy Azure App Service`, that request access to the specific `Web App` that we created for this container. Also it will request the TAG version of the image that was just built.

For dev porpuses latest could be an option but its recommended to use the `$(Build.BuildId)` variable that will match the image built on the build job that triggered the release. This way each release is attached to a specific image and can be redeployed at any time.

As its explained later, application settings can be defined and stored as variables of the release and used on the `App & Configuration settings` to provide environment variables of the container.

#### Settings for the container

Environment variables can be configured over the application using the `Configuration` that will pass over as environment variables.
Also this settings can be provided on the Container deployment task using the `App Settings` that are provided on the `Deploy Azure App Service` step. This will create or update the current configuration of the container.

#### Setting up a Azure PostgreSQL Database

First create the Azure PostgreSQL database service that is provided by microsoft. For now we have setted up a basic database with 2 GB for this starter.

_Other configurations_

- On the `Connection Security` enable the _Allow access to Azure Services_ this will allow our single container to connect to this database.
  For more information, refer to [Microsoft](https://docs.microsoft.com/en-us/azure/postgresql/concepts-firewall-rules)

- If you plan to connect from your local computer to this database you will have to add firewall rules to your current IP.

- Azure Pipeline task: An azure pipeline release can also be created to add an IP to different services.
  Each stage should have a list of **Azure Client** tasks that execute the following command:

```shell
az postgres server firewall-rule create --resource-group RESOURCE_GROUP --server-name DATABASE_SERVER_NAME --name $(myNameForFirewall) --start-ip-address $(myIPAddress)--end-ip-address $(myIPAddress)
```

As an example a stage could have all the acccess for all DEV databases and run this over multiple resources.

## Built With

- [Express](https://expressjs.com) - Nodejs framework
- [Sequelize](https://sequelize.org/) - DB ORM used with PG driver
- [Umzug](https://github.com/sequelize/umzug) - Library to programmatically handle execution and logging of migration tasks
