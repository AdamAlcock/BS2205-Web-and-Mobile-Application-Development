import React, { useEffect, useState, useCallback } from 'react';
import Axios from 'axios';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';

const App = () => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    console.log('Post ID:', postId);
    setPostId(postId);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await Axios.get(`http://localhost:5000/getComments/${postId}`);
      console.log('Data fetched:', response.data);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchData();
    }
  }, [postId, fetchData]);

  const addComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };


  return (
    <div>
      <CommentForm postId={postId} addComment={addComment} />
      <CommentList comments={comments} postId={postId} />
    </div>
  );
}

export default App;