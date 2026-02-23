import React from 'react';

export type SheetConfig = {
  disablePan?: boolean;
  blur?: boolean;
};

export interface CurrentSheetState<T extends string | number = string> {
  type: T | null;
  props?: any;
}

export interface SheetHandlerRefType<T extends string | number = string> {
  show: (value: T, sheetProps?: any) => void;
  hide: () => void;
  getCurrentSheet: () => CurrentSheetState<T>;
  registerSheetShowListener: (listener: SheetShowListener<T>) => () => void;
  registerSheetHideListener: (listener: SheetHideListener) => () => void;
}

export type SheetShowListener<T extends string | number = string> = (
  state: CurrentSheetState<T>,
) => void;
export type SheetHideListener = () => void;

export interface SheetProviderProps<T extends string | number = string> {
  // Required: Custom enum object from consumer
  sheetEnums: Record<string, T>;

  // Required: Mapping of enum values to React components
  sheetComponents: Record<T, React.ComponentType<any>>;

  // Optional: Default configuration for each sheet type
  defaultSheetConfig?: Partial<Record<T, SheetConfig>>;

  // Optional: Custom storage helper (for pause functionality)
  storageHelper?: {
    getBoolean: (key: string) => boolean;
    set: (key: string, value: boolean) => void;
  };

  // Optional: Storage key for pause functionality
  pauseStorageKey?: string;
}

export interface ShowSheetParams<T extends string | number = string> {
  type: T;
  props?: any;
}

export interface SheetRef {
  show: (props?: {disablePanGestureHandler?: boolean; blur?: boolean}) => void;
  hide: () => void;
}
