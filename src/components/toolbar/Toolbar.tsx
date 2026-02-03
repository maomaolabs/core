import { useWindows, useWindowActions } from '../../store/WindowStore'
import useToolbar from '../../hooks/useToolbar'
import { ToolbarProps } from './toolbarTypes'
import ToolbarDesktop from './ToolbarDesktop'
import ToolbarMobile from './ToolbarMobile'
import useIsMobile from '../../hooks/useIsMobile'

/**
 * Main toolbar component. Provides all options available to open windows.
 * @param windows - Array of window instances to be displayed in the toolbar.
 */
export default function Toolbar({ windowsOptions }: ToolbarProps) {

  const { openWindow, closeWindow } = useWindowActions()
  const currentWindows = useWindows()
  const { isOpen, toggleOpen, setIsOpen } = useToolbar()
  const isMobile = useIsMobile()

  return (
    <>
      {
        isMobile ? (
          <ToolbarMobile
            openWindow={openWindow}
            windowsOptions={windowsOptions}
            currentWindows={currentWindows}
            isOpen={isOpen}
            toggleOpen={toggleOpen}
            setIsOpen={setIsOpen}
          />
        ) : (
          <ToolbarDesktop
            openWindow={openWindow}
            closeWindow={closeWindow}
            windowsOptions={windowsOptions}
            currentWindows={currentWindows}
            isOpen={isOpen}
            toggleOpen={toggleOpen}
            setIsOpen={setIsOpen}
          />
        )}
    </>
  )
}