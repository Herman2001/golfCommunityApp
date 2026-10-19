import { apiRequest } from './client';

export function fetchComments(postId) {
    return apiRequest(`/api/posts/${postId}/comments`);
}

export function createComment(postId, comment) {
    return apiRequest(`/api/posts/${postId}/comments`, { method: 'POST', body: comment });
}

export function deleteComment(commentId) {
    return apiRequest(`/api/comments/${commentId}`, { method: 'DELETE' });
}