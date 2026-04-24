const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bfhlRoutes = require('./src/routes/bfhlRoutes');
const { errorHandler } = require('./src/middlewares/errorMiddleware');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/bfhl', bfhlRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
