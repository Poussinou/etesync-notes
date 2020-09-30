// SPDX-FileCopyrightText: © 2019 EteSync Authors
// SPDX-License-Identifier: GPL-3.0-only

import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Appbar, useTheme } from "react-native-paper";

import { SyncManager } from "./sync/SyncManager";

import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AboutScreen from "./screens/AboutScreen";
import DebugLogsScreen from "./screens/DebugLogsScreen";
import NoteListScreen from "./screens/NoteListScreen";
import CollectionEditScreen from "./screens/CollectionEditScreen";
import ItemEditScreen from "./screens/ItemEditScreen";
import CollectionChangelogScreen from "./screens/CollectionChangelogScreen";
import CollectionMembersScreen from "./screens/CollectionMembersScreen";
import InvitationsScreen from "./screens/InvitationsScreen";
import AccountWizardScreen from "./screens/AccountWizardScreen";

import { useCredentials } from "./credentials";
import { performSync } from "./store/actions";

import { useAppStateCb } from "./helpers";

import * as C from "./constants";

const Stack = createStackNavigator();

const MenuButton = React.memo(function MenuButton() {
  const navigation = useNavigation() as DrawerNavigationProp<any>;
  return (
    <Appbar.Action icon="menu" accessibilityLabel="Main menu" onPress={() => navigation.openDrawer()} />
  );
});

export default React.memo(function RootNavigator() {
  const dispatch = useDispatch();
  const etebase = useCredentials();
  const theme = useTheme();

  // Sync app when it goes to background
  useAppStateCb((foreground) => {
    if (etebase) {
      if (!foreground) {
        const syncManager = SyncManager.getManager(etebase);
        dispatch(performSync(syncManager.sync()));
      }
    }
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: "#000000",
        headerBackTitleVisible: false,
        headerBackTitleStyle: {
          backgroundColor: "black",
        },
      }}
    >
      {(etebase === null) ? (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              title: "Login",
              headerLeft: () => (
                <MenuButton />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="AccountWizard"
            component={AccountWizardScreen}
            options={{
              title: C.appName,
            }}
          />
          <Stack.Screen
            name="home"
            component={NoteListScreen}
            options={{
              title: C.appName,
              headerLeft: () => (
                <MenuButton />
              ),
            }}
          />
          <Stack.Screen
            name="CollectionEdit"
            component={CollectionEditScreen}
          />
          <Stack.Screen
            name="CollectionChangelog"
            component={CollectionChangelogScreen}
            options={{
              title: "Manage Notebook",
            }}
          />
          <Stack.Screen
            name="CollectionMembers"
            component={CollectionMembersScreen}
            options={{
              title: "Collection Members",
            }}
          />
          <Stack.Screen
            name="ItemEdit"
            component={ItemEditScreen}
          />
          <Stack.Screen
            name="Invitations"
            component={InvitationsScreen}
            options={{
              title: "Collection Invitations",
            }}
          />
        </>
      )}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen
        name="DebugLogs"
        component={DebugLogsScreen}
        options={{
          title: "View Debug Logs",
        }}
      />
    </Stack.Navigator>
  );
});
