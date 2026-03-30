import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
dotenv.config();
import colors from 'colors';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
const port = process.env.PORT || 5000;

connectDB();

const app = express();
//Body parser middleware
app.use(express.json());
app.use(express.urlencoded());

//Cookie parser middleware
app.use(cookieParser());



app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload',uploadRoutes)

app.get('/api/config/paypal', (req, res) => res.send({
  clientId: process.env.PAYPAL_CLIENT_ID
}));

// const __dirname = path.resolve();//Set __dirname to current directory
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

   app.get(/.*/, (req, res) =>
     res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
   );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on ${port}`.bgCyan));
