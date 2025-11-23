import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const lightTheme = {
  color: {
<<<<<<< HEAD
    primary: "#ffffffff",
    secondary: "#000000ff",
    background: "#ffffff",
    background2: "#F9F9F9",
    brand: "#964B00",
    brandLight: "#CFA963",
    white: "#ffffff",
    black: "#000000ff",
    border: "#e6e6e6",
    paragraph: "#3C3A3599",
    gray: "#e3e3e3",
    actionIcon: "#B1A7BE",
=======
    primary: '#ffffffff',
    secondary: '#000000ff',
    background: '#ffffff',
    background2: '#f4f4f4ff',
    background3: '#E3E3E333',
    brand: '#964B00',
    brandLight: '#CFA963',
    white: '#ffffff',
    black: '#000000ff',
    border: '#e6e6e6',
    paragraph: '#3C3A3599',
    gray: '#e3e3e3',
>>>>>>> 61c9f02 (feat: Update Profile)
  },
  // fontSize: {
  //     small: width * 0.03,
  //     medium: width * 0.04,
  //     large: width * 0.055,
  //     xlarge: width * 0.065,
  //     sxlarge: width * 0.095,
  //     xxlarge: width * 0.12,
  // },
  font: {
    light: 'NunitoSans-Light',
    regular: 'NunitoSans-Regular',
    bold: 'NunitoSans-Bold',
    semiBold: 'NunitoSans-SemiBold',
    extraBold: 'NunitoSans-ExtraBold',
    black: 'NunitoSans-Black',
    digital: 'DigitalNumbers-Regular'
  },
};

export const darkTheme = {
  color: {
<<<<<<< HEAD
    primary: "#ffffffff",
    secondary: "#000000ff",
    background: "#ffffff",
    background2: "#f4f4f4ff",
    brand: "#964B00",
    brandLight: "#CFA963",
    border: "#e6e6e6",
    paragraph: "#3c3a35dd",
    gray: "#e3e3e3",
=======
    primary: '#ffffffff',
    secondary: '#000000ff',
    background: '#ffffff',
    background2: '#f4f4f4ff',
    background3: '#E3E3E333',
    brand: '#964B00',
    brandLight: '#CFA963',
    border: '#e6e6e6',
    paragraph: '#3c3a35dd',
    gray: '#e3e3e3',
>>>>>>> 61c9f02 (feat: Update Profile)
  },
  // fontSize: {
  //     small: width * 0.03,
  //     medium: width * 0.04,
  //     large: width * 0.055,
  //     xlarge: width * 0.065,
  //     sxlarge: width * 0.095,
  //     xxlarge: width * 0.12,

  // },
  font: {
    light: 'NunitoSans-Light',
    regular: 'NunitoSans-Regular',
    bold: 'NunitoSans-Bold',
    semiBold: 'NunitoSans-SemiBold',
    extraBold: 'NunitoSans-ExtraBold',
    black: 'NunitoSans-Black',
    digital: 'DigitalNumbers-Regular'
  },
};

export const theme = lightTheme;
