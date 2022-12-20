import React from "react";
import { SafeAreaView } from "react-native";
import { Nav } from "./components/Nav";
import { HomeScreen } from "./HomeScreen";
import { useAuth } from "./hooks/useAuth";

import { LoginScreen } from "./LoginScreen";
import { StyledView } from "./theme";

const RootNavigator = () => {
  console.log("RootNavigator");

  const auth = useAuth();
  return auth.$isAuthenticated.value ? <HomeScreen /> : <LoginScreen />;
};

export default function App() {
  console.log("App");

  return (
    <StyledView
      sx={({ t }) => ({
        flex: 1,
        backgroundColor: t.color.background,
      })}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <StyledView
          sx={({ t }) => ({
            flex: 1,
            maxWidth: t.size.s576,
            alignSelf: "center",
            width: "100%",
          })}
        >
          <RootNavigator />
        </StyledView>
        <Nav />
      </SafeAreaView>
    </StyledView>
  );
}
