import type { RouteObject } from "react-router-dom";
import {
  DeviceActivity,
  PersonalInfo,
} from "@keycloak/keycloak-account-ui";
import SigningIn from './account-security/SigningIn.tsx';

export const PersonalInfoRoute: RouteObject = {
  path: "",
  element: <PersonalInfo />,
};

export const DeviceActivityRoute: RouteObject = {
  path: "account-security/device-activity",
  element: <DeviceActivity />,
};

export const SigningInRoute: RouteObject = {
  path: "account-security/signing-in",
  element: <SigningIn />,
};

export const routes: RouteObject[] = [
  PersonalInfoRoute,
  SigningInRoute,
  DeviceActivityRoute,
];
