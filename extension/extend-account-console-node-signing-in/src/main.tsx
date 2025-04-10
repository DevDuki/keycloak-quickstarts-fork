import "@patternfly/react-core/dist/styles/base.css";

import { KeycloakProvider } from "@keycloak/keycloak-account-ui";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { environment } from "./environment";
import { i18n } from "./i18n";
import { Root } from './root/Root.tsx';

const container = document.getElementById("app");
const root = createRoot(container!);

i18n
  .init()
  .then(() => {
    root.render(
      <StrictMode>
        <KeycloakProvider environment={environment}>
          <Root />
        </KeycloakProvider>
      </StrictMode>
    );
  });
