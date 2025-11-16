import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const lightTheme = {
    color: {
        primary: '#ffffffff',
        secondary: '#000000ff',
        background: '#ffffff',
        background2: '#f4f4f4ff',
        brand: '#964B00',
        brandLight: '#CFA963',
        white: '#ffffff',
        black: '#000000ff',
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
    }
};

export const darkTheme = {
    color: {
        primary: '#ffffffff',
        secondary: '#000000ff',
        background: '#ffffff',
        background2: '#f4f4f4ff',
        brand: '#964B00',
        brandLight: '#CFA963',
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
    }
};

export const theme = lightTheme;