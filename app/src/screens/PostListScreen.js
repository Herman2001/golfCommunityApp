import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchPosts } from '../api/posts';
import PostCard from '../components/posts/PostCard';
import CategoryFilter from '../components/posts/CategoryFilter';
import LoadingView from '../components/ui/LoadingView';
import ErrorView from '../components/ui/ErrorView';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';
import PrimaryButton from '../components/ui/PrimaryButton';
import { colors } from '../constants/colors';
import { useCategories } from '../hooks/useCategories';

const PAGE_SIZE = 10;

function Separator() {
  return <View style={styles.separator} />;
}

export default function PostListScreen({ navigation}) {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);

  const isLoadingMoreRef = useRef(false);
  const requestId = useRef(0);

  const { categories } = useCategories();

const loadPosts = useCallback(async ({ refreshing = false, quiet = false } = {}) => {
  const id = ++requestId.current;
  isLoadingMoreRef.current = false;
  setIsLoadingMore(false);
  setLoadMoreError(null);

  if (refreshing) {
    setIsRefreshing(true);
  } else if (!quiet){
    setIsLoading(true);
    setPosts([]);
  }
  setError(null);

  try {
    const result = await fetchPosts({ category: selectedCategory, page: 0, size: PAGE_SIZE });
    if (id !== requestId.current) return;
    setPosts(result.content);
    setPage(result.page);
    setHasNext(result.hasNext);
  } catch (e) {
    if (id !== requestId.current) return;
    setError(e.message);
  } finally {
    if (id === requestId.current) {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }
  }, [selectedCategory]);

  const loadMore = useCallback(async () => {
    if (!hasNext || isLoadingMoreRef.current || isLoading || isRefreshing) return;

    const id = requestId.current;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const result = await fetchPosts({ category: selectedCategory, page: page + 1, size: PAGE_SIZE });
      if (id != requestId.current) return;

      setPosts((current) => {
        const existingIds = new Set(current.map((post) => post.id));
        return [...current, ...result.content.filter((post) => !existingIds.has(post.id))];
      });
      setPage(result.page);
      setHasNext(result.hasNext);
    } catch (error) {
      if (id != requestId.current) return;
      setLoadMoreError(error.message);
    } finally {
      if (id == requestId.current) {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [hasNext, isLoading, isRefreshing, page, selectedCategory]);

const loadedCategory = useRef(undefined);
useFocusEffect(
  useCallback(() => {
    const categoryChanged = loadedCategory.current !== selectedCategory;
    loadedCategory.current = selectedCategory;
    loadPosts({ quiet: !categoryChanged });
  }, [loadPosts, selectedCategory])
);

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

  function renderFooter() {
    if (posts.length === 0) {
      return null;
    }

    if (isLoadingMore) {
      return (
        <ActivityIndicator
        style={styles.footer}
        color={colors.primary}
        accessibilityLabel='Hämtar fler inlägg'
        />
      );
    }
    if (loadMoreError) {
      return (
        <View style={[styles.footer, styles.footerError]}>
          <ErrorMessage message="Kunde inte ämta fler inlägg."/>
          <PrimaryButton title="Försök igen" variant='secondary' onPress={loadMore}/>
        </View>
      );
    }
    if (!hasNext) {
      return <Text style={[styles.footer, styles.endText]}>Inga fler inlägg</Text>;
    }
    return null;
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
      ListFooterComponent={renderFooter()}
      refreshing={isRefreshing}
      onRefresh={() => loadPosts({ refreshing: true })}
      onEndReached={() => {
        if (!loadMoreError) loadMore();
      }}
      onEndReachedThreshold={0.5}
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
  footer: {
    marginTop: 16,
  },
  footerError: {
    gap: 8,
  },
  endText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
  },
});