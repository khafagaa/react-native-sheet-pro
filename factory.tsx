import React, {createRef, RefObject} from 'react';
import SheetHandler from './SheetHandler';
import {
  SheetProviderProps,
  SheetHandlerRefType,
  CurrentSheetState,
  ShowSheetParams,
} from './types';

export interface SheetLibraryAPI<T extends string | number = string> {
  SheetProvider: React.FC<SheetProviderProps<T>>;
  showSheet: (params: ShowSheetParams<T>) => void;
  hideSheet: () => void;
  getCurrentSheet: () => CurrentSheetState<T>;
  registerSheetShowListener: (
    listener: (state: CurrentSheetState<T>) => void,
  ) => () => void;
  registerSheetHideListener: (listener: () => void) => () => void;
  SheetRef: RefObject<SheetHandlerRefType<T>>;
}

export function createSheetLibrary<
  T extends string | number = string,
>(): SheetLibraryAPI<T> {
  // Create a ref that will be shared across the library instance
  const SheetRef = createRef<SheetHandlerRefType<T>>();

  const SheetProvider: React.FC<SheetProviderProps<T>> = props => {
    return <SheetHandler {...props} ref={SheetRef} />;
  };

  const showSheet = (params: ShowSheetParams<T>) => {
    const {type, props: sheetProps} = params;
    SheetRef.current?.show(type, sheetProps);
  };

  const hideSheet = () => {
    SheetRef.current?.hide();
  };

  const getCurrentSheet = (): CurrentSheetState<T> => {
    return SheetRef.current?.getCurrentSheet() ?? {type: null};
  };

  // Get listener functions from the ref
  const registerSheetShowListener = (
    listener: (state: CurrentSheetState<T>) => void,
  ) => {
    return SheetRef.current?.registerSheetShowListener(listener) ?? (() => {});
  };

  const registerSheetHideListener = (listener: () => void) => {
    return SheetRef.current?.registerSheetHideListener(listener) ?? (() => {});
  };

  return {
    SheetProvider,
    showSheet,
    hideSheet,
    getCurrentSheet,
    registerSheetShowListener,
    registerSheetHideListener,
    SheetRef,
  };
}
