import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

/**
 * Visar ett felmeddelande i en ruta. Visar ingenting om message saknas.
 */
export default function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.box} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FDECEA',
  },
  text: {
    fontSize: 15,
    color: colors.error,
  },
});