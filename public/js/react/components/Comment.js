import { useEffect } from "react";
import { useComment } from "../contexts/CommentContext";

// export function Comment() {
//     const { comment } = useComment()

//     return <>
//         <section>
//             {comments.comment}
//         </section>
//     </>
// }


const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
})


export function Comment({ id, message, user, createdAt }) {

    useEffect(() => {
        console.log("Comment component rendered with props:", props);
    }, [props]);

    return <>
        <div className="comment">

            <div className="header">
                <span className="name">{user.name}</span>
                <span className="date">{dateFormatter.format(Date.parse(createdAt))}</span>
            </div>
            <div className="message"> {message} </div>

        </div>
    </>
}


export default Comment;