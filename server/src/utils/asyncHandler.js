// First way to handle 
// const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((error) =>
//       next(error),
//     );
//   };
// };

// export { asyncHandler };


// Second way to handle
const asyncHandler = (fx) => async (req, res, next) => {
  try {
    await fx(req, res, next);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };

