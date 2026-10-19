import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

export default function LoadingView({ message = 'Laddar...' }) {
    return (
        <View style={styles.container} accessibilityRole={message}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  text: {
    fontSize: 15,
    color: colors.textMuted,
  },
});