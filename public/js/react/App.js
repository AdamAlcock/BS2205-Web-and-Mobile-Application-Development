import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CommentList } from './components/CommentList';
import { CommentProvider, useComment } from './contexts/CommentContext';
import { Comment } from './components/Comment';
import { CommentForm } from './components/CommentForm';

function CommentSection() {
    console.log("Comment Section function is called");

    const { comment } = useComment();
    const parentId = comment.parentId;

    useEffect(() => {
        console.log("Comment Section rendered with comment:", comment);
    }, [comment]);

    return (
        <>
            <CommentForm postId={parentId} />
            <Comment {...comment} />
        </>
    );
}

function App() {
    useEffect(() => {
        console.log("App component rendered");
    }, []);

    console.log("App component is rendering");

    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<CommentList />} />
                <Route path="/post/:postId/comments/:id" element={
                    <CommentProvider>
                        <CommentSection />
                    </CommentProvider>
                } />
            </Routes>
        </div>
    );
}

export default App;