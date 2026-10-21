import { Text, View } from 'react-native';
import PrimaryButton from '../components/ui/PrimaryButton';
export default function LoginRequiredScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
      <Text style={{ textAlign: 'center' }}>Du behöver vara inloggad för att skapa inlägg.</Text>
      <PrimaryButton title="Logga in" onPress={() => navigation.navigate('ProfileTab')} />
    </View>
  );
}