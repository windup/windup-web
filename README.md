
Setting up the development environment
======================================

Requirements
-------------

0. Git.

1. JDK 8

2. Maven 3.2.5+, 3.3.x recommended

Environment setup
-----------------

3. [Install NodeJS Package Manager (npm)](https://nodejs.org/en/download/package-manager/)
   * For example, on Debian-based systems, use `sudo apt-get install npm`
   * On RHEL 7: 1) Install [EPEL](https://fedoraproject.org/wiki/EPEL)  2) `sudo yum install npm`
   > NOTE: If npm is version is less than 3.8.8, try the following to force an update: `npm install -g npm`


3. [Install Bower using NPM](http://bower.io/#install-bower)
    * `npm install -g bower`
    * If you run into problems with permissions (typically **EACCES** error), use [this guide](https://docs.npmjs.com/getting-started/fixing-npm-permissions) 
      to fix it. 

4. Install the Javascript UI libraries, using `npm`
    ```
    cd ui/src/main/webapp
    npm install
    cd -
    ```

   Alternatively, these parts may be installed 'manually':
    ```
    npm install -g patternfly # JBoss PatternFly, a UI components library
    npm install -g grunt-cli  # Grunt
    npm install -g tsc        # TypeScript compiler
    npm install -g typescript # TypeScript
    ```

    This list is not complete, feel free to add the missing items.

 5. In order to run tests, you will need a locally installed copy of [PhantomJS](http://phantomjs.org/)

Running the webapp
------------------

- Build: `mvn clean install -DskipTests`
- Execute the CLI script at: scripts/eap-setup.cli on Wildfly/EAP 7

    `bin/jboss-cli.sh --file=<path-to-windup-web>/scripts/eap-setup.cli`

- Deploy the exploded `services/target/windup-web-services` and `ui/target/web-services` to EAP 7.

    - windup-web-services

        ```
        cp -r services/target/windup-web-services ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web-services;touch ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web-services.dodeploy
        ```

    - windup-web:

        ```
        cp -r ui/target/windup-web ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web; touch ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web.dodeploy
        ```

    > NOTE: Wildfly/EAP 7 must be run in standalone-full.xml as JMS is required
- Follow the steps for deploying keycloak in [Keycloak Setup](./KEYCLOAK-SETUP.md)
- Access the webapp: <http://localhost:8080/windup-web>
