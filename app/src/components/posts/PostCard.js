import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { formatPrice, formatRelativeDate } from '../../utils/format';
import { imageUri } from '../../api/client';

export default function PostCard({ post, onPress }) {
  const posterData = `${post.author.username} · ${formatRelativeDate(post.createdAt)}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${post.title}. ${post.category.name}. Av ${posterData}`}
      accessibilityHint="Öppnar inlägget"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={styles.category}>{post.category.name}</Text>
          <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
          {post.price != null ? <Text style={styles.price}>{formatPrice(post.price)}</Text> : null}
          <Text style={styles.body} numberOfLines={2}>{post.body}</Text>

          <Text style={styles.posterData}>
            {posterData}
            {post.location ? ` · ${post.location}` : ''}
          </Text>
        </View>

        {post.imageUrl ? (
          <Image
            source={{ uri: imageUri(post.imageUrl) }}
            style={styles.thumbnail}
            accessibilityIgnoresInvertColors
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    color: colors.textMuted,
  },
  posterData: {
    fontSize: 13,
    color: colors.textMuted,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.divider,
  },
});