# Manual steps to install Keycloak (or Red Hat SSO) on development server

> Note: (not recommended for a production usage)

There are two options - install Red Hat SSO 7 as a standalone server, or Keycloak community as an overlay applied to WildFly 10 or EAP 7. For both, you'll also need to add the client adapter.

## A) Keycloack installation
* _Refer to [Keycloak installation guide](https://keycloak.gitbooks.io/server-installation-and-configuration/content/v/2.2/topics/installation.html) for details._

* Download https://downloads.jboss.org/keycloak/2.1.0.Final/keycloak-overlay-2.1.0.Final.tar.gz

* Extract it into wildfly-10.1.0.Final installation path

* Edit  `<wildfly>/bin/keycloak-install.cli` and change `standalone.xml` to `standalone-full.xml` on first line
* Run  `<path_to_widlfly_server>/bin/jboss-cli.sh --file=bin/keycloak-install.cli` (it uses the `embed-server` so it doesn't need a running server to apply the CLI script)
* Start the server with full profile as: `bin/standalone.sh -c standalone-full.xml`
* To create keycloak Admin user run  `<path_to_widlfly_server>/bin/add-user-keycloack.sh -u <username>`

	This command creates file below with your username:
	`<path_to_widlfly_server>/standalone/configuration/keycloak-add-user.json`
	(This is an alternative to do it manually at http://localhost/auth/admin)

* Restart the server.
* After restart check <http://localhost:8080/auth> if keycloak login page is shown you can use keycloak admin user you created in previous steps.

#### Client adapter
* _Refer to [Keycloak client adapter installation guide](https://keycloak.gitbooks.io/getting-started-tutorials/content/topics/secure-jboss-app/install-client-adapter.html) for the details._
* [Download the Keycloak client adapter for WildFly 10](http://www.keycloak.org/downloads.html) and unzip
  it to the WildFly root directory.
* Edit the `adapter-install-offline.cli` - replace `standalone.xml` with `standalone-full.xml` on the first line.
* Run `bin/jboss-cli.sh --file=bin/adapter-install-offline.cli`


## B) Red Hat SSO installation

SSO Instructions:
https://access.redhat.com/documentation/en/red-hat-single-sign-on/7.0/single/getting-started-guide/#installing_distribution_files

 * Download and setup SSO 7.0
 * Startup with offset 200 to avoid conflicts with your local EAP and arquillian instances:
   * `./standalone.sh -Djboss.socket.binding.port-offset=200`

 * Install the EAP 7 Adapter into the EAP instance that will run Windup Web
   * Download the RH-SSO-7.0.0-eap7-adapter.zip and unzip it into the root directory of your EAP 7 installation
   * Run the installer: 
     * `cd bin`
     * Modify `adapter-install-offline.cli` to point to `standalone-full.xml` (instead of `standalone.xml`)
     * `./jboss-cli.sh --file=adapter-install-offline.cli`
      


##  Common steps: Register the client in Keycloak for windup-web
	- 
	- 
	- 
	- 


* Go back to the Keycloak admin console [http://localhost:8280/auth/admin/](http://localhost:8280/auth/admin/) (or at [8080](http://localhost:8080/auth/admin/) for embedded)
* Setup an admin user and password here
* Then navigate to [Keycloak admin](http://localhost:8280/auth/admin/) and log in
* Set up a new realm called "windup"
  * Create a new Role called "user"
  * Add this new role to the "Default Roles"
  * Create a new client with ID `windup-web`, root URL: [http://localhost:8080/windup-web/](http://localhost:8080/windup-web/)
  * On the settings page, make sure that both of the following URLs are listed as Valid Redirect URIs (add the one that is missing):
      * `http://localhost:8080/windup-web/*`
      * `http://localhost:8080/windup-web-services/*`
  * While in Keycloak, create a new user for this realm
  * Click on the "Installation" tab, and select the "Keycloak OIDC JBoss Subsystem XML" format option
  * With the server off, open up `standalone-full.xml` and paste this text into the`urn:jboss:domain:keycloak:1.1` subsystem element
  * Change the `WAR MODULE NAME.war` section to the war name (`windup-web.war`)
  * Add the following system properties being sure to replace the key with the one from the copied section:
  
        ```
        <system-properties>
            <property name="keycloak.realm.public.key" value="[ INSERT KEY HERE ]"/>
            <property name="keycloak.server.url" value="http://localhost:8280/auth"/>
        </system-properties>
        ```
  * Replace the realm-public-key and auth-server-url elements in the extension configuration with the following text:
    
        ```
            <realm-public-key>${keycloak.realm.public.key}</realm-public-key>
            <auth-server-url>${keycloak.server.url}</auth-server-url>
        ```

* Register the client in Keycloak for windup-web-services
  * Follow the same steps, except use the name "windup-web-services" instead of "windup-web"


