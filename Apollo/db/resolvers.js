const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Clients");
const Order = require("../models/Order");
const Category = require("../models/Category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const createToken = (user, secret, expiresIn) => {
  //console.log(user);
  const { id, name, nachname, email } = user;

  return jwt.sign({ id, name, email, nachname }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    getUser: async (_, { },ctx) => {
     // const userId = await jwt.verify(token, process.env.SECRET);
      return ctx.user;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getCategories: async () => {
      try {
        const categories = await Category.find({});
        return categories;
      } catch (error) {
        console.log(error);
      }
    },
    getCategory: async (_, { id }) => {
      try {
        const category = await Category.findById(id);
        return category;
      } catch (error) {
        console.log(error);
      }
    },
    getCategoryByContext: async (_, { }, ctx) => {
      try {
        const category = await Category.findById(ctx.user.category);
        return category;
      } catch (error) {
        console.log(error);
      }
    },
    getCategoryByName: async (_, { name }) => {
      try {
        const category = await Category.findOne({ name: name });
        return category;
      } catch (error) {
        console.log(error);
      }
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      // If the client does not exist or the client is not the seller
      // if id is not the same as the id of the user
      const client = await Client.findById(id);

      if (!client) {
        throw new Error("Client not found");
      }
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("Not authorized");
      }

      return client;
    },
    getClientBySeller: async (_, {}, ctx) => {
      try {
        const client = await Client.find({ seller: ctx.user.id.toString() });
        return client;
      } catch (error) {
        console.log(error);
      }
    },
    getProductById: async (_, { id }) => {
      try {
        const product = await Product.findById(id);
        if (!product) {
          throw new Error("Product not found");
        }
        console.log(product);
        return product;
      } catch (error) {
        console.log(error);
      }
    },
    getOrders: async () => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrdersBySeller: async (_, {}, ctx) => {
      try {
        const orders = await Order.find({ seller: ctx.user.id });
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrder: async (_, { id }, ctx) => {
      // if the order exists or not
      const order = await Order.findById(id);
      if (!order) {
        throw new Error("Order not found");
      }
      // if the user who is asking is the seller
      if (order.seller.toString() !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      // return the order
      return order;
    },
    getOrderByStatus: async (_, { status }, ctx) => {
      const orders = await Order.find({ seller: ctx.user.id, status });
      return orders;
    },
    getTopClients: async () => {
      const clients = await Order.aggregate([
        { $match: { status: "COMPLETED" } },
        {
          $group: {
            _id: "$client",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "clients",
            localField: "_id",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $limit: 10,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return clients;
    },
    getTopSellers: async () => {
      const sellers = await Order.aggregate([
        { $match: { status: "COMPLETED" } },
        {
          $group: {
            _id: "$seller",
            total: { $sum: "$total" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "seller",
          },
        },
        {
          $limit: 5,
        },
        {
          $sort: { total: -1 },
        },
      ]);
      return sellers;
    },
    getProductByContext: async (_, { text }) => {
      const products = await Product.find({ $text: { $search: text } }).limit(
        10
      );
      return products;
    },
  },

  Mutation: {
    createNewUser: async (_, { input }) => {
      //console.log(input);
      const { email, password } = input;
      // control if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error("Benutzer existiert bereits");
      }
      // PASSWORD HASHING
      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(password, salt);
      // create user in db
      try {
        const user = new User(input);
        user.save();
        return user;
      } catch (error) {
        console.log(
          "Eigenschaften von Undefinierten können nicht gelesen werden (Lesen von 'Name')"
        );
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input;
      // check if user exists
      const userExists = await User.findOne({ email });
      if (!userExists) {
        throw new Error("Benutzer existiert nicht");
      }
      // check if password is correct
      const correctPassword = await bcrypt.compare(
        password,
        userExists.password
      );
      if (!correctPassword) {
        throw new Error("Passwort ist falsch");
      }
      // create token
      return {
        token: createToken(userExists, process.env.SECRET, "24h"),
      };
    },
    createNewProduct: async (_, { input }) => {
      //console.log(input);
      const { name } = input;
      // check if product exists
      const productExists = await Product.findOne({ name });
      if (productExists) {
        throw new Error("Product already exists");
      }
      // create product in db
      try {
        const product = new Product(input);
        const result = await product.save();
        return result;
        //console.log(product);
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      //console.log(input);
      const { name } = input;
      // check if product exists
      const productExists = await Product.findById(id);
      if (!productExists) {
        throw new Error("Product does not exists");
      }
      // update product in db
      try {
        const result = await Product.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return result;
      } catch (error) {
        console.log(error);
      }
      //console.log(product);
    },
    deleteProduct: async (_, { id }) => {
      //console.log(id);
      try {
        await Product.findByIdAndDelete({ _id: id });
        return "Product deleted";
      } catch (error) {
        console.log(error);
      }
      //console.log(product);
    },
    createNewClient: async (_, { input }, ctx) => {
      const { email } = input;
      console.log(ctx);
      // check if product exists
      const clientExists = await Client.findOne({ email });
      if (clientExists) {
        throw new Error("Client already exists");
      }
      const client = new Client(input);
      //PROduct asign to client
      client.seller = ctx.user.id;

      // create product in db
      try {
        const result = await client.save();
        return result;
      } catch (error) {
        console.log(error);
      }
      //console.log(product);
    },
    updateClient: async (_, { id, input }, ctx) => {
      // check if client exists
      console.log(id)
      let client = await Client.findById(id);
      
      if (!client) {
        throw new Error("Client does not exists");
      }
      // check if client is the seller
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      // update client in db

      client = await Client.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return client;
    },
    deleteClient: async (_, { id }, ctx) => {
      // check if client exists
      let client = await Client.findById(id);
      if (!client) {
        throw new Error("Client does not exists");
      }

      // check if client is the seller
      if (client.seller.toString() !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      // delete client in db
      await Client.findOneAndDelete({ _id: id });
      return "Client deleted";
    },
    createNewOrder: async (_, { input }, ctx) => {
      const { client } = input;
      // check if client exists
      let clientExists = await Client.findById(client);

      if (!clientExists) {
        throw new Error("Client does not exists");
      }
      //check if client is the seller
      if (clientExists.seller.toString() !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      // check if stock is available
      for await (const element of input.order) {
        const { id } = element;
        const product = await Product.findById(id);
        if (element.quantity > product.existence) {
          throw new Error(
            `The product: ${product.name} exceeds the available stock`
          );
        } else if (input.status === "COMPLETED") {
          // update stock
          product.existence = product.existence - element.quantity;
          await product.save();
        }
        // create new order in db amd assign to seller
        const newOrder = new Order(input);
        // assign seller
        newOrder.seller = ctx.user.id;
        // save in db
        const result = await newOrder.save();
        return result;
      } // end for
    },
    updateOrder: async (_, { id, input }, ctx) => {
      const { client } = input;
      // check if order exists
      const orderExists = await Order.findById(id);
      if (!orderExists) {
        throw new Error("Order does not exists");
      }
      // check if client exists
      const clientExists = await Client.findById(client);
      if (!clientExists) {
        throw new Error("Client does not exists");
      }
      // check if client and order belongs to seller
      if (clientExists.seller.toString() !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      // check if stock is available
      if (input.order) {
        for await (const element of input.order) {
          const { id } = element;

          const product = await Product.findById(id);

          if (element.quantity > product.existence) {
            throw new Error(
              `The product: ${product.name} exceeds the available stock`
            );
          } else {
            // update stock
            product.existence = product.existence - element.quantity;
            await product.save();
          }
          // update order in db
        }
      }
      const result = await Order.findOneAndUpdate(
        {
          _id: id,
        },
        input,
        { new: true }
      );
      return result;
      // end for
    },
    deleteOrder: async (_, { id }, ctx) => {
      // check if order exists
      const orderExists = await Order.findById(id);
      if (!orderExists) {
        throw new Error("Order does not exists");
      }
      // check if client and order belongs to seller
      if (orderExists.seller.toString() !== ctx.user.id) {
        throw new Error("Not authorized");
      }
      // delete order in db
      await Order.findOneAndDelete({
        _id: id,
      });
      return "Order deleted";
    },
  },
};

module.exports = resolvers;
