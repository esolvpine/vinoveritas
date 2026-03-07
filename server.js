require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const requestIp = require('request-ip');

const app = express();
const viewsPath = path.join(__dirname, 'public/views');

app.set('trust proxy', true);
app.use(requestIp.mw());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/wines', require('./routes/wines'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api', require('./routes/lookups'));
app.use('/api/file', require('./routes/files'));

// Page routes
app.get('/', (_, res) => res.sendFile(path.join(viewsPath, 'index.html')));
app.get('/details', (_, res) => res.sendFile(path.join(viewsPath, 'details.html')));
app.get('/cellar', (_, res) => res.sendFile(path.join(viewsPath, 'cellar.html')));
app.get('/activities', (_, res) => res.sendFile(path.join(viewsPath, 'activities.html')));

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`Listening on port ${port}`));
