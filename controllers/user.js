const User = require("../models/user");

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