import { useState } from "react"
import { createComment } from "../services/createComment"

export function CommentForm({ postId, parentID = null }) {
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            await createComment({ postId, message, parentID })
            setMessage("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("CommentForm component rendered with postId:", postId);
    }, [postId]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="comment-form-row">
                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Add a comment"
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Post"}
                </button>
            </div>
            {error && <div className="error-msg">{error}</div>}
        </form>
    )
}

export default CommentForm;