import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { formatPrice, formatRelativeDate } from '../../utils/format';

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
      <View style={styles.topRow}>
        <Text style={styles.category}>{post.category.name}</Text>
        {post.price != null ? <Text style={styles.price}>{formatPrice(post.price)}</Text> : null}
      </View>

      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.body} numberOfLines={2}>{post.body}</Text>

      <Text style={styles.posterData}>
        {posterData}
        {post.location ? ` · ${post.location}` : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});