import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { uploadImage } from '../../api/images';
import { imageUri } from '../../api/client';
import { colors } from '../../constants/colors';

const PICKER_OPTIONS = {
    mediaTypes:['images'],
    allwsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
};

export default function ImagePickerField({value, onChange, onUploadingChange}) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleResult(result) {
    if (result.canceled) return;

    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const { url } = await uploadImage(result.assets[0]);
      onChange(url);
    } catch (e) {
      Alert.alert('Kunde inte ladda upp bilden', e.message);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  }

  async function takePhoto() {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Kameran är inte tillåten', 'Du kan ge appen tillgång till kameran i inställningarna.', [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Öppna inställningar', onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    try {
      handleResult(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));
    } catch (error) {
      console.warn('Kameran kunde inte öppnas', error);
      Alert.alert('Kameran är inte tillgänglig');
    }
  }

  async function pickFromLibrary() {
    try {
      handleResult(await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));
    } catch (error) {
      console.warn('Kunde inte öppna galleriet', error);
      Alert.alert('Galleriet är inte tillgängligt');
    }
  }

  function showOptions() {
    Alert.alert('Lägg till bild', undefined, [
      { text: 'Ta foto', onPress: takePhoto },
      { text: 'Välj från galleriet', onPress: pickFromLibrary },
      { text: 'Avbryt', style: 'cancel' },
    ]);
  }

  if (isUploading) {
    return (
      <View style={[styles.box, styles.center]}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.hint}>Laddar upp bild...</Text>
      </View>
    );
  }

  if (value) {
    return (
      <View>
        <Image source={{ uri: imageUri(value) }} style={styles.box} accessibilityLabel="Vald bild" />
        <View style={styles.actions}>
          <Pressable onPress={showOptions} hitSlop={8}>
            <Text style={styles.action}>Byt bild</Text>
          </Pressable>
          <Pressable onPress={() => onChange(null)} hitSlop={8}>
            <Text style={[styles.action, styles.remove]}>Ta bort</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={showOptions}
      style={[styles.box, styles.center, styles.empty]}
      accessibilityRole="button"
      accessibilityLabel="Lägg till bild"
    >
      <Ionicons name="camera-outline" size={28} color={colors.primary} />
      <Text style={styles.hint}>Lägg till bild (valfritt)</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', aspectRatio: 4 / 3, borderRadius: 12, marginBottom: 16 },
  center: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary },
  hint: { color: colors.primary, fontSize: 15 },
  actions: { flexDirection: 'row', gap: 24, marginTop: -8, marginBottom: 16 },
  action: { color: colors.primary, fontWeight: '600' },
  remove: { color: '#C0392B' },
});