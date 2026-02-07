
import { memo, useCallback } from 'react';
import ToolbarButton from "../common/ToolbarButton";
import { WindowDefinition, WindowInstance } from "../../../types";

export const MobileOptionItem = memo(({ window, currentWindows, openWindow, closeMenu }: {
  window: WindowDefinition,
  currentWindows: WindowInstance[],
  openWindow: (w: WindowInstance) => void,
  closeMenu: () => void
}) => {
  const isActive = currentWindows.some((ow) => ow.id === window.id);
  const handleOpen = useCallback(() => {
    openWindow({ ...window, zIndex: 0 } as WindowInstance);
    closeMenu();
  }, [openWindow, window, closeMenu]);

  return (
    <ToolbarButton
      icon={window.icon}
      label={window.title}
      onClick={handleOpen}
      isActive={isActive}
      showTooltip={false}
    />
  );
});
