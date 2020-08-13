$MTA_HOME/bin/kcadm.sh config credentials \
--server http://localhost:8080/auth \
--realm master \
--user admin \
--password password \
--client admin-cli

$MTA_HOME/bin/kcadm.sh \
update realms/mta/clients/739a78cd-ab8d-427a-93f7-4af38f0eab31 -f client.json