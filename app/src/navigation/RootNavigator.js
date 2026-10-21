import { ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/colors';
import PostListScreen from '../screens/PostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import EditPostScreen from '../screens/EditPostScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import LoginRequiredScreen from '../screens/LoginRequiredScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const FeedStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const TAB_ICONS = {
  FeedTab: 'list',
  CreateTab: 'add-circle',
  ProfileTab: 'person',
};

function FeedNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="PostList" component={PostListScreen} options={{ title: 'Golf Community' }} />
      <FeedStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Inlägg' }} />
      {isLoggedIn && (
        <FeedStack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Redigera inlägg' }} />
      )}
    </FeedStack.Navigator>
  );
}

function ProfileNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <ProfileStack.Navigator>
      {isLoggedIn ? (
        <>
          <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
          <ProfileStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Inlägg' }} />
          <ProfileStack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Redigera inlägg' }} />
        </>
      ) : (
        <>
          <ProfileStack.Screen name="Login" component={LoginScreen} options={{ title: 'Logga in' }} />
          <ProfileStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Skapa konto' }} />
        </>
      )}
    </ProfileStack.Navigator>
  );
}

export default function RootNavigator() {
  const { isLoggedIn, isRestoring } = useAuth();

  // Vänta tills SecureStore är läst, annars blinkar inloggningsskärmen förbi.
  if (isRestoring) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="FeedTab" component={FeedNavigator} options={{ title: 'Flöde' }} />
      <Tab.Screen
        name="CreateTab"
        component={isLoggedIn ? CreatePostScreen : LoginRequiredScreen}
        options={{ title: 'Skapa', headerShown: true, headerTitle: 'Nytt inlägg' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ title: isLoggedIn ? 'Profil' : 'Logga in' }}
      />
    </Tab.Navigator>
  );
}