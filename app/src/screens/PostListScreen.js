import { useCallback, useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchPosts } from '../api/posts';
import PostCard from '../components/posts/PostCard';
import CategoryFilter from '../components/posts/CategoryFilter';
import LoadingView from '../components/ui/LoadingView';
import ErrorView from '../components/ui/ErrorView';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import { colors } from '../constants/colors';
import { useCategories } from '../hooks/useCategories';

function Separator() {
  return <View style={styles.separator} />;
}

export default function PostListScreen({ navigation, route}) {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { categories } = useCategories();

const loadPosts = useCallback(async ({ refreshing = false, quiet = false } = {}) => {
  if (refreshing) {
    setIsRefreshing(true);
  } else if (!quiet){
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

// Körs när skärmen visas och när kategorin byts.
// Ny kategori ger en vanlig laddning. Kommer man bara tillbaka till listan
// hämtas den om tyst, så att nya och ändrade inlägg syns utan att listan blinkar.
const loadedCategory = useRef(undefined);
useFocusEffect(
  useCallback(() => {
    const categoryChanged = loadedCategory.current !== selectedCategory;
    loadedCategory.current = selectedCategory;
    loadPosts({ quiet: !categoryChanged });
  }, [loadPosts, selectedCategory])
);

  const deletedPostId = route.params?.deletedPostId;
  useEffect(() => {
    if (deletedPostId) {
      setPosts((current) => current.filter((post) => post.id !== deletedPostId));
    }
  }, [deletedPostId]);

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