import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import FormContainer from '../components/form/FormContainer';
import FormInput from '../components/form/FormInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import ErrorMessage from '../components/ui/ErrorMessage';
import { colors } from '../constants/colors';

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bara de enklaste kontrollerna här. Övriga regler (tillåtna tecken, upptaget namn osv.)
  // kontrolleras av backenden och visas via fieldErrors eller errorMessage.
  function validate() {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Ange ett användarnamn.';
    }
    if (!email.trim()) {
      errors.email = 'Ange en e-postadress.';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Lösenordet måste vara minst ${MIN_PASSWORD_LENGTH} tecken.`;
    }
    return errors;
  }

  async function handleRegister() {
    const errors = validate();
    setFieldErrors(errors);
    setErrorMessage(null);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(username.trim(), email.trim(), password);
      Alert.alert('Välkommen!', 'Ditt konto är skapat och du är inloggad.');
    } catch (error) {
      setErrorMessage(error.message);
      setFieldErrors(error.fieldErrors ?? {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormContainer>
      <Text style={styles.title} accessibilityRole="header">Skapa konto</Text>
      <Text style={styles.intro}>
        Bli en del av communityn och hitta spelpartners, köp och sälj utrustning eller ställ frågor.
      </Text>

      <ErrorMessage message={errorMessage} />

      <FormInput
        label="Användarnamn"
        value={username}
        onChangeText={setUsername}
        error={fieldErrors.username}
        placeholder="t.ex. Tiger Woods"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        textContentType="username"
      />

      <FormInput
        label="E-post"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        placeholder="namn@exempel.se"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <FormInput
        label="Lösenord"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        placeholder={`Minst ${MIN_PASSWORD_LENGTH} tecken`}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      <PrimaryButton title="Skapa konto" onPress={handleRegister} loading={isSubmitting} />
      <PrimaryButton
        title="Har du redan ett konto? Logga in"
        variant="secondary"
        onPress={() => navigation.goBack()}
        disabled={isSubmitting}
      />
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  intro: {
    fontSize: 16,
    color: colors.textMuted,
  },
});