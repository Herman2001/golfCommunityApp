import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { formatRelativeDate } from '../../utils/format';

export default function CommentItem({ comment, onDelete, isPostAuthor = false }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <Text style={styles.meta}>{comment.author.username}</Text>
          <Text style={styles.meta}>· {formatRelativeDate(comment.createdAt)}</Text>
          {isPostAuthor ? <Text style={styles.badge}>Skapare</Text> : null}
        </View>
        {onDelete ? (
          <Pressable
            onPress={onDelete}
            accessibilityRole="button"
            accessibilityLabel="Ta bort kommentaren"
            hitSlop={12}
          >
            <Text style={styles.delete}>Ta bort</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.body}>{comment.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 4,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  badge: {
    fontSize: 8,
    fontWeight: '600',
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
  delete: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  body: {
    fontSize: 15,
    color: colors.text,
  },
});