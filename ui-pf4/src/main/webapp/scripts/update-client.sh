## Login in WINDUP-WEB
./bin/kcadm.sh config credentials \
--server http://localhost:8080/auth \
--realm master \
--user admin \
--password password \
--client admin-cli

## Change Keycloak's client configuration
./bin/kcadm.sh update realms/windup/clients/739a78cd-ab8d-427a-93f7-4af38f0eab31 \
-s id="739a78cd-ab8d-427a-93f7-4af38f0eab31" \
-s clientId="windup-web" \
-s adminUrl="/windup-web" \
-s "redirectUris=[\"http://localhost:3000/*\", \"/windup-web/*\", \"/windup-ui/*\"]" \
-s "webOrigins=[\"http://localhost:3000\", \"/\"]"
