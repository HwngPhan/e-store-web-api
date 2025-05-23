const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const { User } = require("../models/user");
const { putOrderItem } = require("./orderItems");
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort("dateOrdered");
  // .sort({"dateOrdered":-1}); //in case you want to sort by descending order

  if (!orderList) {
    res.status(500).json({
      success: false,
    });
  }

  res.send(orderList);
});
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(order);
});

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
        // orderId: orderItemsIds,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrice = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      return orderItem.product.price * orderItem.quantity;
    })
  );

  const totalPriceResolved = totalPrice.reduce((a, b) => a + b, 0);

  if (!orderItemsIdsResolved) {
    return res.status(400).send("Invalid order items");
  }

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    customerName: req.body.customerName,
    email: req.body.email,
    province: req.body.province,
    commune: req.body.commune,
    address: req.body.address,
    phone: req.body.phone,
    totalPrice: totalPriceResolved,
    status: req.body.status,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) {
    return res.status(500).send("The order cannot be created");
  }
  const orderId = order._id.toHexString();
  // Update orderId in orderItems

  const orderItemResolve = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findByIdAndUpdate(orderItemId, {
        orderId: orderId,
      });
      if (!orderItem) {
        return res.status(500).send("The order item cannot be updated");
      }
    })
  );
  res.send(order);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("the order cannot be update!");

  res.send(order);
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
});

router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

router.post(`/email/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(400).send("The order cannot be found");
  }

  const user = await User.findById(order.user);
  if (!user) {
    return res.status(400).send("Invalid user");
  }
  // Send email notification
  const userEmail = user.email;
  if (userEmail) {
    const mailOptions = {
      from: "phanphuochung.07022004@gmail.com",
      to: userEmail,
      subject: "Order Confirmation",
      html: `
          <h3>Thank you for your order!</h3>
          <p>Your order ID: <b>${order._id}</b></p>
          <p>Total Price: $${order.totalPrice}</p>
          <p>Status: ${order.status}</p>
          <p>Shipping to: ${order.shippingAddress1}, ${order.city}</p>
        `,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "rocio.wintheiser85@ethereal.email",
        pass: "AT5QFwqvrKreSsG92f",
      },
    });

    (async () => {
      const info = await transporter.sendMail(mailOptions);

      console.log("Message sent:", info.messageId);
    })();
    res.status(200).json({
      success: true,
      message: "Order confirmation email sent",
    });
  }
});
module.exports = router;
