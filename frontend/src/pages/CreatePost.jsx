import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postData = {
                title,
                content,
                author: localStorage.getItem('userName'),
                isPublic
            };
            await createPost(postData);
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to create post');
        }
    };

    return (
        <div>
            {/* Render your form here */}
        </div>
    );
};

export default CreatePost; 