import Order from '../models/orderModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

//@Desc Create new order
//@Route post/api/orders
//@Access public
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});
//@Desc Get logged in user orders
//@Route post/api/orders/myorders
//@Access private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

//@Desc Get order by ID
//@Route post/api/orders/:id
//@Access private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new 'Order not found'();
  }
});

//@Desc Update order to paid
//@Route post/api/orders/:id/pay
//@Access private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_item: req.body.update_item,
      email_address: req.body.payer.email_address,

    };
    const updateOrder = await order.save();
    res.status(200).json(updateOrder);

  }
});

//Desc Update order to delivered
//@Route post/api/orders/:id/deliver
//@Access private/admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt=Date.now();
    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//@Desc Get all orders
//@Route post/api/orders
//@Access private/admin
export const getOrders = asyncHandler(async (req, res) => {
const orders = await Order.find({}).populate('user', 'id name');
res.status(200).json(orders);
});
