import React from 'react';

const CommentList = ({ comments, postId }) => {
  const filteredComments = comments.filter(comment => comment.postId === postId);
  console.log('Filtered Comments:', filteredComments); 

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {filteredComments.map((comment, index) => (
          <li key={index}>
            <p>{comment.message}</p>
            <small>{comment.user ? comment.user.username : 'Anonymous'}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;