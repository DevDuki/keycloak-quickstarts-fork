import { ErrorPage, KeycloakContext } from '@keycloak/keycloak-ui-shared';
import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom';
import { environment } from '../environment';
import { routes } from '../routes.tsx';
import { AccountEnvironment, useEnvironment, usePromise } from '@keycloak/keycloak-account-ui';
import fetchContentJson from '../content/fetchContent.ts';
import { Suspense, useEffect, useState } from 'react';
import { Page, Spinner } from '@patternfly/react-core';
import { MenuItem } from '../types/types.ts';
import { Header, HeaderProps } from './Header.tsx';
import { PageNav } from './PageNav.tsx';

function mapRoutes(context: KeycloakContext<AccountEnvironment>, content: MenuItem[]): RouteObject[] {
  return content
    .map((item) => {
      if ("children" in item) {
        return mapRoutes(context, item.children);
      }

      // Do not add route disabled via feature flags
      if (item.isVisible && !context.environment.features[item.isVisible]) {
        return null
      }

      return {
        ...item,
        element:
          "path" in item
            ? routes.find((r) => r.path === (item.id ?? item.path))?.element
            : undefined,
      };
    })
    // Filter out null routes
    .filter(item => !!item)
    .flat();
}

export const Root = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);

  const onNavToggle: HeaderProps['onNavToggle'] = () => {
    setIsNavOpen((prevState) => !prevState);
  }

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebar-toggle', {
      detail: isNavOpen
    }));
  }, [isNavOpen]);

  const context = useEnvironment<AccountEnvironment>();
  const [content, setContent] = useState<RouteObject[]>();

  usePromise(
    (signal) => fetchContentJson({ signal, context }),
    (content) => {
      setContent([
        {
          path: decodeURIComponent(new URL(environment.baseUrl).pathname),
          element: (
            <Page header={<Header onNavToggle={onNavToggle} />} sidebar={<PageNav />}>
              <Suspense fallback={<Spinner />}>
                <Outlet />
              </Suspense>
            </Page>
          ),
          errorElement: <ErrorPage />,
          children: mapRoutes(context, content),
        },
      ]);
    },
  );

  if (!content) {
    return <Spinner />;
  }
  return <RouterProvider router={createBrowserRouter(content)} />;
};

declare global {
  interface WindowEventMap {
    'sidebar-toggle': CustomEvent<boolean>;
  }
}
