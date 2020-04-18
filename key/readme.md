


https://github.com/evanshortiss/keycloak-nodejs-quickstart-tutorial

https://scalac.io/user-authentication-keycloak-1

**
- https://medium.com/@ramandeep.singh.1983/enterprise-web-app-authentication-using-keycloak-and-node-js-c10b0e26b80d


https://www.keycloak.org/docs/latest/securing_apps/#_nodejs_adapter


http://francoisbotha.io/category/keycloak


**
- https://devhub.io/repos/keycloak-keycloak-nodejs-connect






MailJet
Multi-tenant: relms or groups

https://realms.please-open.it


User page
https://app.please-open.it/auth/realms/3dde7dcc-e275-4f95-8f1a-1733729bfcfc/account/


1. Click button on webapp
2. Redirect to authSrv and logIn https://app.please-open.it/auth
3. Rediret to  app webapp page (w/ client id and password) - the page is registered when webapp is registered, in KeyCloak you
set the url in 'Clients' section. Usually you use ngrok during development.
4. Use client id and password to get token from authSrv
5. Use access token with authSrv to get user data from authSrv


http://tutorials.jenkov.com/oauth2/index.html

1. Basic u/p
2. JWT app auth once
3. OAuth multi 
4. SAML 3rd party trust


 https://metas.ngrok.io/red


 The Authorization Code Flow goes through the following steps:

1. Client prepares an Authentication Request containing the desired request parameters.
1. Client sends the request to the Authorization Server.
1. Authorization Server Authenticates the End-User.
1. Authorization Server obtains End-User Consent/Authorization.
1. Authorization Server sends the End-User back to the Client with an Authorization Code.
1. Client requests a response using the Authorization Code at the Token Endpoint.
1. Client receives a response that contains an ID Token and Access Token in the response body.
1. Client validates the ID token and retrieves the End-User's Subject Identifier.