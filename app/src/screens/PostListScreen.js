import { Button, Text, View } from 'react-native';

export default function PostListScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Inläggslista</Text>
      <Button title="Öppna inlägg 1" onPress={() => navigation.navigate('PostDetail', { postId: 1 })} />
    </View>
  );
}