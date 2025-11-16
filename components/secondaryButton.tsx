import { theme } from "@/styles/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
    title: string;
    onPress: () => void;
}

export default function SecondaryButton({ title, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        backgroundColor: theme.color.white,
        paddingVertical: 17,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 17,
        fontFamily: theme.font.semiBold,
        color: "#222",
    },
});
