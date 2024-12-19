import React, { useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { getComment } from '../services/comments'

const Context = React.createContext()

export function useComment() {
    console.log("useComment called");
    return useContext(Context)
}

export function CommentProvider({ children }) {

    const { id } = useParams()
    console.log("CommentProvider: useParams id:", id);

    const { loading, error, value: comment } = useAsync(() => getComment(id), [id])
    console.log("CommentProvider: useAsync loading:", loading, "error:", error, "comment:", comment);

    const commentsByParentId = useMemo(() => {

        const group = {}

        if (Array.isArray(comment)) {
            comment.forEach(comment => {
                group[comment.parentID] ||= []
                group[comment.parentID].push(comment)
            })
        }
        console.log("CommentProvider: commentsByParentId:", group);

        return group
    }, [comment]);

    useEffect(() => {
        console.log("CommentProvider rendered with comment:", comment);
    }, [comment]);

    if (loading) {
        console.log("CommentProvider: Loading...");
        return <p>Loading...</p>;
    }

    if (error) {
        console.log("CommentProvider: Error:", error);
        return <p>Error: {error.message}</p>;
    }

    return <Context.Provider 
    value={{
        comment: { id, ...comment },
        commentsByParentId
    }}>

        {loading ? <h1>Loading...</h1> : error ? <h1>Error: {error}</h1> : children}

    </Context.Provider>

}