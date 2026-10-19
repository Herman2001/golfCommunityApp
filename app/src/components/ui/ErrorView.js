import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors } from '../../constants/colors';

/**
 * Visar ett fel men med möjlighet för anvädnaren att försöka igen. Används när innehåll inte kunde hämtas.
 */
export default function ErrorView({ title = 'Något gick fel', message, onRetry }) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onRetry ? <PrimaryButton title="Försök igen" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
});