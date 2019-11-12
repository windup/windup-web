e2e tests
=====================

E2e tests depends on [windup-web.mv.db](src/main/resources/h2/windup-web.mv.db) file, which contains a predefined H2 database.
This database contains:

- 1 Project with an analysis
- 1 Project without any analysis
 
The information of those 2 projects, like project IDs and execution IDs, is hard coded in [data.ts](src/main/npm/e2e/utils/data.ts) 

Change [windup-web.mv.db](src/main/resources/h2/windup-web.mv.db) if you make changes on the models
======================================
If you make changes to the model, which is located in `org.jboss.windup.web.services.model` you might see an error while executing the e2e tests.
The error is caused because Hibernate (`<property name="hibernate.hbm2ddl.auto" value="update"/>`) is not able to update the current database [windup-web.mv.db](src/main/resources/h2/windup-web.mv.db) to the new model.

Solution
-------------

1. Clone [windup-web-distribution](https://github.com/windup/windup-web-distribution)
1. Locate your command line in your cloned [windup-web-distribution](https://github.com/windup/windup-web-distribution) repository
1. Execute `mvn clean install -DskipTests` to generate a new zip distribution
1. unzip the file `target/rhamt-web-distribution-*-with-authentication.zip`
1. Execute `run_rhamt.sh` from the unzipped `rhamt-web-distribution-*-with-authentication` directory
1. Create the projects and analysis needed
1. Stop `rhamt-web-distribution` using `Ctrl + C`
1. Replace the old database by this file: `rhamt-web-distribution-*/standalone/data/h2/windup-web.mv.db`
1. Replace the new IDs in [data.ts](src/main/npm/e2e/utils/data.ts)