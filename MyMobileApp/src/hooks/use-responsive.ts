import { useWindowDimensions } from 'react-native';

import { layout, spacing } from '@/theme';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= layout.tabletBreakpoint;
  const isDesktop = width >= layout.desktopBreakpoint;

  const gutter = isDesktop ? spacing.xxl : isTablet ? spacing.xl : spacing.md;
  const contentWidth = Math.min(width, layout.maxContentWidth) - gutter * 2;

  // Product grid columns per breakpoint
  const columns = width >= 1200 ? 4 : isTablet ? 3 : 2;

  return { width, height, isTablet, isDesktop, gutter, contentWidth, columns };
}
