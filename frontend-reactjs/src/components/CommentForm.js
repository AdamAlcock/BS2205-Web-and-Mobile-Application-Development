import React, { useState } from 'react';
import Axios from 'axios';

const CommentForm = ({ postId, addComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post('http://localhost:5000/addComment', 
        { postId, message: comment }
      );
      setComment('');
      addComment(response.data.comment); // Add the new comment to the state
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <h1>Comment Form</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CommentForm;