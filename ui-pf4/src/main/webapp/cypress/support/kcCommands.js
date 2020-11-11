Cypress.Commands.add("kcToken", () => {
  Cypress.log({ name: "Keycloak token" });

  const kcServer = "http://localhost:8080/auth";
  const kcUrl = `${kcServer}/realms/mta/protocol/openid-connect/token`;

  const kcHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  cy.request({
    method: "POST",
    headers: kcHeaders,
    body: {
      client_id: "mta-web",
      client_secret: "password",
      username: "mta",
      password: "password",
      grant_type: "password",
      scope: "openid info offline_access",
    },
    url: kcUrl,
  })
    .then((response) => {
      return cy.request({
        method: "POST",
        headers: kcHeaders,
        body: {
          client_id: "mta-web",
          client_secret: "password",
          grant_type: "refresh_token",
          refresh_token: response.body.refresh_token,
        },
        url: kcUrl,
      });
    })
    .its("body");
});
