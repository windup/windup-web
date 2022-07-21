export const isKeycloakEnabled = () => {
  return process.env.REACT_APP_AUTH_METHOD === "KEYCLOAK";
};
