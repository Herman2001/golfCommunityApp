import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import FormContainer from '../components/form/FormContainer';
import FormInput from '../components/form/FormInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import ErrorMessage from '../components/ui/ErrorMessage';
import { colors } from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enkel kontroll i appen för snabb återkoppling. Backenden validerar ändå.
  function validate() {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Ange din e-postadress.';
    }
    if (!password) {
      errors.password = 'Ange ditt lösenord.';
    }
    return errors;
  }

  async function handleLogin() {
    const errors = validate();
    setFieldErrors(errors);
    setErrorMessage(null);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // Vid lyckad inloggning byter navigationen automatiskt till profilen.
    } catch (error) {
      setErrorMessage(error.message);
      setFieldErrors(error.fieldErrors ?? {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormContainer>
      <Text style={styles.title} accessibilityRole="header">Välkommen tillbaka</Text>
      <Text style={styles.intro}>
        Logga in för att skapa inlägg, kommentera och spara det du gillar.
      </Text>

      <ErrorMessage message={errorMessage} />

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
        returnKeyType="next"
      />

      <FormInput
        label="Lösenord"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <PrimaryButton title="Logga in" onPress={handleLogin} loading={isSubmitting} />
      <PrimaryButton
        title="Inget konto? Skapa ett här"
        variant="secondary"
        onPress={() => navigation.navigate('Register')}
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