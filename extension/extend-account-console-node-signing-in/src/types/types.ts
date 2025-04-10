import { KeycloakContext } from '@keycloak/keycloak-ui-shared';
import { TFuncKey } from '../i18n.ts';
import { Feature } from '../environment.ts';

/**
 * ====================================================================================================================
 * Copied types from keycloak repo
 * The types below have been copied from the official keycloak repo because they weren't exported by their UI packages.
 * ====================================================================================================================
 */

/**
 * Types from PageNav component
 * https://github.com/keycloak/keycloak/blob/b281b5f09d06a55c661d8df529f0020dd44942d1/js/apps/account-ui/src/root/PageNav.tsx#L31
 */
type RootMenuItem = {
  id?: string;
  label: TFuncKey;
  path: string;
  isVisible?: keyof Feature;
  modulePath?: string;
};

type MenuItemWithChildren = {
  label: TFuncKey;
  children: MenuItem[];
  isVisible?: keyof Feature;
};

export type MenuItem = RootMenuItem | MenuItemWithChildren;

/**
 * Types from api/methods.ts file
 * https://github.com/keycloak/keycloak/blob/b281b5f09d06a55c661d8df529f0020dd44942d1/js/apps/account-ui/src/api/methods.ts#L20
 */
export type CallOptions = {
  context: KeycloakContext;
  signal?: AbortSignal;
};

/**
 * ====================================================================================================================
 * Custom types
 * Add your own types below.
 * ====================================================================================================================
 */
