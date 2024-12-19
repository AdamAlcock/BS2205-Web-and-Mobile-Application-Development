import { makeRequest } from './makeRequest';

export async function getComments() {
    console.log("getComments called");
    try {
        const data = await makeRequest('/post/:postId/comments');
        console.log("getComments success", data);
        return data;
    } catch (error) {
        console.log("getComments error", error);
        throw error;
    }
}

export async function getComment(id) {
    console.log("getComment called with id:", id);
    try {
        const data = await makeRequest(`/post/:postId/comments/${id}`);
        console.log("getComment success", data);
        return data;
    } catch (error) {
        console.log("getComment error", error);
        throw error;
    }
}