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

visit `http://localhost:9090/docs`

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

## Continuous Integration

For continuous integration we have opted to use Azure Pipelines,
the reason for it is that we are going to use all azure services and the integration is very smooth.

## Naming convention for files

Please use camelCase for files and folders names.

### Introduction

**Azure Pipelines** is an integration provided directly into GitHub that creates a CI/CD environment for Builds/Releases in each case.
It provides a easy and friendly UI to create builds, track their progress, issues and understand what is being released.
After installing Azure Pipelines on the repository, we are going to be redirected to a **Azure DevOps portal**, this will be where we are going to manage everything for that user.

### Create a project

To start with Continuous Integration, the first thing you need to do is create a new project on your Azure DevOps account,
and after you need to enable the Pipelines service:

1. Go to https://dev.azure.com/<organization name>
2. Create a new private project.

Now that we have the project created, we need to enable the Pipelines service on it:

3. Go to the Project Settings page by hovering the project name and clicking on the cog button.
4. Under the Services section enable the Pipelines service.

### Configuration

Even though configurations can be done using the UI provided by **Azure DevOps**, we opt to use YAML files like `test-pipeline.yml` or `build-pipeline.yml`.
The reasoning is to track the configuration and easily migrate to any other repository or project.
Also we can provide different configurations for different providers and the base project will be capable of being deployed to any of the available providers.

#### Create build in Azure DevOps

When creating a new build, we can import settings from a **yml** file. Use the `test-pipeline.yml` as the config file, and Azure will use it to provide the build steps.

Under the Pipeline menu you can create a _new build pipeline_. This process is done with 4 steps:

1. You need to connect Azure to our Github repository. So, select the **Github YAML** option.
2. Select this project's repository.
3. Select the option: **Existing Azure Pipelines YAML file**. It will open a form where you need to select the `test-pipeline.yml` from the git repository.
4. Test the pipeline and finish.

#### Test configuration

For the test steps we have provided a basic node js testing flow.
The app project will be built using nodejs (currently docker test is not supported) and validate that the build is working as expected.
Then it will validate unit tests, configure the environment variables and run integration tests.
In the case of environment variables, for security reasons, they must be stored on the **Azure DevOps portal** to avoid having them in plain text on the repository.
By default the `.env.test` file will be used as configuration file.

##### Running integration tests

To run integration tests, a database for that purpose must be set up to connect from the CI. It could be a small dev/test tier, since it will always be cleaned after tests are run.

To configure the database on the task, edit the build settings and access the variables list.
Add configuration settings for `DB_DATABASE`, `DB_HOST`, `DB_USER` & `DB_PASSWORD`.
This configuration will override whatever is on `env.test`.

Do not store sensible information in the `.env` files.

For free DB that have connection limits like `ElephantSQL` you can provide a `DB_MAX_CONNECTIONS` value on the build variables to avoid getting `too many connections` errors.

##### Forcing test build to run on PRs

To avoid any PR to be merged without the test build successfully ran, you can configure that on the github repository's branch settings.
Create a new _Branch Rule_, this rule should apply to all branches, so the pattern should be `*`.
Check the **Require status checks to pass before merging**, and select the test build.
This will enforce that tests will run each time a PR is created, and if they fail the PR won't be merged.

#### Build release configuration

The app project will be built based on the `docker-compose.yml` file.
Azure will look up images that need to be built, build them, and push them to the `Azure Container Registry` where the images tags are stored.
To configure that, you have to update the `azureContainerRegistry` property with the registry that you want to use. Through the Azure UI it will be easy to configure the azure registry.

##### Container registry

For the purpose of reviewing full azure integration we have set up a **Azure Container Registry**.
For that we have created the corresponding resource on azure, and once created we have to do some small configurations:

- Enable Admin access, from the Security Tab.
- Copy one of the two password provided, you will need that for future access.

When configuring access to this registry from Azure Pipelines, the microsoft wizard will be pretty straightforward.
To set up the connection, just select the image from the subscription you have on azure.

## Continuous Deployment

### Introduction

The deployed solution consists of a PostgreSQL database and a NodeJS application. This solution can be deployed in different ways using docker containers or even as a basic webapp running Node.js.
For now we have configured different docker container settings.

### Docker Single Container

The Docker single container approach runs an image with a specific tag and exposes the port to have public access to the container.
Environment variables can be passed to the container as Applications Settings that can be configured directly from the Pipeline or from the Azure Web App.
Note: Is important that the image exposes port `8080` or `80`, so this is mapped from the image. This is a limitation of azure.

**Extra considerations:**

- Logging is not activated by default, go to the `App Services Log` settings and activate it.
- Accessing the logs can be done through the `Log Stream`, the `Container Settings` tab or by accessing the advanced tools.
- Even though azure provides `Dev` environments for containers, they have issues. Always use production settings even on a testing environment.
- Update the service app settings with the necessary environment settings, ie. `SERVER_PORT` or `DB_HOST`.
- Enable firewall rules as explained later, to allow the container to access the DB.

#### Release Job

The release job is automatically triggered after a deployment build completes, and executes the first stage as part of the Continuous deployment process. Normally this will deploy to the DEV environment, 
and force for authorization on the following environments.

The job consists on a set of **steps** for each **stage**.
For now we are only using one step for this release, but database specific jobs like migrations can be run as part of the release process.

The step we are using is `Deploy Azure App Service`, that request access to the specific `Web App` that we created for this container. Also it will request the TAG version of the image that was just built.

For dev purposes latest could be an option but its recommended to use the `$(Build.BuildId)` variable that will match the image built on the build job that triggered the release. This way each release is attached to a specific image and can be redeployed at any time.

As its explained later, application settings can be defined and stored as variables of the release and used on the `App & Configuration settings` to provide environment variables of the container.

#### Settings for the container

Environment variables can be configured over the application using the `Configuration` that will pass over as environment variables.
Also this settings can be provided on the Container deployment task using the `App Settings` that are provided on the `Deploy Azure App Service` step. This will create or update the current configuration of the container.

#### Setting up a Azure PostgreSQL Database

First create the Azure PostgreSQL database service that is provided by microsoft. For now we have set up a basic database with 2 GB for this starter.

_Other configurations_

- On the `Connection Security` enable the _Allow access to Azure Services_. This will allow our single container to connect to this database.
  For more information, refer to [Microsoft](https://docs.microsoft.com/en-us/azure/postgresql/concepts-firewall-rules)

- If you plan to connect from your local computer to this database you will have to add firewall rules to your current IP.

- Azure Pipeline task: An azure pipeline release can also be created to add an IP to different services.
  Each stage should have a list of **Azure Client** tasks that execute the following command:

```shell
az postgres server firewall-rule create --resource-group RESOURCE_GROUP --server-name DATABASE_SERVER_NAME --name $(myNameForFirewall) --start-ip-address $(myIPAddress)--end-ip-address $(myIPAddress)
```

As an example a stage could have all the access for all DEV databases and run this over multiple resources.

## Built With

- [Express](https://expressjs.com) - Nodejs framework
- [Sequelize](https://sequelize.org/) - DB ORM used with PG driver
- [Umzug](https://github.com/sequelize/umzug) - Library to programmatically handle execution and logging of migration tasks
