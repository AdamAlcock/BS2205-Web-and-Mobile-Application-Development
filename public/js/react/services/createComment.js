export function createComment({ postId, message, parentID }) {
    return makeRequest(`post/${postId}/comments`, {
        method: 'POST',
        data: { message, parentID}
    })
}