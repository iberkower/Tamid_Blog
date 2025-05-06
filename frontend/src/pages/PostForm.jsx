import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, getPost, updatePost } from '../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        tags: '',
        isPublic: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'align',
        'link', 'image'
    ];

    useEffect(() => {
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const post = await getPost(id);
            setFormData({
                title: post.title,
                body: post.body,
                tags: post.tags.join(', '),
                isPublic: post.isPublic
            });
        } catch (error) {
            setError('Failed to fetch post');
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleEditorChange = (content) => {
        setFormData({
            ...formData,
            body: content
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            if (isEditing) {
                await updatePost(id, postData);
            } else {
                await createPost(postData);
            }

            navigate('/');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to save post');
            console.error('Error saving post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">
                                {isEditing ? 'Edit Post' : 'Create New Post'}
                            </h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter post title"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="body" className="form-label">Content</label>
                                    <ReactQuill
                                        value={formData.body}
                                        onChange={handleEditorChange}
                                        modules={modules}
                                        formats={formats}
                                        style={{ height: '300px', marginBottom: '50px' }}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="tags" className="form-label">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="e.g., technology, programming, web"
                                    />
                                </div>
                                <div className="mb-4 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isPublic"
                                        name="isPublic"
                                        checked={formData.isPublic}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="isPublic">
                                        Make this post public
                                    </label>
                                </div>
                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary py-2"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary py-2"
                                        onClick={() => navigate('/')}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostForm; 