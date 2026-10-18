import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [error, setError] = useState(null);

  async function handleDemoLogin() {
    setError(null);
    try {
      await login('demo@golfcommunity.se', 'demo1234');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Logga in</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button title="Logga in som demo" onPress={handleDemoLogin} />
      <Button title="Skapa konto" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}