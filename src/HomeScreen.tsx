import React from "react";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { StyledText } from "./theme";
import { Stack } from "./components/Stack";
import { Show } from "./components/Show";
import { Button } from "./components/Button";
import { batch, useSignal } from "@preact/signals-react";

export function HomeScreen() {
  console.log("HomeScreen");

  const { logout } = useAuth();

  const $loading = useSignal(false);
  const $data = useSignal<{ payload: string } | null>(null);

  useEffect(() => {
    (async () => {
      $loading.value = true;
      const data = await new Promise<{ payload: string }>((resolve) => {
        setTimeout(() => {
          resolve({ payload: "Hello" });
        }, 1000);
      });
      batch(() => {
        $data.value = data;
        $loading.value = false;
      });
    })();
  }, []);

  return (
    <Stack
      space={"s40"}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Show
        when={() => !!$data.value}
        content={() => (
          <Stack
            space={"s48"}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <StyledText sx={({ t }) => ({ color: t.color.textPrimary })}>
              {$data.value?.payload}
            </StyledText>
            <Button label="Logout" onPress={logout} />
          </Stack>
        )}
        fallback={
          <StyledText sx={({ t }) => ({ color: t.color.textSecondary })}>
            Loading...
          </StyledText>
        }
      />
    </Stack>
  );
}
