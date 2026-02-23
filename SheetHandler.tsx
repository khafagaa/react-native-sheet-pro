import React, {
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import Sheet from './Sheet';
import {
  SheetProviderProps,
  CurrentSheetState,
  SheetHandlerRefType,
  SheetConfig,
  SheetRef,
  SheetShowListener,
  SheetHideListener,
} from './types';
import Toast from './Toast';
import {Alert} from 'react-native';

// Legacy exports for backward compatibility
export interface LegacyCurrentSheetState {
  type: string | null;
  props?: any;
}
export interface LegacySheetHandlerRefType {
  show: (value: string, sheetProps?: any) => void;
  hide: () => void;
  getCurrentSheet: () => LegacyCurrentSheetState;
  registerSheetShowListener: (
    listener: SheetShowListener<string>,
  ) => () => void;
  registerSheetHideListener: (listener: SheetHideListener) => () => void;
}
export const SheetHandlerRef = createRef<LegacySheetHandlerRefType>();

// Instance-specific listeners (will be managed per instance)
const createListenerManager = <T extends string | number = string>() => {
  const sheetShowListeners = new Set<SheetShowListener<T>>();
  const sheetHideListeners = new Set<SheetHideListener>();

  const notifySheetShow = (state: CurrentSheetState<T>) => {
    sheetShowListeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in sheet show listener:', error);
      }
    });
  };

  const notifySheetHide = () => {
    sheetHideListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in sheet hide listener:', error);
      }
    });
  };

  const registerSheetShowListener = (listener: SheetShowListener<T>) => {
    sheetShowListeners.add(listener);
    return () => sheetShowListeners.delete(listener);
  };

  const registerSheetHideListener = (listener: SheetHideListener) => {
    sheetHideListeners.add(listener);
    return () => sheetHideListeners.delete(listener);
  };

  return {
    notifySheetShow,
    notifySheetHide,
    registerSheetShowListener,
    registerSheetHideListener,
  };
};

// Legacy listener exports for backward compatibility
const legacyListeners = createListenerManager<string>();
export const registerSheetShowListener =
  legacyListeners.registerSheetShowListener;
export const registerSheetHideListener =
  legacyListeners.registerSheetHideListener;

const SheetHandler = <T extends string | number = string>(
  props: SheetProviderProps<T>,
  ref: React.Ref<SheetHandlerRefType<T>>,
) => {
  const {
    sheetEnums,
    sheetComponents,
    defaultSheetConfig = {},
    storageHelper,
    pauseStorageKey = 'PAUSE_ALL_SHEETS',
  } = props;

  const SheetRefInternal = useRef<SheetRef>(null);
  const [SheetUI, setSheetUI] = useState<React.ReactElement | null>(null);
  const [currentSheetState, setCurrentSheetState] = useState<
    CurrentSheetState<T>
  >({
    type: null,
  });

  // Create instance-specific listener manager
  const listenerManager = useMemo(() => createListenerManager<T>(), []);

  // Validate that all enum values have corresponding components
  const sheetConfig: Partial<Record<T, SheetConfig>> = useMemo(() => {
    const config: Partial<Record<T, SheetConfig>> = {};
    const alertObj: Record<string, string> = {};
    sheetEnums &&
      Object.values(sheetEnums).forEach(enumValue => {
        if (!sheetComponents[enumValue]) {
          alertObj[enumValue as string] = `${enumValue}`;
        }
        const defaultConfig = (
          defaultSheetConfig as Partial<Record<T, SheetConfig>>
        )[enumValue];
        config[enumValue] = defaultConfig || {
          disablePan: false,
          blur: false,
        };
      });
    if (Object.keys(alertObj).length > 0) {
      Alert.alert(
        `SHEET WARNING ${'\n'}No component provided for sheet enum: ${'\n'}${Object.values(alertObj).join('\n')}\n`,
        'warning',
      );
    }
    return config;
  }, [sheetEnums, sheetComponents, defaultSheetConfig]);

  const RenderSheet = (value: T, sheetProps?: any) => {
    const nextState: CurrentSheetState<T> = {type: value, props: sheetProps};
    setCurrentSheetState(nextState);

    const SheetComponent = sheetComponents[value];
    if (!SheetComponent) {
      setSheetUI(<Toast value={value} visible={true} onDismiss={hide} />);
      return nextState;
    }

    setSheetUI(<SheetComponent {...sheetProps} />);
    return nextState;
  };

  const show = (value: T, sheetProps?: any) => {
    // Check pause state if storage helper is provided
    if (storageHelper) {
      const shouldPause = storageHelper.getBoolean(pauseStorageKey);
      if (shouldPause) {
        storageHelper.set(pauseStorageKey, false);
        return;
      }
    }

    const nextState = RenderSheet(value, sheetProps);
    listenerManager.notifySheetShow(nextState);
    legacyListeners.notifySheetShow(nextState as CurrentSheetState<string>);
    const config = sheetConfig[value];
    const isToast = !sheetComponents[value];
    SheetRefInternal.current?.show({
      disablePanGestureHandler: isToast
        ? false
        : (sheetProps?.disablePanGestureHandler ?? config?.disablePan ?? false),
      blur: isToast ? false : (sheetProps?.blur ?? config?.blur ?? false),
    });
  };

  const hide = () => {
    SheetRefInternal.current?.hide();
  };

  const handleSheetHide = () => {
    setCurrentSheetState({type: null});
    setSheetUI(null);
    listenerManager.notifySheetHide();
    legacyListeners.notifySheetHide();
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
    getCurrentSheet: () => currentSheetState,
    registerSheetShowListener: listenerManager.registerSheetShowListener,
    registerSheetHideListener: listenerManager.registerSheetHideListener,
  }));

  return (
    <Sheet ref={SheetRefInternal} onHide={handleSheetHide}>
      {SheetUI}
    </Sheet>
  );
};

export default forwardRef(SheetHandler) as <T extends string | number = string>(
  props: SheetProviderProps<T> & {
    ref?: React.Ref<SheetHandlerRefType<T>>;
  },
) => React.ReactElement;
