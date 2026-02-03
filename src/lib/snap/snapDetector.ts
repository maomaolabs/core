import { SnapType, Rect, SNAP_CONFIG } from "./snaplayout";

export function getSnapSuggestion(
  clientX: number,
  clientY: number,
  viewportW: number,
  viewportH: number,
  threshold: number
): { type: SnapType; rect: Rect } | undefined {
  const isTop = clientY < threshold;
  const isBottom = clientY > viewportH - threshold;
  const isLeft = clientX < threshold;
  const isRight = clientX > viewportW - threshold;

  let type: SnapType | undefined;

  if (isTop && isLeft) type = 'top-left';
  else if (isTop && isRight) type = 'top-right';
  else if (isBottom && isLeft) type = 'bottom-left';
  else if (isBottom && isRight) type = 'bottom-right';
  else if (isTop) type = 'top';
  else if (isBottom) type = 'bottom';
  else if (isLeft) type = 'left';
  else if (isRight) type = 'right';
  else return;

  const layout = SNAP_CONFIG[type];
  if (!layout) return;

  return {
    type,
    rect: layout(viewportW, viewportH),
  };
}
