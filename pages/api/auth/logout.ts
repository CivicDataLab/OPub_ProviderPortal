// TODO: Remove eslint ignore statement and resolve the lint error
/* eslint-disable import/no-anonymous-default-export */
export default (req, res) => {
  const path = `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=${process.env.NEXTAUTH_URL}`;

  res.status(200).json(path);
};
