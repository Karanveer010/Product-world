import COLORS from "./colors";

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SIZES = {
  h1: 26,
  h2: 20,
  h3: 16,
  body: 14,
  caption: 12,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusRound: 30,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: SIZES.h1,
    fontWeight: "bold" as const,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: SIZES.h2,
    fontWeight: "600" as const,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: SIZES.h3,
    fontWeight: "600" as const,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: SIZES.body,
    fontWeight: "normal" as const,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: SIZES.caption,
    fontWeight: "normal" as const,
    color: COLORS.textSecondary,
  },
};

export default { SPACING, SIZES, SHADOWS, TYPOGRAPHY };
