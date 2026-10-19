import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import FormInput from '../form/FormInput';
import PrimaryButton from '../ui/PrimaryButton';

const MAX_LENGTH = 1000;

/**
 * Fält för att skriva en kommentar,
 * onSubmit(text) ska returnera ett Promise. Kastar det fel visas det för anändaren.
 */
export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const trimmedText = text.trim();

  async function handleSubmit() {
    if (!trimmedText) {
      return;
    }
    setIsSending(true);
    setError(null);
    try {
      await onSubmit(trimmedText);
      setText('');
    } catch (e) {
      // Valideringsfel för fältet "body" från backenden, annars det allmänna meddelandet.
      setError(e.fieldErrors?.body ?? e.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <View style={styles.container}>
      <FormInput
        label="Skriv en kommentar"
        value={text}
        onChangeText={setText}
        error={error}
        placeholder="Vad tycker du?"
        multiline
        maxLength={MAX_LENGTH}
        textAlignVertical="top"
        editable={!isSending}
      />
      <PrimaryButton
        title="Skicka"
        onPress={handleSubmit}
        loading={isSending}
        disabled={!trimmedText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
