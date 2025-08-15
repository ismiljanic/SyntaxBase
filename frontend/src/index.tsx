import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import ReactDOM from "react-dom/client";
import { App } from "../src/App";
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN || "MISSING_DOMAIN"}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || "MISSING_CLIENT_ID"}
    authorizationParams={{
      redirect_uri: process.env.REACT_APP_AUTH0_REDIRECT_URI || "http://localhost:3000/login",
      audience: process.env.REACT_APP_AUTH0_AUDIENCE || "MISSING_AUDIENCE",
      scope: "openid profile email read:current_user update:current_user_metadata offline_access",
    }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);