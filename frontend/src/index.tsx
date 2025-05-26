import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Auth0Provider
    domain="dev-azim8sfu2yz6kzyp.us.auth0.com"
    clientId="g11RI9rFELJeYIJyIbDqKDHEOivWhdgE"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-azim8sfu2yz6kzyp.us.auth0.com/api/v2/",
      scope: "read:current_user update:current_user_metadata"
    }}
  >
    <App />
  </Auth0Provider>
);