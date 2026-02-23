// Main factory export
export {createSheetLibrary} from './factory';
export type {SheetLibraryAPI} from './factory';

// Core components
export {default as Sheet} from './Sheet';
export {
  default as SheetHandler,
  SheetHandlerRef,
  registerSheetShowListener,
  registerSheetHideListener,
} from './SheetHandler';

// Helper functions
export {showSheet, hideSheet, getCurrentSheet} from './helpers';

// Types
export type {
  SheetConfig,
  CurrentSheetState,
  SheetHandlerRefType,
  SheetShowListener,
  SheetHideListener,
  SheetProviderProps,
  ShowSheetParams,
  SheetRef,
} from './types';

// Styles (for customization)
export {styles as sheetStyles} from './styles';

// Example components (for demo/documentation)
export {
  TopSheetExample,
  CenterSheetExample,
  BottomSheetExample,
} from './examples';
