const app = require('./app');
const config = require('./config/config');
const {connectDB} = require('./config/db');

const PORT = config.port || 4001;

// Connect to the database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
