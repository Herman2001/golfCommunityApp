import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { formatRelativeDate } from '../../utils/format';

export default function CommentItem({ comment, onDelete }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.meta}>
          {comment.author.username} · {formatRelativeDate(comment.createdAt)}
        </Text>
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