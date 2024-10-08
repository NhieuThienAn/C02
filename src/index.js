import express from 'express';
import { connectToDatabase } from './configDatabase.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { engine } from 'express-handlebars';

import blogRepository from "./utils/blogRepository.js";
import { saveMessage } from "./utils/blogRepository.js";
import { getPostById } from "./utils/blogRepository.js";
const app = express();
const PORT = process.env.PORT || 3000;

const db = await connectToDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayout: 'main',
    })
);

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    const posts = await blogRepository();
    res.render('home', {
        cssLink: '/assets/css/style-starter.css',
        title: 'Home',
        posts: posts,
    });
});


app.get('/home', async (req, res) => {
    const posts = await blogRepository();
    res.render('home', {
        title: 'Home',
        posts: posts,
    });
});


app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

app.post('/contact', async (req, res) => {
    const { w3lName, w3lSender, w3lSubect, w3lMessage } = req.body;

    if (w3lName.length <= 3 || w3lSubect.length <= 5) {
        return res.status(400).send('Error');
    }

    await saveMessage(w3lName, w3lSubect, w3lMessage);

});

app.get('/detailPost/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await getPostById(postId);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('detailPost', {
        title: post.title,
        image: post.image,
        description: post.description,
        content: post.content,
        author: post.author,
        createdDate: post.createdDate,
    });
});

app.get('/culture', (req, res) => {
    res.render('culture', { title: 'Culture' });
});

app.get('/lifestyle', (req, res) => {
    res.render('lifestyle', { title: 'Lifestyle' });
});


app.listen(PORT, () => {
    console.log(`localhost:${PORT}`);
});