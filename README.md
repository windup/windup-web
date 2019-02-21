Trying out RHAMT Web Console
=====================

If you just want to run RHAMT Web Console, not build or modify it, the simplest way is to use the docker image at https://hub.docker.com/r/windup3/windup-web_nightly/.

If you want to build RHAMT Web Console yourself and run it without setting up a WildFly server and Keycloak, you can build [windup-web-distribution](https://github.com/windup/windup-web-distribution) after building windup-web to create a self-contained distribution.


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
   * _Fedora_: `sudo dnf install npm`

   > NOTE: If npm is version is less than 3.8.8, try the following to force an update:
   >
   >        sudo npm install -g npm

3. [Install yarn package manager](https://yarnpkg.com/en/)

   > Note: Check that your installed version of yarn is at least v0.22.0 (yarn --version)

4. [Install Bower using NPM](http://bower.io/#install-bower)
    * `sudo npm install -g bower`
    * If you run into problems with permissions (typically **EACCES** error), use [this guide](https://docs.npmjs.com/getting-started/fixing-npm-permissions)
      to fix it.
    * `npm install` command should be replaceable with `yarn add`.
    * For global packages, use 
        `sudo yarn global add`. Yarn should be faster, but if there is any problem with it, use NPM.
         [Here](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc#.pshfjyfo0) is nice comparison of npm and yarn commands.

5. Get current version of phantomjs
    
    > 
    > if phantomjs is not installed yet, run 
    >    
    >       sudo npm install -g phantomjs-prebuilt
    >
    > Or
    > 
    >       sudo npm install -g phantomjs-prebuilt --unsafe-perm
    
    > 
    > else run
    >
    >       sudo npm update -g phantomjs-prebuilt

6. For development purpose and regular redeployment, raise the Metaspace limit.
    In `wildfly-10.1.0.Final/bin/standalone.conf`, change the `MaxMetaspaceSize` value to 2048:

    ```
    JAVA_OPTS="-Xms64m -Xmx512m -XX:MetaspaceSize=96M -XX:MaxMetaspaceSize=2048m -Djava.net.preferIPv4Stack=true"
    ```


Building the Windup project
---------------------------

To build Windup, you need to clone and build several git repositories:

If you want to contribute to Windup development,
here is a script which clones the repositories, adds the upstream and sets up the remote tracking branches.
First, you'll need to _fork_ all the repositories to your user account.
Then, change your GitHub.com user name in the script below.

```
GITHUB_USER="OndraZizka"
BASEDIR=$(pwd)
for i in \
windup \
windup-rulesets \
windup-quickstarts \
windup-distribution \
maven-indexer \
windup-maven-plugin \
; do 
    cd $BASEDIR
    git clone git@github.com:$GITHUB_USER/$i.git
    cd $i
    git remote add upstream https://github.com/windup/$i.git
    git fetch upstream
    git branch --set-upstream-to=upstream/master
    git pull
    mvn clean install -DskipTests
done
cd $BASEDIR

# Install NodeJS 6+
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
# Install NPM
sudo apt-get install npm
sudo npm install -g npm

#sudo apt install yarn
sudo npm install -g yarn
sudo npm install -g bower
sudo npm install -g phantomjs-prebuilt
## Then fix NPM permissions, basically by downloading and installing it just for one user…
## https://docs.npmjs.com/getting-started/fixing-npm-permissions

BASEDIR=$(pwd)
for i in \
windup-keycloak-tool \
windup-web \
windup-web-distribution \
; do 
    cd $BASEDIR
    git clone git@github.com:$GITHUB_USER/$i.git
    cd $i
    git remote add upstream https://github.com/windup/$i.git
    git fetch upstream
    git branch --set-upstream-to=upstream/master
    git pull
    mvn clean install -DskipTests
done
cd $BASEDIR
```


Running the webapp
------------------

- Build: `mvn clean install -DskipTests`
- Wildfly/EAP 7 must be run with `-c standalone-full.xml` as Messaging subsystem is required.
- Execute the CLI script at: scripts/eap-setup.cli on Wildfly/EAP 7

    `bin/jboss-cli.sh -c --file=scripts/eap-setup.cli`

- Deploy the exploded `services/target/rhamt-web/api` and `ui/target/rhamt-web` to EAP 7.

    There are 3 possible ways how to do it.

    - Manual copying:

        ```
        cp -r services/target/rhamt-web/api ~/apps/wildfly-10.1.0.Final/standalone/deployments/rhamt-web/api.war;
        touch ~/apps/wildfly-10.1.0.Final/standalone/deployments/rmaht-web/api.war.dodeploy;
        cp -r ui/target/rhamt-web ~/apps/wildfly-10.1.0.Final/standalone/deployments/rhamt-web.war;
        touch ~/apps/wildfly-10.1.0.Final/standalone/deployments/rhamt-web.war.dodeploy;
        ```

        or

    - JBoss CLI deployment, deploy the `target` directory directly - see [WildFly docs](https://docs.jboss.org/author/display/WFLY10/Application+deployment#Applicationdeployment-UnmanagedDeployments):

        ```
        deploy services/target/rhamt-web/api --unmanaged;
        deploy ui/target/rhamt-web --unmanaged;
        ```

        or

    - Editing profile configuration and adding the following block to `standalone-full.xml` under `<server>`, at the end of the file:

        ```xml
        <deployments>
            <deployment name="rhamt-web/api" runtime-name="api.war">
                <fs-exploded path=".../windup-web/services/target/rhamt-web/api"/>
            </deployment>
            <deployment name="rhamt-web" runtime-name="rhamt-web.war">
                <fs-exploded path=".../windup-web/ui/target/rhamt-web"/>
            </deployment>
        </deployments>
        ```
    > Note: Replace ... with real absolute path on your local environment.

- Follow the steps for deploying keycloak in [Keycloak Setup](./KEYCLOAK-SETUP.md)
- Access the webapp: <http://localhost:8080/rhamt-web>

Deploy your changes while coding
------------------
- Follow the previous step (use the 3rd way of running the webapp: edit `standalone-full.xml`) 
- Install webpack: `sudo npm install --global webpack@3.4.1`
- Move to webapp folder: `cd windup-web/ui/src/main/webapp`
- Execute `webpack -w`

