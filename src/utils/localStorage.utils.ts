/* eslint-disable @typescript-eslint/no-explicit-any */
const localStorage = window.localStorage;

type StorageKey = "currentShop" | "session" | "currencyCode" | "persist:SessionsliceReducer";

export const getItem = (value: StorageKey): string | null => {
  return localStorage.getItem(value);
};

export const getItemAsObject = (value: StorageKey) => {
  const data = localStorage.getItem(value);
  return data ? JSON.parse(data) : {};
};

export const getItemAsArray = (value: string) => {
  const data = localStorage.getItem(value);
  return data ? JSON.parse(data) : [];
};

export const setItem = (key: StorageKey, value: any): void => {
  return localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Does the same thing with setItem. Just making the function explicit
 * @param key
 * @param value
 * @returns
 */
export const saveItemAsObject = (key: StorageKey, value: any): void => {
  return localStorage.setItem(key, JSON.stringify(value));
};

export const saveItemAsString = (key: StorageKey, value: string): void => {
  return localStorage.setItem(key, value);
};
