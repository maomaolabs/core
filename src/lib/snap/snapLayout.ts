export type SnapType =
  | 'none'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const SNAP_CONFIG: Partial<
  Record<SnapType, (w: number, h: number) => Rect>
> = {
  'top-left':     (w, h) => ({ top: 0,     left: 0,     width: w / 2, height: h / 2 }),
  'top-right':    (w, h) => ({ top: 0,     left: w / 2, width: w / 2, height: h / 2 }),
  'bottom-left':  (w, h) => ({ top: h / 2, left: 0,     width: w / 2, height: h / 2 }),
  'bottom-right': (w, h) => ({ top: h / 2, left: w / 2, width: w / 2, height: h / 2 }),
  top:            (w, h) => ({ top: 0,     left: 0,     width: w,     height: h / 2 }),
  bottom:         (w, h) => ({ top: h / 2, left: 0,     width: w,     height: h / 2 }),
  left:           (w, h) => ({ top: 0,     left: 0,     width: w / 2, height: h }),
  right:          (w, h) => ({ top: 0,     left: w / 2, width: w / 2, height: h }),
};
