import { batch, signal } from "@preact/signals-react";

const $isAuthenticated = signal(false);
const $isAuthenticating = signal(false);

export const useAuth = () => {
  return {
    $isAuthenticated,
    $isAuthenticating,
    logout: () => {
      $isAuthenticated.value = false;
    },
    authenticate: async (_email: string, _password: string) => {
      $isAuthenticating.value = true;
      const isAuthenticated = await new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
      batch(() => {
        $isAuthenticated.value = isAuthenticated;
        $isAuthenticating.value = false;
      });
    },
  };
};
