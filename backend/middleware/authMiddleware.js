import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';


// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  // console.log('Incoming Cookie header:', req.headers.cookie);
  // console.log('Parsed cookies:', req.cookies);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };



// const protect = asyncHandler(async (req, res, next) => {
//   console.log('---- PROTECT MIDDLEWARE START ----');

//   let token;

//   token = req.cookies.jwt;
//   console.log('Token from cookie:', token);

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('Decoded token:', decoded);

//       req.user = await User.findById(decoded.userId).select('-password');
//       console.log('User from DB:', req.user);

//       console.log('---- PROTECT PASSED ----');
//       next();
//     } catch (error) {
//       console.log('Token verification failed:', error.message);
//       res.status(401);
//       throw new Error('Not authorized, token failed');
//     }
//   } else {
//     console.log('No token found');
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });
