import { StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';

/**
 * Tunt grått sträck / divider som avgränsat inehåll för att göra det tydligare för användaren.
 * Spacing: Avstånden ovanför och under sträcket.
 */
export default function Divider ({spacing = 16}) {
	return (
		<View 
			style={[styles.divider, {marginVertical: spacing}]}
			accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
			/>
	);
}

const styles = StyleSheet.create({
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: colors.divider,
	},
});