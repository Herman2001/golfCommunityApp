import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../ui/Avatar';
import { colors } from '../../constants/colors';

/**
 * Visar vem som skrivit något: avatar, användarnamn och en valfri undertext.
 */
export default function AuthorInfo({ author, subtitle }) {
  return (
    <View style={styles.row}>
      <Avatar name={author.username} size={40} />
      <View style={styles.text}>
        <Text style={styles.name}>{author.username}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});