import { WindowDefinition } from "../../../types";

export type ToolbarAction = {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export type ToolbarState = 'idle' | 'active' | 'open';

/**
 * ToolbarProps type.
 * Defines the properties of the toolbar.
 * 
 * @property {WindowDefinition[]} windows - The windows to be displayed in the toolbar.
 */
export type ToolbarProps = {
  windowsOptions: WindowDefinition[];
}
