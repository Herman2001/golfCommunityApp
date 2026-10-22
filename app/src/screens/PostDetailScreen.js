import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { deletePost, fetchPost } from '../api/posts';
import { createComment, deleteComment, fetchComments } from '../api/comments';
import { useAuth } from '../context/AuthContext';
import AuthorInfo from '../components/posts/AuthorInfo';
import CommentForm from '../components/posts/CommentForm';
import CommentItem from '../components/posts/CommentItem';
import ErrorMessage from '../components/ui/ErrorMessage';
import ErrorView from '../components/ui/ErrorView';
import IconButton from '../components/ui/IconButton';
import LoadingView from '../components/ui/LoadingView';
import PrimaryButton from '../components/ui/PrimaryButton';
import { colors } from '../constants/colors';
import { formatPrice, formatRelativeDate } from '../utils/format';
import Divider from '../components/ui/Divider';

export default function PostDetailScreen({ route, navigation }) {
  const { postId } = route.params;
  const { user, isLoggedIn } = useAuth();

  // Inlägget
  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [errorPost, setErrorPost] = useState(null);

  // Kommentarerna har egen laddning och eget fel. Går de inte att hämta visas inlägget ändå.
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // post är null medan inlägget hämtas, därför kontrolleras det först.
  const isOwner = post !== null && user !== null && user.id === post.author.id;

  const loadPost = useCallback(async () => {
    setIsLoadingPost(true);
    setErrorPost(null);
    try {
      setPost(await fetchPost(postId));
    } catch (e) {
      setErrorPost(e);
    } finally {
      setIsLoadingPost(false);
    }
  }, [postId]);

  const loadComments = useCallback(async () => {
    setIsLoadingComments(true);
    setCommentsError(null);
    try {
      setComments(await fetchComments(postId));
    } catch (e) {
      setCommentsError(e.message);
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId]);

  // Hämtar båda samtidigt (utan await) så att skärmen laddar snabbare.
  useEffect(() => {
    loadPost();
    loadComments();
  }, [loadPost, loadComments]);

  // När skärmen visas igen (t.ex. efter redigering) hämtas inlägget om i bakgrunden.
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      fetchPost(postId)
        .then(setPost)
        .catch((e) => console.warn('Kunde inte uppdatera inlägget', e.message));
    }, [postId])
  );

  // Visar ikonerna för redigera och ta bort i rubrikraden, men bara för inläggets ägare.
  useLayoutEffect(() => {
    if (!isOwner) {
      navigation.setOptions({ headerRight: undefined });
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <IconButton
            icon="create-outline"
            color={colors.primary}
            accessibilityLabel="Redigera inlägget"
            onPress={() => navigation.navigate('EditPost', { postId: post.id })}
            disabled={isDeleting}
          />
          {isDeleting ? (
            <ActivityIndicator color={colors.error} style={styles.headerSpinner} />
          ) : (
            <IconButton
              icon="trash-outline"
              color={colors.error}
              accessibilityLabel="Ta bort inlägget"
              onPress={confirmDelete}
            />
          )}
        </View>
      ),
    });
  }, [navigation, post, isOwner, isDeleting]);

  async function handleShare() {
    try {
      await Share.share({
        title: post.title,
        message: `${post.title}\n\n${post.body}\n\nDelat från Golf Community`,
      });
    } catch (e) {
      console.warn('Kunde inte dela', e);
      Alert.alert('Kunde inte dela', 'Försök igen senare.');
    }
  }

  function confirmDelete() {
    Alert.alert('Ta bort inlägget?', 'Det går inte att ångra.', [
      { text: 'Avbryt', style: 'cancel' },
      { text: 'Ta bort', style: 'destructive', onPress: handleDelete },
    ]);
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      Alert.alert('Inlägget är borttaget');
      navigation.goBack();
    } catch (e) {
      setIsDeleting(false);
      Alert.alert('Kunde inte ta bort inlägget', e.message);
    }
  }

  async function handleAddComment(text) {
    const newComment = await createComment(postId, { body: text });
    // Lägg till den nya kommentaren sist, utan att hämta om alla.
    setComments((current) => [...current, newComment]);
  }

  function confirmDeleteComment(comment) {
    Alert.alert('Ta bort kommentaren?', 'Det går inte att ångra.', [
      { text: 'Avbryt', style: 'cancel' },
      { text: 'Ta bort', style: 'destructive', onPress: () => handleDeleteComment(comment.id) },
    ]);
  }

  async function handleDeleteComment(commentId) {
    try {
      await deleteComment(commentId);
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch (e) {
      Alert.alert('Kunde inte ta bort kommentaren', e.message);
    }
  }

  // Kommentarsdelen har fyra lägen: laddar, fel, tom eller lista.
  function renderComments() {
    if (isLoadingComments) {
      return <ActivityIndicator color={colors.primary} />;
    }
    if (commentsError) {
      return (
        <View style={styles.commentsError}>
          <ErrorMessage message="Kunde inte hämta kommentarerna." />
          <PrimaryButton title="Försök igen" variant="secondary" onPress={loadComments} />
        </View>
      );
    }
    if (comments.length === 0) {
      return <Text style={styles.empty}>Inga kommentarer än.</Text>;
    }
    return (
      <View style={styles.comments}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={user?.id === comment.author.id ? () => confirmDeleteComment(comment) : undefined}
          />
        ))}
      </View>
    );
  }

  if (isLoadingPost) {
    return (
      <View style={styles.screen}>
        <LoadingView message="Hämtar inlägget..." />
      </View>
    );
  }

  if (errorPost) {
    // 404: inlägget finns inte, t.ex. för att någon tagit bort det.
    const notFound = errorPost.status === 404;
    return (
      <View style={styles.screen}>
        <ErrorView
          title={notFound ? 'Inlägget finns inte' : 'Inlägget gick inte att hämta'}
          message={notFound ? 'Det kan ha tagits bort.' : errorPost.message}
          onRetry={notFound ? undefined : loadPost}
        />
      </View>
    );
  }

  const isEdited = post.updatedAt !== post.createdAt;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.category}>{post.category.name}</Text>
      <Text style={styles.title} accessibilityRole="header">{post.title}</Text>
      <AuthorInfo
        author={post.author}
        subtitle={`${formatRelativeDate(post.createdAt)}${isEdited ? ' · redigerad' : ''}${isOwner ? ' · ditt inlägg' : ''}`}
      />

      {post.price != null || post.location ? (
        <View style={styles.details}>
          {post.price != null ? <Text style={styles.price}>{formatPrice(post.price)}</Text> : null}
          {post.location ? <Text style={styles.location}>{post.location}</Text> : null}
        </View>
      ) : null}

      <Divider/>

      <Text style={styles.body}>{post.body}</Text>

       <Divider/>

      <View style={styles.actions}>
        <PrimaryButton title="Dela inlägget" variant="secondary" onPress={handleShare} />
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Kommentarer{isLoadingComments ? '' : ` (${comments.length})`}
      </Text>

      {renderComments()}

      {isLoggedIn ? (
        <CommentForm onSubmit={handleAddComment} />
      ) : (
        <PrimaryButton
          title="Logga in för att kommentera"
          variant="secondary"
          onPress={() => navigation.navigate('ProfileTab')}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    padding: 16,
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSpinner: {
    width: 44,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  location: {
    fontSize: 15,
    color: colors.textMuted,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  actions: {
    gap: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  comments: {
    gap: 8,
  },
  commentsError: {
    gap: 8,
  },
  empty: {
    fontSize: 15,
    color: colors.textMuted,
  },
});