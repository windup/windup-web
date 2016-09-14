Steps to setup Red Hat SSO:

SSO Instructions:
https://access.redhat.com/documentation/en/red-hat-single-sign-on/7.0/single/getting-started-guide/#installing_distribution_files

 - Download and setup SSO 7.0
	- Startup with offset 200 to avoid conflicts with your local EAP and arquillian instances:
		- `./standalone.sh -Djboss.socket.binding.port-offset=200`
	- Navigate to setup console:
		- [http://localhost:8280/auth/](http://localhost:8280/auth/)
			- Setup an admin user and password here
	- Navigate to Keycloak admin:
		- http://localhost:8280/auth/admin/
		- Login with the username that was just created
	- Setup a new realm called "windup"
	- Create a new Role called "user"
	- Add this new role to the "Default Roles"
	- Create a new user for this realm



 - Install the EAP 7 Adapter into the EAP instance that will run Windup Web
	- Download the RH-SSO-7.0.0-eap7-adapter.zip and unzip it into the root directory of your EAP 7 installation
	- Run the installer: 
		- `cd bin`
		- Modify `adapter-install-offline.cli` to point to `standalone-full.xml` (instead of `standalone.xml`)
		- `./jboss-cli.sh --file=adapter-install-offline.cli`

 - Register the client in Keycloak for windup-web
	- Go back to the Keycloak admin console [http://localhost:8280/auth/admin/](http://localhost:8280/auth/admin/)
	- Click clients in the left
	- Click "Create"
		- Client ID: "windup-web"
		- Root URL: [http://localhost:8080/windup-web/](http://localhost:8080/windup-web/)
		- Click "Save"
    - On the settings page, make sure that both of the following URLs are listed as Valid Redirect URIs (add the one that is missing):
        - http://localhost:8080/windup-web-services/*
        - http://localhost:8080/windup-web/*
	- Click on the "Installation" tab, and select the "Keycloak OIDC JBoss Subsystem XML" format option
	- With the server off, open up standalone-full.xml and paste this text into the "urn:jboss:domain:keycloak:1.1" subsystem element
	- Change the "WAR MODULE NAME.war" section to the war name (windup-web.war)
    - Add the following system properties being sure to replace the key with the one from the copied section:
        ```
        <system-properties>
            <property name="keycloak.realm.public.key" value="[ INSERT KEY HERE ]"/>
            <property name="keycloak.server.url" value="http://localhost:8280/auth"/>
        </system-properties>
        ```
    - Replace the realm-public-key and auth-server-url elements in the extension configuration with the following text:
    
        ```
            <realm-public-key>${keycloak.realm.public.key}</realm-public-key>
            <auth-server-url>${keycloak.server.url}</auth-server-url>
        ```

 - Register the client in Keycloak for windup-web-services
	- Follow the same steps, except use the name "windup-web-services" instead of "windup-web"


