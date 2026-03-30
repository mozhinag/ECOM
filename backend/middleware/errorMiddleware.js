//  const notFound = () => {
//   const error = new Error(`Not Found -${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };
//  const errorHandler = (err, res, req, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;

//   //check for Mongoose bad Object ID

//   if (err.name === 'CastError' && err.kind === 'ObjectId') {
//     message = 'Resource Not Found';
//     statusCode = 404;
//   }
//   res.status(statusCode).json({
//     message: message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   });
// };


const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not Foundd';
    statusCode = 404;
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
