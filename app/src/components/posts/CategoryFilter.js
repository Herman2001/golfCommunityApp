import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';

/**
 * Vågrät rad med kategorier att filtrera på. selected är kategorins slug, eller null för "Alla".
 */
export default function CategoryFilter({ categories, selected, onSelect, showAll = true }) {
  const options = showAll ? [{ slug: null, name: 'Alla' }, ...categories] : categories;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((category) => {
        const isSelected = category.slug === selected;
        return (
          <Pressable
            key={category.slug ?? 'all'}
            onPress={() => onSelect(category.slug)}
            accessibilityRole="button"
            accessibilityLabel={`${category.name}`}
            accessibilityState={{ selected: isSelected }}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 15,
    color: colors.text,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});