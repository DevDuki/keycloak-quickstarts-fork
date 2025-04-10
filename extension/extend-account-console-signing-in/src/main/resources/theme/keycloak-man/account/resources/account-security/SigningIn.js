// app/account-security/SigningIn.tsx
import {
  EmptyRow,
  getCredentials,
  Page
} from "@keycloak/keycloak-account-ui";
import { useEnvironment } from "@keycloak/keycloak-ui-shared";
import {
  Button,
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  MenuToggle,
  PageSection,
  Spinner,
  Split,
  SplitItem,
  Title
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useState as useState2 } from "react";
import { Trans, useTranslation } from "react-i18next";

// app/i18n.ts
import { createInstance } from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// app/environment.ts
import { getInjectedEnvironment } from "@keycloak/keycloak-ui-shared";
var environment = getInjectedEnvironment();

// app/utils/joinPath.ts
var PATH_SEPARATOR = "/";
function joinPath(...paths) {
  const normalizedPaths = paths.map((path, index) => {
    const isFirst = index === 0;
    const isLast = index === paths.length - 1;
    if (!isFirst && path.startsWith(PATH_SEPARATOR)) {
      path = path.slice(1);
    }
    if (!isLast && path.endsWith(PATH_SEPARATOR)) {
      path = path.slice(0, -1);
    }
    return path;
  }, []);
  return normalizedPaths.join(PATH_SEPARATOR);
}

// app/i18n.ts
var DEFAULT_LOCALE = "en";
var keycloakLanguageDetector = {
  type: "languageDetector",
  detect() {
    return environment.locale;
  }
};
var i18n = createInstance({
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: joinPath(
      environment.serverBaseUrl,
      `resources/${environment.realm}/account/{{lng}}`
    ),
    parse: (data) => {
      const messages = JSON.parse(data);
      const result = {};
      messages.forEach((v) => result[v.key] = v.value);
      return result;
    }
  }
});
i18n.use(HttpBackend);
i18n.use(keycloakLanguageDetector);
i18n.use(initReactI18next);

// app/utils/formatDate.ts
var FORMAT_DATE_ONLY = {
  dateStyle: "long"
};
var FORMAT_TIME_ONLY = {
  timeStyle: "short"
};
var FORMAT_DATE_AND_TIME = {
  ...FORMAT_DATE_ONLY,
  ...FORMAT_TIME_ONLY
};
function formatDate(date, options = FORMAT_DATE_AND_TIME) {
  return date.toLocaleString(i18n.languages, options);
}

// app/utils/usePromise.ts
import { useEffect, useState } from "react";
function usePromise(factory, callback, deps = []) {
  const [error, setError] = useState();
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    async function handlePromise() {
      try {
        callback(await factory(signal));
      } catch (error2) {
        if (error2 instanceof Error && error2.name === "AbortError") {
          return;
        }
        setError(error2);
      }
    }
    handlePromise();
    return () => controller.abort();
  }, deps);
  if (error) {
    throw error;
  }
}

