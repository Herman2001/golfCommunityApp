import { File } from 'expo-file-system';
import { apiRequest } from './client';

export function uploadImage(asset) {
  const formData = new FormData();
  formData.append('image', new File(asset.uri));
  return apiRequest('/api/images', { method: 'POST', body: formData });
}