const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.userCart = async (req, res) => {
	const { cart } = req.body;

	const products = [];

	const user = await User.findOne({ email: req.user.email }).exec();

	// check if cart with logged in user id already exist
	let cartExistByThisUser = await Cart.findOne({ orderBy: user._id }).exec();
	if(cartExistByThisUser) {
		cartExistByThisUser.remove();
	}

	for(let i = 0; i < cart.length; i++) {
		let object = {};

		object.product = cart[i]._id;
		object.count = cart[i].count;
		object.color = cart[i].color;
		// get price for creating total
		let productFromDb = await Product.findById(cart[i]._id)
			.select("price")
			.exec();

		object.price = productFromDb.price;

		products.push(object);
	}

	// const products = cart.map(async (c) => {
	// 	let productFromDb = await Product.findById(c._id)
	// 		.select("price")
	// 		.exec();

	// 	return {
	// 		product: c._id,
	// 		count: c.count,
	// 		color: c.color,
	// 		price: productFromDb.price
	// 	}
	// })
	console.log(products);

	const cartTotal = products.reduce((currentValue, nextValue) => {
		return currentValue + nextValue.count * nextValue.price;
	}, 0);
	
	let newCart = await new Cart({
		products,
		cartTotal,
		orderBy: user._id,
	}).save();

	res.json({ ok: true });
}

exports.addToWishlist = async (req, res) => {
	const { productId } = req.body;

	const user = await User.findOneAndUpdate(
		{ email: req.user.email },
		{ $addToSet: { wishlist: productId } }
	).exec();

	res.json({ ok: true });
}

exports.removeFromWishlist = async (req, res) => {
	const { productId } = req.params;

	const user = await User.findOneAndUpdate(
		{ email: req.user.email },
		{ $pull: { wishlist: productId }}
	).exec();

	res.json({ ok: false });
}