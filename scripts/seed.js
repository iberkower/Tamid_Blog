require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const User = require('../backend/src/models/User');
const Post = require('../backend/src/models/Post');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});

        // Create test users
        const user1 = await User.create({
            name: 'Test User 1',
            email: 'test1@example.com',
            passwordHash: 'password123'
        });

        const user2 = await User.create({
            name: 'Test User 2',
            email: 'test2@example.com',
            passwordHash: 'password123'
        });

        // Create test posts
        await Post.create([
            {
                authorId: user1._id,
                title: 'First Post',
                body: 'This is the first test post',
                tags: ['test', 'first'],
                isPublic: true
            },
            {
                authorId: user1._id,
                title: 'Private Post',
                body: 'This is a private test post',
                tags: ['test', 'private'],
                isPublic: false
            },
            {
                authorId: user2._id,
                title: 'Second User Post',
                body: 'This is a post from the second user',
                tags: ['test', 'second'],
                isPublic: true
            }
        ]);

        console.log('Seed data created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed(); 