import React from "react";
import { Button } from "./components/Button";
import { Text } from "./components/Text";
import { TextInput } from "./components/TextInput";
import { useAuth } from "./hooks/useAuth";
import { Stack } from "./components/Stack";
import { useNav } from "./components/Nav";
import { toggleTheme } from "./theme";
import { useSignal, useSignalEffect } from "@preact/signals-react";

export function LoginScreen() {
  console.log("LoginScreen");

  const { $isAuthenticating, authenticate } = useAuth();
  const $emailText = useSignal("");
  const $passwordText = useSignal("");
  const $buttonDisabled = useSignal(true);

  useSignalEffect(() => {
    $buttonDisabled.value = !(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($emailText.value) &&
      $passwordText.value.length > 7
    );
  });

  const onSubmit = () => {
    if (!$buttonDisabled.peek()) {
      authenticate($emailText.peek(), $passwordText.peek());
    }
  };

  return (
    <Stack
      space="s24"
      sx={({ t }) => ({
        flex: 1,
        backgroundColor: t.color.background,
        padding: t.size.s16,
      })}
    >
      <Stack
        style={{ justifyContent: "center", alignItems: "center" }}
        space="s16"
      >
        <Text variant="xl2">Sign in to your account</Text>
      </Stack>
      <TextInput
        label="Email"
        placeholder="email@example.com"
        autoComplete="email"
        keyboardType="email-address"
        onSubmitEditing={onSubmit}
        onChangeText={(text) => ($emailText.value = text)}
      />
      <TextInput
        label="Password"
        placeholder="********"
        autoComplete="password"
        onSubmitEditing={onSubmit}
        onChangeText={(text: string) => ($passwordText.value = text)}
      />
      <Button
        label="Login"
        onPress={onSubmit}
        signals={{ disabled: $buttonDisabled, loading: $isAuthenticating }}
      />
      <Button label="Nav" onPress={useNav().toggleNav} />
      <Button label="Toggle theme" onPress={toggleTheme} />
    </Stack>
  );
}
