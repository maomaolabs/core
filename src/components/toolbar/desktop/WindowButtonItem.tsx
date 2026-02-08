
import { memo, useCallback } from 'react';
import ToolbarButton from "../common/ToolbarButton";
import { WindowInstance } from "../../../types";

export const WindowButtonItem = memo(({ window, currentWindows, openWindow, closeWindow }: {
  window: WindowInstance,
  currentWindows: WindowInstance[],
  openWindow: (w: WindowInstance) => void,
  closeWindow: (id: string) => void
}) => {
  const isActive = currentWindows.some((ow) => ow.id === window.id);
  const handleOpen = useCallback(() => openWindow({ ...window, zIndex: 0, layer: window.layer || 'normal' }), [openWindow, window]);
  const handleClose = useCallback(() => closeWindow(window.id), [closeWindow, window.id]);

  return (
    <ToolbarButton
      icon={window.icon}
      label={window.title}
      onClick={handleOpen}
      isActive={isActive}
      onClose={handleClose}
      component={window.component}
      windowId={window.id}
    />
  );
});
