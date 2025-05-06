const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// Create post
router.post('/', auth, [
    body('title').trim().notEmpty(),
    body('body').trim().notEmpty(),
    body('tags').optional().isArray(),
    body('isPublic').optional().isBoolean()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = new Post({
            ...req.body,
            authorId: req.user._id
        });

        await post.save();
        const populatedPost = await Post.findById(post._id).populate('authorId', 'email name');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get posts with filters
router.get('/', async (req, res) => {
    try {
        const { tag, author, title, includePrivate } = req.query;
        const query = {};

        // Build the query for text search
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        // Handle tag filter
        if (tag) {
            query.tags = { $regex: tag, $options: 'i' };
        }

        // Handle author filter (search by name)
        if (author) {
            const authorRegex = new RegExp(author, 'i');
            const users = await User.find({ name: authorRegex });
            const authorIds = users.map(user => user._id);
            query.authorId = { $in: authorIds };
        }

        // Handle public/private posts
        if (req.user && includePrivate === 'true') {
            // Show public posts and user's private posts
            query.$or = [
                { isPublic: true },
                { authorId: req.user._id }
            ];
        } else {
            // Only show public posts
            query.isPublic = true;
        }

        const posts = await Post.find(query)
            .populate('authorId', 'email name')
            .sort({ createdAt: -1 });

        console.log('Posts being sent:', JSON.stringify(posts, null, 2));
        res.json(posts);
    } catch (error) {
        console.error('Error in GET /posts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('authorId', 'email name');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (!post.isPublic && (!req.user || post.authorId._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update post
router.put('/:id', auth, [
    body('title').optional().trim().notEmpty(),
    body('body').optional().trim().notEmpty(),
    body('tags').optional().isArray(),
    body('isPublic').optional().isBoolean()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        Object.assign(post, req.body);
        await post.save();

        const updatedPost = await Post.findById(post._id).populate('authorId', 'email name');
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.authorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 