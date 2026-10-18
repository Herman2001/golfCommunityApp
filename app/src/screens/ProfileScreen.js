import { Button, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Inloggad som {user.username}</Text>
      <Button title="Logga ut" onPress={logout} />
    </View>
  );
}