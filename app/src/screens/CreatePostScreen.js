import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { createPost } from '../api/posts';
import { useCategories } from '../hooks/useCategories';
import FormContainer from '../components/form/FormContainer';
import PostForm from '../components/posts/PostForm';
import ErrorView from '../components/ui/ErrorView';
import LoadingView from '../components/ui/LoadingView';
import { colors } from '../constants/colors';


export default function CreatePostScreen({ navigation }) {
  const { categories, isLoading, error, reload } = useCategories();

  const [formKey, setFormKey] = useState(0);

  async function handleCreate(payload) {
    const created = await createPost(payload);
    setFormKey((current) => current + 1);
    Alert.alert('Inlägget är publicerat');
    navigation.navigate('FeedTab', {screen: 'PostDetail', params: {postId: created.id}});
  }
    if (isLoading) {
      return (
        <View style={styles.screen}>
          <LoadingView message="Laddar formulär..."/>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.screen}>
          <ErrorView title="Kunde inte hämta kategorierna" message={error} onRetry={reload}/>
        </View>
      );
    }

    return (
      <FormContainer>
        <Text style={styles.intro}>
          Ställ en fråga, säljs något eller hitta någon att spela med.
        </Text>
        <PostForm
          key={formKey}
          categories={categories}
          submitLabel="Publicera"
          onSubmit={handleCreate}
        />
      </FormContainer>
    );
  }

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    intro: {
      fontSize: 15,
      color: colors.textMuted,
    },
  });
