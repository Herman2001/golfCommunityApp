import { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchMyPosts } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/posts/PostCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import ErrorMessage from '../components/ui/ErrorMessage';
import ErrorView from '../components/ui/ErrorView';
import EmptyState from '../components/ui/EmptyState';
import LoadingView from '../components/ui/LoadingView';
import { colors } from '../constants/colors';
import Avatar from '../components/ui/Avatar';

function Separator() {
  return <View style={styles.separator} />;
}

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadMyPosts = useCallback(async ({ refreshing = false, quiet = false } = {}) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else if (!quiet) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const page = await fetchMyPosts();
      setMyPosts(page.content);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Hämta när profilen visas: första gången med laddning, därefter tyst,
  // så att nya, ändrade och borttagna inlägg syns när man kommer tillbaka.
  const hasLoaded = useRef(false);
  useFocusEffect(
    useCallback(() => {
      loadMyPosts({ quiet: hasLoaded.current });
      hasLoaded.current = true;
    }, [loadMyPosts])
  );

  function confirmLogout() {
    Alert.alert('Logga ut?', 'Du behöver logga in igen för att skapa och kommentera.', [
      { text: 'Avbryt', style: 'cancel' },
      { text: 'Logga ut', style: 'destructive', onPress: logout },
    ]);
  }

  function renderEmpty() {
    if (isLoading) {
      return <LoadingView message="Hämtar dina inlägg..." />;
    }
    if (error) {
      return (
        <ErrorView title="Kunde inte hämta dina inlägg" message={error} onRetry={() => loadMyPosts()} />
      );
    }
    return (
      <EmptyState
        title="Du har inga inlägg än"
        message="Skapa ditt första inlägg under fliken Skapa."
      />
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
  });

  const header = (
    <View style={styles.header}>
      <View style={styles.profileCard}>
        <Avatar name={user.username} size={56} />
        <View style={styles.profileInfo}>
          <Text style={styles.username} accessibilityRole="header">{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.meta}>Medlem sedan {memberSince}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Mina inlägg{isLoading ? '' : ` (${myPosts.length})`}
      </Text>

      {error && myPosts.length > 0 ? <ErrorMessage message={error} /> : null}
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <PrimaryButton title="Logga ut" variant="secondary" onPress={confirmLogout} />
    </View>
  );

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={myPosts}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        />
      )}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={header}
      ListEmptyComponent={renderEmpty()}
      ListFooterComponent={footer}
      refreshing={isRefreshing}
      onRefresh={() => loadMyPosts({ refreshing: true })}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: 16,
  },
  header: {
    gap: 16,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  email: {
    fontSize: 15,
    color: colors.textMuted,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  separator: {
    height: 12,
  },
  footer: {
    marginTop: 24,
  },
});