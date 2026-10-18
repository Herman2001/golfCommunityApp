import { Button, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function PostDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const { isLoggedIn } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Detaljvy för inlägg {postId}</Text>
      {isLoggedIn && (
        <Button title="Redigera" onPress={() => navigation.navigate('EditPost', { postId })} />
      )}
    </View>
  );
}