// app/account-security/SigningIn.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var MobileLink = ({ title, onClick, testid }) => {
  const [open, setOpen] = useState2(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Dropdown,
      {
        popperProps: {
          position: "right"
        },
        onOpenChange: (isOpen) => setOpen(isOpen),
        toggle: (toggleRef) => /* @__PURE__ */ jsx(
          MenuToggle,
          {
            className: "pf-v5-u-display-none-on-lg",
            ref: toggleRef,
            variant: "plain",
            onClick: () => setOpen(!open),
            isExpanded: open,
            children: /* @__PURE__ */ jsx(EllipsisVIcon, {})
          }
        ),
        isOpen: open,
        children: /* @__PURE__ */ jsx(DropdownItem, { onClick, children: title }, "1")
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "link",
        onClick,
        className: "pf-v5-u-display-none pf-v5-u-display-inline-flex-on-lg",
        "data-testid": testid,
        children: title
      }
    )
  ] });
};
var SigningIn = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { login } = context.keycloak;
  const [credentials, setCredentials] = useState2();
  usePromise(
    (signal) => getCredentials({ signal, context }),
    setCredentials,
    []
  );
  const credentialRowCells = (credMetadata) => {
    const credential = credMetadata.credential;
    const maxWidth = {
      "--pf-v5-u-max-width--MaxWidth": "300px"
    };
    const items = [
      /* @__PURE__ */ jsx(
        DataListCell,
        {
          "data-testrole": "label",
          className: "pf-v5-u-max-width",
          style: maxWidth,
          children: t(credential.userLabel) || t(credential.type)
        },
        "title"
      )
    ];
    if (credential.createdDate) {
      items.push(
        /* @__PURE__ */ jsx(
          DataListCell,
          {
            "data-testrole": "created-at",
            children: /* @__PURE__ */ jsxs(Trans, { i18nKey: "credentialCreatedAt", children: [
              /* @__PURE__ */ jsx("strong", { className: "pf-v5-u-mr-md" }),
              { date: formatDate(new Date(credential.createdDate)) }
            ] })
          },
          "created" + credential.id
        )
      );
    }
    return items;
  };
  if (!credentials) {
    return /* @__PURE__ */ jsx(Spinner, {});
  }
  const credentialUniqueCategories = [
    ...new Set(credentials.map((c) => c.category))
  ];
  return /* @__PURE__ */ jsxs(Page, { title: t("signingIn"), description: t("signingInDescription"), children: [
    /* @__PURE__ */ jsx("h1", { children: t("hello") }),
    credentialUniqueCategories.map((category) => /* @__PURE__ */ jsxs(PageSection, { variant: "light", className: "pf-v5-u-px-0", children: [
      /* @__PURE__ */ jsx(Title, { headingLevel: "h2", size: "xl", id: `${category}-categ-title`, children: t(category) }),
      credentials.filter((cred) => cred.category == category).map((container) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(Split, { className: "pf-v5-u-mt-lg pf-v5-u-mb-lg", children: [
          /* @__PURE__ */ jsxs(SplitItem, { children: [
            /* @__PURE__ */ jsx(
              Title,
              {
                headingLevel: "h3",
                size: "md",
                className: "pf-v5-u-mb-md",
                "data-testid": `${container.type}/help`,
                children: /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "cred-title pf-v5-u-display-block",
                    "data-testid": `${container.type}/title`,
                    children: t(container.displayName)
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx("span", { "data-testid": `${container.type}/help-text`, children: t(container.helptext) })
          ] }),
          container.createAction && /* @__PURE__ */ jsx(SplitItem, { isFilled: true, children: /* @__PURE__ */ jsx("div", { className: "pf-v5-u-float-right", children: /* @__PURE__ */ jsx(
            MobileLink,
            {
              onClick: () => login({
                action: container.createAction
              }),
              title: t("setUpNew", {
                name: t(
                  `${container.type}-display-name`
                )
              }),
              testid: `${container.type}/create`
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs(
          DataList,
          {
            "aria-label": "credential list",
            className: "pf-v5-u-mb-xl",
            "data-testid": `${container.type}/credential-list`,
            children: [
              container.userCredentialMetadatas.length === 0 && /* @__PURE__ */ jsx(
                EmptyRow,
                {
                  message: t("notSetUp", {
                    name: t(container.displayName)
                  }),
                  "data-testid": `${container.type}/not-set-up`
                }
              ),
              container.userCredentialMetadatas.map((meta) => /* @__PURE__ */ jsx(DataListItem, { children: /* @__PURE__ */ jsx(DataListItemRow, { id: `cred-${meta.credential.id}`, children: /* @__PURE__ */ jsx(
                DataListItemCells,
                {
                  className: "pf-v5-u-py-0",
                  dataListCells: [
                    ...credentialRowCells(meta),
                    /* @__PURE__ */ jsxs(
                      DataListAction,
                      {
                        id: `action-${meta.credential.id}`,
                        "aria-label": t("updateCredAriaLabel"),
                        "aria-labelledby": `cred-${meta.credential.id}`,
                        children: [
                          container.removeable && /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "danger",
                              "data-testrole": "remove",
                              onClick: () => {
                                login({
                                  action: "delete_credential:" + meta.credential.id
                                });
                              },
                              children: t("delete")
                            }
                          ),
                          container.updateAction && /* @__PURE__ */ jsx(
                            Button,
                            {
                              variant: "secondary",
                              onClick: () => {
                                login({ action: container.updateAction });
                              },
                              "data-testrole": "update",
                              children: t("update")
                            }
                          )
                        ]
                      },
                      "action"
                    )
                  ]
                }
              ) }) }, meta.credential.id))
            ]
          }
        )
      ] }))
    ] }, category))
  ] });
};
var SigningIn_default = SigningIn;
export {
  SigningIn,
  SigningIn_default as default
};
