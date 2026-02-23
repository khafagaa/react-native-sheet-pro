import {SheetHandlerRef} from './SheetHandler';
import {ShowSheetParams} from './types';

/**
 * Show a sheet
 * @param params - The sheet type and props
 * @param params.type - The enum value for the sheet type
 * @param params.props - Props to pass to the sheet component (including optional overrides)
 */
export const showSheet = <T extends string | number = string>(
  params: ShowSheetParams<T>,
) => {
  const {type, props} = params;
  SheetHandlerRef.current?.show(type as string, props);
};

/**
 * Hide the currently visible sheet
 */
export const hideSheet = () => {
  SheetHandlerRef.current?.hide();
};

/**
 * Get the current sheet state
 * @returns The current sheet state with type and props
 */
export const getCurrentSheet = () => {
  return SheetHandlerRef.current?.getCurrentSheet() ?? {type: null};
};
