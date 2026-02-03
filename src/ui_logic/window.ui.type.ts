import { WindowStatusProps } from "../hooks/useWindow/useWindowStatus";

export type WindowUIProviderProps = WindowStatusProps & {
  minimize: () => void;
  maximize: () => void;
  restore: () => void;
}
