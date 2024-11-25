export const palette = {
  white: '#ffffff',
  offWhite: '#fff9ef',
  black: '#000000',
  darkGrey: '#4F4F4F',
  lightGrey: '#E6E6E6',
  yellow: '#F9F137',
  lightYellow: '#FCF45F',
  darkBlue: '#08376B',
  blue: '#3c89ff',
  lightBlue: '#98c1ff',
  lightBlue2: '#8da3bb',
  red: '#DC3545',
  green: '#5DFF8C',
};

export const theme = {
  colors: {
    background: palette.offWhite,
    foreground: palette.black,
    secondaryForeground: palette.darkGrey,
    primary: palette.yellow,
    secondary: palette.lightYellow,
    tertiary: palette.blue,
    accent: palette.lightBlue,
    danger: palette.red,
    success: palette.green,
    active: palette.darkGrey,
    inactive: palette.lightGrey,
		text: palette.black,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  // TODO: font families here
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.black,
    foreground: palette.white,
  },
};
