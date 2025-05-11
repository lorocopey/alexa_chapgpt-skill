const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;


app.use(morgan('dev'));

app.use('/', require('./routes/routes'));

app.listen(port, async() => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
    console.log('Server started');
})