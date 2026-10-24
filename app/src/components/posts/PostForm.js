import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormInput from '../form/FormInput';
import PrimaryButton from '../ui/PrimaryButton';
import ErrorMessage from '../ui/ErrorMessage';
import CategoryFilter from './CategoryFilter';
import { colors } from '../../constants/colors';
import ImagePickerField from './ImagePickerField';

const BUY_SELL_SLUG = 'kop-salj';

/**
 * Formulär för att skapa eller redigera ett inlägg.
 */
export default function PostForm({ categories, initialValues = {}, submitLabel, onSubmit,}) {
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [body, setBody] = useState(initialValues.body ?? '');
  const [categorySlug, setCategorySlug] = useState(initialValues.categorySlug ?? null);
  const [price, setPrice] = useState(initialValues.price != null ? String(initialValues.price) : '');
  const [location, setLocation] = useState(initialValues.location ?? '');

  // För bilder i posts
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // För att pris endast är relevant om det är köp / sälj inlägg.
  const isBuySell = categorySlug === BUY_SELL_SLUG;

  function validate() {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Ange en rubrik.';
    }
    if (!body.trim()) {
      errors.body = 'Skriv något i inlägget.';
    }
    if (!categorySlug) {
      errors.categoryId = 'Välj en kategori.';
    }
    if (isBuySell && price && !/^\d+$/.test(price)) {
      errors.price = 'Ange priset i hela kronor, t.ex 2500.';
    }
    return errors;
  }

  async function handleSubmit() {
    const errors = validate();
    setFieldErrors(errors);
    setErrorMessage(null);
    if (Object.keys(errors).length > 0) {
      return;
    }

    
    const category = categories.find((c) => c.slug === categorySlug);

    const payload = {
      title: title.trim(),
      body: body.trim(),
      categoryId: category.id,
      price: isBuySell && price ? Number(price) : null,
      location: location.trim() || null,
      imageUrl: imageUrl,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (e) {
      setErrorMessage(e.message);
      setFieldErrors(e.fieldErrors ?? {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <ErrorMessage message={errorMessage} />

      <ImagePickerField value={imageUrl} onChange={setImageUrl} onUploadingChange={setIsUploadingImage} />

      <FormInput
        label="Rubrik"
        value={title}
        onChangeText={setTitle}
        error={fieldErrors.title}
        placeholder="t.ex. Säljes: putter"
        maxLength={120}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Kategori</Text>
        <CategoryFilter
          categories={categories}
          selected={categorySlug}
          onSelect={setCategorySlug}
          showAll={false}
        />
        {fieldErrors.categoryId ? (
          <Text style={styles.error} accessibilityLiveRegion="polite">{fieldErrors.categoryId}</Text>
        ) : null}
      </View>

      <FormInput
        label="Text"
        value={body}
        onChangeText={setBody}
        error={fieldErrors.body}
        placeholder="Beskriv din fråga, det du säljer eller vem du söker att spela med."
        multiline
        textAlignVertical="top"
        maxLength={5000}
      />

      {isBuySell ? (
        <FormInput
          label="Pris (kr)"
          value={price}
          onChangeText={setPrice}
          error={fieldErrors.price}
          placeholder="t.ex. 2500"
          keyboardType="number-pad"
        />
      ) : null}

      <FormInput
        label="Plats (valfritt)"
        value={location}
        onChangeText={setLocation}
        error={fieldErrors.location}
        placeholder="t.ex. Stockholm eller din golfklubb"
        maxLength={100}
      />

<PrimaryButton title={submitLabel} onPress={handleSubmit} loading={isSubmitting || isUploadingImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  error: {
    fontSize: 14,
    color: colors.error,
  },
});