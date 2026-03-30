import Product from '../models/productModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

//@Desc Fetch All Products
//@Route GET/api/products
//@Access public

export const getProducts = asyncHandler(async (req, res) => {
  // throw new Error("Some Error");
    const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  // const products = await Product.find({});
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// export const getProducts = asyncHandler(async (req, res) => {
//   const pageSize = 8;
//   const page = Number(req.query.pageNumber) || 1;

//   const keyword = await req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};

//   const count = await Product.countDocuments({...keyword});

//   const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));

//   res.json({
//     products,
//     page,
//     pages: Math.ceil(count / pageSize),
//   });
// });

//@Desc Fetch a Product
//@Route GET/api/products
//@Access public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('ID Resource not found');
  }
});
//@Desc Create Product
//@Route POST/api/products
//@Access private/admin
export const createProduct = asyncHandler(async (req, res) => {
  const products = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 12,
    description: 'Sample description',
  });
  const createdProduct = await products.save();

  res.status(201).json(createdProduct);
});

//@Desc Update Product
//@Route PUT/api/products/:id
//@Access private/admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name=name;
    product.price=price;
    product.description=description;
    product.image=image;
    product.brand=brand;
    product.category=category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }

 });


//@Desc Delete Product
//@Route DELETE/api/products/:id
//@Access private/admin
export const deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);
  if (product) {

    await Product.deleteOne({ _id: product._id });

   res.status(200).json({message:'Product deleted'})
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }

 });


//@Desc Create a new Review
//@Route POST/api/products/:id
//@Access private
export const createProductReview
 = asyncHandler(async (req, res) => {

   const { rating, comment } = req.body;

   const product = await Product.findById(req.params.id);
  if (product) {

    const alreadyReviewed = product.reviews.find((review)=>review.user.toString()===req.user._id.toString());

    if(alreadyReviewed){
      res.status(400);
      throw new Error('Product already reviewed');
    }
    const review = {
      name:req.user.name,
      rating:Number(rating),
      comment,
      user:req.user._id
    };
    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });

  } else {
    res.status(404);
    throw new Error('Resource not found');
  }

 });


//@Desc Get top rated Products
//@Route GET/api/products/top
//@Access public
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({rating:-1}).limit(3);
  res.status(200).json(products);
});

