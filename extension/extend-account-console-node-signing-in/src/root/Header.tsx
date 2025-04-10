import { useEnvironment } from '@keycloak/keycloak-account-ui';
import {
  KeycloakMasthead,
  label,
} from "@keycloak/keycloak-ui-shared";
import { Button } from "@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "@patternfly/react-icons";
import React from 'react';
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";

import { environment } from "../environment";
import { joinPath } from "../utils/joinPath.ts";

import style from "./Header.module.css";

const ReferrerLink = () => {
  const { t } = useTranslation();

  return environment.referrerUrl ? (
    <Button
      data-testid="referrer-link"
      component="a"
      href={environment.referrerUrl.replace("_hash_", "#")}
      variant="link"
      icon={<ExternalLinkSquareAltIcon />}
      iconPosition="right"
      isInline
    >
      {t("backTo", {
        app: label(t, environment.referrerName, environment.referrerUrl),
      })}
    </Button>
  ) : null;
};

export type HeaderProps = {
  onNavToggle: (event: React.MouseEvent) => undefined
};

export const Header = ({ onNavToggle }: HeaderProps) => {
  const { environment, keycloak } = useEnvironment();
  const { t } = useTranslation();

  const brandImage = environment.logo || "logo.svg";
  const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
  const internalLogoHref = useHref(logoUrl);

  // User can indicate that he wants an internal URL by starting it with "/"
  const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

  return (
    <KeycloakMasthead
      data-testid="page-header"
      keycloak={keycloak}
      features={{ hasManageAccount: false }}
      showNavToggle
      onNavToggle={onNavToggle}
      brand={{
        href: indexHref,
        src: brandImage.startsWith("/")
          ? joinPath(environment.resourceUrl, brandImage)
          : brandImage,
        alt: t("logo"),
        className: style.brand,
      }}
      toolbarItems={[<ReferrerLink key="link" />]}
    />
  );
};
