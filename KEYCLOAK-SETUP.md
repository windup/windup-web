Steps to setup Red Hat SSO:

SSO Instructions:
https://access.redhat.com/documentation/en/red-hat-single-sign-on/7.0/single/getting-started-guide/#installing_distribution_files

 - Download and setup SSO 7.0
	- Startup with offset 200 to avoid conflicts with your local EAP and arquillian instances:
		- ./standalone.sh -Djboss.socket.binding.port-offset=200
	- Navigate to setup console:
		- http://localhost:8280/auth/
			- Setup an admin user and password here
	- Navigate to Keycloak admin:
		- http://localhost:8280/auth/admin/
		- Login with the username that was just created
	- Setup a new realm called "windup"
	- Create a new Role called "user"
	- Add this new role to the "Default Roles"
	- Create a new user for this realm



 - Install the EAP 7 Adapter
	- Download the RH-SSO-7.0.0-eap7-adapter.zip and unzip it into the root directory of your EAP 7 installation
	- Run the installer: 
		- cd bin
		- Modify adapter-install-offline.cli to point to standalone-full.xml (instead of standalone.xml)
		- ./jboss-cli.sh --file=adapter-install-offline.cli

 - Register the client in Keycloak for windup-web
	- Go back to the Keycloak admin console (http://localhost:8280/auth/admin/)
	- Click clients in the left
	- Click "Create"
		- Client ID: "windup-web"
		- Root URL: http://localhost:8080/windup-web/
		- Click "Save"
	- Click on the "Installation" tab, and select the "Keycload OIDC JBoss Subsystem XML" format option
	- With the server off, open up standalone-full.xml and paste this text into the "urn:jboss:domain:keycloak:1.1" subsystem element
	- Be sure to change the "WAR MODULE NAME.war" section to the war name (windup-web.war)

 - Register the client in Keycloak for windup-web-services
	- Follow the same steps, except use the name "windup-web-services" instead of "windup-web"


