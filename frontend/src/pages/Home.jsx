import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';
import { debounce } from 'lodash';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        tag: '',
        author: '',
        title: ''
    });
    const [inputValues, setInputValues] = useState({
        tag: '',
        author: '',
        title: ''
    });

    const isAuthenticated = !!localStorage.getItem('token');

    const fetchPosts = useCallback(async (currentFilters) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const data = await getPosts({
                ...currentFilters,
                includePrivate: !!token
            });
            console.log('Posts data:', data);
            setPosts(data);
            setError('');
        } catch (error) {
            setError('Failed to fetch posts');
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create a stable debounced version of fetchPosts
    const debouncedFetchPosts = useMemo(
        () => debounce((filters) => fetchPosts(filters), 300),
        [fetchPosts]
    );

    // Cleanup the debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedFetchPosts.cancel();
        };
    }, [debouncedFetchPosts]);

    // Effect to fetch posts when filters change
    useEffect(() => {
        fetchPosts(filters);
    }, [filters, fetchPosts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const { name, value } = e.target;
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const stripHtml = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
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

    return (
        <div className="container-fluid px-0">
            {/* Hero Section */}
            <div className="bg-primary text-white py-5 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 mx-auto text-center">
                            <h1 className="display-4 fw-bold mb-3">Welcome to Our Blog</h1>
                            <p className="lead">Discover stories, thinking, and expertise from writers on any topic.</p>
                            {!isAuthenticated && (
                                <div className="mt-4">
                                    <p className="mb-3">Want to share your own stories?</p>
                                    <Link to="/signup" className="btn btn-light btn-lg me-3">
                                        Create Account
                                    </Link>
                                    <Link to="/login" className="btn btn-outline-light btn-lg">
                                        Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Search and Filter Section */}
                <div className="row mb-5">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by title (press Enter)"
                                name="title"
                                value={inputValues.title}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="bi bi-tag"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Filter by tag (press Enter)"
                                name="tag"
                                value={inputValues.tag}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-light">
                                <i className="bi bi-person"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Filter by author (press Enter)"
                                name="author"
                                value={inputValues.author}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Blog Posts Grid */}
                <div className="row g-4">
                    {posts.map((post) => (
                        <div key={post._id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm hover-shadow">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">
                                            <Link to={`/posts/${post._id}`} className="text-decoration-none text-dark">
                                                {post.title}
                                            </Link>
                                        </h5>
                                        {!post.isPublic && (
                                            <span className="badge bg-warning">Private</span>
                                        )}
                                    </div>
                                    <h6 className="card-subtitle mb-3 text-muted">
                                        By {post.authorId.name}
                                    </h6>
                                    <p className="card-text text-muted">
                                        {stripHtml(post.body).substring(0, 150)}...
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="badge bg-light text-dark border"
                                                onClick={() => setFilters(prev => ({ ...prev, tag }))}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="card-footer bg-white border-top-0">
                                    <small className="text-muted">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {posts.length === 0 && !loading && (
                    <div className="text-center mt-5 py-5">
                        <h3 className="text-muted">No posts found</h3>
                        <p className="text-muted">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home; 