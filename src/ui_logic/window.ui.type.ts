import { WindowStatusProps } from "../hooks/useWindowStatus";

export type WindowUIProviderProps = WindowStatusProps & {
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
}
