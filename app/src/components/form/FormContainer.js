import { ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

/**
 * Skrollar om innehållet inte får plats,
 * och flyttar upp innehållet när tangentbordet visas (Endast för IOS).
 * För formulär som inte får plats på skärmen, t.ex. RegisterScreen.
 */
export default function FormContainer({ children }) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 24,
    gap: 16,
  },
});