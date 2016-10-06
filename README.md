
Setting up the development environment
======================================

Requirements
-------------

1. JDK 8
2. Maven 3.2.5+ (3.3.x recommended)

Environment setup
-----------------
1. Set your local Maven `setting.xml` by copying file `settings.xml` from checked out sources into `$HOME/.m2/` or use it directly while calling maven with option `-s settings.xml`
 
2. [Install NodeJS Package Manager (npm)](https://nodejs.org/en/download/package-manager/)
   * _Debian/Ubuntu_: `sudo apt-get install npm`
   * _RHEL 7_: 1) Install [EPEL](https://fedoraproject.org/wiki/EPEL/FAQ#How_can_I_install_the_packages_from_the_EPEL_software_repository.3F)  2) `sudo yum install npm`

   > NOTE: If npm is version is less than 3.8.8, try the following to force an update:
   >
   >     npm install -g npm


3. [Install Bower using NPM](http://bower.io/#install-bower)
    * `npm install -g bower`
    * If you run into problems with permissions (typically **EACCES** error), use [this guide](https://docs.npmjs.com/getting-started/fixing-npm-permissions) 
      to fix it. 

4. For development purpose and regular redeployment, raise the Metaspace limit.
    In `wildfly-10.1.0.Final/bin/standalone.conf`, change the `MaxMetaspaceSize` value to 2048:

    ```
    JAVA_OPTS="-Xms64m -Xmx512m -XX:MetaspaceSize=96M -XX:MaxMetaspaceSize=2048m -Djava.net.preferIPv4Stack=true"
    ```

Running the webapp
------------------

- Build: `mvn clean install -DskipTests`
- Wildfly/EAP 7 must be run with `-c standalone-full.xml` as Messaging subsystem is required.
- Execute the CLI script at: scripts/eap-setup.cli on Wildfly/EAP 7

    `bin/jboss-cli.sh -c --file=scripts/eap-setup.cli`

- Deploy the exploded `services/target/windup-web-services` and `ui/target/web-services` to EAP 7.
    
    There are 3 possible ways how to do it.

    - Manual copying:
    
        ```
        cp -r services/target/windup-web-services ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web-services.war;
        touch ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web-services.war.dodeploy;
        cp -r ui/target/windup-web ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web.war;
        touch ~/apps/wildfly-10.1.0.Final/standalone/deployments/windup-web.war.dodeploy;
        ```

        or

    - JBoss CLI deployment, deploy the `target` directory directly - see [WildFly docs](https://docs.jboss.org/author/display/WFLY10/Application+deployment#Applicationdeployment-UnmanagedDeployments):

        ```
        deploy services/target/windup-web-services --unmanaged;
        deploy ui/target/windup-web --unmanaged;
        ```

        or

    - Editing profile configuration and adding the following block to `standalone-full.xml` under `<server>`, at the end of the file:
  
        ```xml
        <deployments>
            <deployment name="windup-web-services" runtime-name="windup-web-services.war">
                <fs-exploded path=".../windup-web/services/target/windup-web-services"/>
            </deployment>
            <deployment name="windup-web" runtime-name="windup-web.war">
                <fs-exploded path=".../windup-web/ui/target/windup-web"/>
            </deployment>
        </deployments>
        ```
    > Note: Replace ... with real absolute path on your local environment.

- Follow the steps for deploying keycloak in [Keycloak Setup](./KEYCLOAK-SETUP.md)
- Access the webapp: <http://localhost:8080/windup-web>
