import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAsync } from '../hooks/useAsync'
import { getComments } from '../services/comments'
import { Comment } from './Comment'


// export function CommentList() {
//     const { loading, error, value: comments } = useAsync(getComments)

//     if (loading) {
//         return <p>Loading...</p>
//     }

//     if (error) {
//         return <p>Error: {error.message}</p>
//     }

//     return comments.map(comment => {
//         return (
//             <h1 key={comment.id}>
//                 <Link to={`/comments/${comment.id}`}>{comment.title}</Link>
//             </h1>
//         )
//     })
// }



export function CommentList() {

    //log function calling
    console.log("CommentList component called");

    const { loading, error, value: comments } = useAsync(getComments)
    
    useEffect(() => {
        console.log("CommentList component rendered");
    }, []);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error: {error.message}</p>
    }


    return comments.map(comment => (
        <div key={comment.id}>
            <Comment {...comment} />
        </div>
    ))
}


export default CommentList;