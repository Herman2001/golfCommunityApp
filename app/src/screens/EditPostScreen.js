import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { fetchPost, updatePost } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import FormContainer from '../components/form/FormContainer';
import PostForm from '../components/posts/PostForm';
import ErrorView from '../components/ui/ErrorView';
import LoadingView from '../components/ui/LoadingView';
import { colors } from '../constants/colors';

export default function EditPostScreen({ route, navigation }) {
  const { postId } = route.params;
  const { user } = useAuth();
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();

  const [post, setPost] = useState(null);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);

  const loadPost = useCallback(async () => {
    setIsLoadingPost(true);
    setPostError(null);
    try {
      setPost(await fetchPost(postId));
    } catch (e) {
      setPostError(e.message);
    } finally {
      setIsLoadingPost(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  async function handleUpdate(payload) {
    await updatePost(postId, payload);
    Alert.alert('Ändringarna är sparade');
    // Detaljvyn hämtar om inlägget när den visas igen.
    navigation.goBack();
  }

  function renderContent() {
    if (isLoadingPost || isLoadingCategories) {
      return <LoadingView message="Hämtar inlägget..." />;
    }
    if (postError) {
      return <ErrorView title="Kunde inte hämta inlägget" message={postError} onRetry={loadPost} />;
    }
    if (categoriesError) {
      return (
        <ErrorView title="Kunde inte hämta kategorierna" message={categoriesError} onRetry={reloadCategories} />
      );
    }
    // Knappen visas bara för den som skapr inläddet, men skärmen kontrollerar ändå. Backenden svarar 403 i vilket fall.
    if (post.author.id !== user?.id) {
      return (
        <ErrorView
          title="Du kan inte redigera det här inlägget"
          message="Du kan bara redigera dina egna inlägg."
        />
      );
    }
    return null;
  }

  const content = renderContent();
  if (content) {
    return <View style={styles.screen}>{content}</View>;
  }

  return (
    <FormContainer>
      <PostForm
        categories={categories}
        initialValues={{
          title: post.title,
          body: post.body,
          categorySlug: post.category.slug,
          price: post.price,
          location: post.location,
          imageUrl: post.imageUrl,
        }}
        submitLabel="Spara ändringar"
        onSubmit={handleUpdate}
      />
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});