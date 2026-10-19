import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchPosts } from '../api/posts';
import { fetchCategories } from '../api/categories';
import PostCard from '../components/posts/PostCard';
import CategoryFilter from '../components/posts/CategoryFilter';
import LoadingView from '../components/ui/LoadingView';
import ErrorView from '../components/ui/ErrorView';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import { colors } from '../constants/colors';

function Separator() {
  return <View style={styles.separator} />;
}

export default function PostListScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((e) => console.warn('Kunde inte hämta kategorier', e.message));
  }, []);

const loadPosts = useCallback(async ({ refreshing = false } = {}) => {
  if (refreshing) {
    setIsRefreshing(true);
  } else {
    setIsLoading(true);
    setPosts([]);
  }
  setError(null);

  try {
    const page = await fetchPosts({ category: selectedCategory });
    setPosts(page.content);
  } catch (e) {
    setError(e.message);
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
}, [selectedCategory]);

  // Körs vid start och varje gång kategorin byts (då skapas loadPosts om).
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function renderEmpty() {
    if (isLoading) {
      return <LoadingView message="Hämtar inlägg..." />;
    }
    if (error) {
      return (
        <ErrorView
          title="Kunde inte hämta inläggen"
          message={error}
          onRetry={() => loadPosts()}
        />
      );
    }
    return (
      <EmptyState
        title="Inga inlägg här än"
        message={selectedCategory
          ? 'Det finns inga inlägg i den här kategorin ännu.'
          : 'Bli först med att skapa ett inlägg!'}
      />
    );
  }

  const header = (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">Välkommen till Golf Community</Text>
      <Text style={styles.intro}>
        Ställ frågor, köp och sälj utrustning, dela tips om banor och hitta någon att spela med.
      </Text>
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      {error && posts.length > 0 ? <ErrorMessage message={error} /> : null}
    </View>
  );

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={posts}
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
      refreshing={isRefreshing}
      onRefresh={() => loadPosts({ refreshing: true })}
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
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  intro: {
    fontSize: 15,
    color: colors.textMuted,
  },
  separator: {
    height: 12,
  },
});