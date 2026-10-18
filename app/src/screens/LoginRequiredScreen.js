import { Button, Text, View } from 'react-native';

export default function LoginRequiredScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
      <Text style={{ textAlign: 'center' }}>Du behöver vara inloggad för att skapa inlägg.</Text>
      <Button title="Logga in" onPress={() => navigation.navigate('ProfileTab')} />
    </View>
  );
}