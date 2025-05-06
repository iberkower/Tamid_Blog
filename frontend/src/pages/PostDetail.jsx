import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, deletePost } from '../services/api';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const data = await getPost(id);
            setPost(data);
            setError('');
        } catch (error) {
            setError('Failed to fetch post');
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                navigate('/');
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Failed to delete post';
                setError(errorMessage);
                console.error('Error deleting post:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
                <Link to="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    Post not found
                </div>
                <Link to="/" className="btn btn-primary">
                    Back to Home
                </Link>
            </div>
        );
    }

    const isAuthor = isAuthenticated && post.authorId._id === localStorage.getItem('userId');

    return (
        <div className="container-fluid px-0">
            {/* Post Header */}
            <div className="bg-light py-5 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h1 className="display-4 fw-bold mb-3">{post.title}</h1>
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-3">
                                    <i className="bi bi-person-circle fs-4"></i>
                                </div>
                                <div>
                                    <p className="mb-0 fw-bold">{post.authorId.name}</p>
                                    <p className="text-muted mb-0">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <span key={tag} className="badge bg-light text-dark border">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 p-md-5">
                                <div className="post-content">
                                    <div dangerouslySetInnerHTML={{ __html: post.body }} />
                                </div>
                            </div>
                        </div>

                        {/* Author Actions */}
                        {isAuthor && (
                            <div className="d-flex gap-2 mt-4">
                                <Link
                                    to={`/edit/${post._id}`}
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-pencil me-2"></i>
                                    Edit Post
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-danger"
                                >
                                    <i className="bi bi-trash me-2"></i>
                                    Delete Post
                                </button>
                            </div>
                        )}

                        {/* Back Button */}
                        <div className="mt-4">
                            <Link to="/" className="btn btn-outline-secondary">
                                <i className="bi bi-arrow-left me-2"></i>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail; 