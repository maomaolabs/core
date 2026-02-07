import { useMemo } from 'react';
import { ToolbarItem, FolderDefinition, WindowInstance } from '../types';

export function isFolder(item: ToolbarItem): item is FolderDefinition {
    return 'apps' in item;
}

export function useToolbarItems(
    rawWindowsOptions: ToolbarItem[],
    currentWindows: WindowInstance[]
) {
    const windowsOptions = useMemo(() => {
        return Array.isArray(rawWindowsOptions) ? rawWindowsOptions : [];
    }, [rawWindowsOptions]);

    const availableItems = useMemo(() => {
        return windowsOptions;
    }, [windowsOptions]);

    return {
        windowsOptions,
        isFolder
    };
}
