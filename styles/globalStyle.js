import { Dimensions, StyleSheet } from 'react-native';
// import { theme as defaultTheme } from './theme';
import { theme } from './theme';

const { width, height } = Dimensions.get('window')

export const createGlobalStyles = (theme) => {
    return StyleSheet.create({
        input: {
            padding: 20,
            borderWidth: 1,
            borderColor: '#E6E6E6',
            backgroundColor: '#F2F2F2',
            borderRadius: 50
        },
        pText: {
            fontFamily: theme.font.NunVarFont,
            fontSize: width * 0.08,
            color: theme.color.primary,
        },
        solidButton: {
            backgroundColor: theme.color.brand,
            fontFamily: theme.font.regular,
            alignSelf: 'center',
            width: width / 1.25,
            paddingVertical: 25,
            borderRadius: 40,
            alignItems: 'center',
            // borderColor: theme.color.primary,
            // borderWidth: 1,
        },
        solidDefaultButton: {
            backgroundColor: theme.color.brand,
            fontFamily: theme.font.regular,
            alignSelf: 'center',
            borderRadius: 40,
            alignItems: 'center',
        },
        solidButtonText: {
            fontFamily: theme.font.medium,
            color: theme.color.primary,
            fontSize: width * 0.034,
        },
    })
}

export const globalStyle = createGlobalStyles(theme);