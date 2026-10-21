import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';

/**
 * Rund avatar med första bokstaven av namnet.
 */

export default function Avatar({name, size = 56}) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <View
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={[styles.text, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  text: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});