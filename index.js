const express = require("express");
const app = express();
require('dotenv').config();
let port = process.env.SERVER_PORT;
const artRoutes = require('./routes/artRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

swaggerDocument.host = `http://localhost:${process.env.SERVER_PORT}`;

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
);

app.use('/api/art', artRoutes);
app.use('/api/users', userRoutes);
//404 page
app.use((req, res) => {
    res.status(404);
    return res.json({msg : 'No API found'});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port} `);
})

module.exports = app;