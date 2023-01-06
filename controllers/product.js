const Product = require("../models/product");

exports.productsCount = async(req, res) => {
	let total =  await Product.find({}).estimatedDocumentCount().exec();
	res.json(total);
}

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, 3
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// WITH PAGINATION
exports.list = async(req, res) => {
	try {
		const {sort, order, page} = req.body;
		const currentPage = page || 1;
		const perPage = 3;

		const products = await Product.find({})
			.skip((currentPage - 1) * perPage)
			.populate("category")
			.populate("subs")
			.sort([[sort, order]])
			.limit(perPage)
			.exec();

		res.json(products);
	} catch (err) {
		console.log(err);
	}
}