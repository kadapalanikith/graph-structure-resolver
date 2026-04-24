const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./routes/bfhlRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// allow requests from any origin — needed since the evaluator calls this from a different domain
app.use(cors());
app.use(express.json());

app.use('/bfhl', bfhlRoutes);

// catch-all error handler goes last
app.use(errorHandler);

module.exports = app;
