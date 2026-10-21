import { apiRequest } from './client';

/**
 * Bygger t.ex. "category=fragor&page=0" och hoppar över tomma värden.
 * 
 * encodeURIComponent gör som tekcne som inte får finnas i en URL t.ex 
 * & som hade blivit början på en ny parameter i t.ex köp&sälj.
 */
function toQueryString(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export function fetchPosts({ category, query, sort, page = 0, size = 20 } = {}) {
  const queryString = toQueryString({ category, q: query, sort, page, size });
  return apiRequest(`/api/posts?${queryString}`);
}

export function fetchPost(id) {
  return apiRequest(`/api/posts/${id}`);
}

export function createPost(post) {
  return apiRequest('/api/posts', { method: 'POST', body: post });
}

export function updatePost(id, post) {
  return apiRequest(`/api/posts/${id}`, { method: 'PUT', body: post });
}

export function deletePost(id) {
  return apiRequest(`/api/posts/${id}`, { method: 'DELETE' });
}

// För att hämta inlägg kopplat till den inloggade användaren. Används på profilsidan.
export function fetchMyPosts({page = 0, size = 50} = {} ) {
  return apiRequest(`/api/users/me/posts?page=${page}&size=${size}`);
}