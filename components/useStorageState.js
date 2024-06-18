import * as SecureStore from "expo-secure-store";
import React, { useEffect, useReducer, useCallback } from "react";
import { Platform } from "react-native";

function useAsyncState(initialValue = [true, null]) {
  return useReducer((state, action) => [false, action], initialValue);
}

export async function setStorageItemAsync(key, value) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

export function useStorageState(key) {
  const [state, setState] = useAsyncState();

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key));
        }
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    } else {
      SecureStore.getItemAsync(key).then((value) => {
        setState(value);
      });
    }
  }, [key]);

  const setValue = useCallback(
    (value) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
