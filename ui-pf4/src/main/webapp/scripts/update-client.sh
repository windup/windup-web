## Login in MTA-WEB
./bin/kcadm.sh config credentials \
--server http://localhost:8080/auth \
--realm master \
--user admin \
--password password \
--client admin-cli

## Change Keycloak's client configuration
./bin/kcadm.sh update realms/mta/clients/739a78cd-ab8d-427a-93f7-4af38f0eab31 \
-s id="739a78cd-ab8d-427a-93f7-4af38f0eab31" \
-s clientId="mta-web" \
-s adminUrl="/mta-web" \
-s "redirectUris=[\"http://localhost:3000/*\", \"/mta-web/*\", \"/mta-ui/*\"]" \
-s "webOrigins=[\"http://localhost:3000\", \"/\"]"
