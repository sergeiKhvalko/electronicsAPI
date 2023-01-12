const Product = require("../models/product");

exports.remove = async(req, res) => {
	try {
		const deleted = await Product.findOneAndRemove({
			slug: req.params.slug
		}).exec();
		res.json(deleted);
	} catch (err) {
		return res.status(400).send("Product delete failed");
	}
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

exports.listAll = async(req, res) => {
	try {
		let products = await Product.find({})
			.limit(parseInt(req.params.count))
			.populate("category")
			.populate("subs")
			.sort([["createdAt", "desc"]])
			.exec();
		res.json(products);
	} catch(err) {
		console.log(err);
	}
}

exports.productsCount = async(req, res) => {
	let total =  await Product.find({}).estimatedDocumentCount().exec();
	res.json(total);
}


// SERACH / FILTER

const handleQuery = async(req, res, query) => {
	const products = await Product.find({ $text: { $search: query } })
		.populate("category", "_id name")
		.populate("subs", "_id name")
		.populate("postedBy", "_id name")
		.exec();

	res.json(products);
};

const handlePrice = async (req, res, price) => {
	try {
		let products = await Product.find({
			price: {
				$gte: price[0],
				$lte: price[1],
			},
		})
			.populate("category", "_id name")
			.populate("subs", "_id name")
			.populate("postedBy", "_id name")
			.exec();

		res.json(products);
	} catch (err) {
		console.log(err);
	}
};

const handleCategory = async (req, res, category) => {
	try {
		let products = await Product.find({ category })
			.populate("category", "_id name")
			.populate("subs", "_id name")
			.populate("postedBy", "_id name")
			.exec();

		res.json(products);
	} catch (err) {
		console.log(err);
	}
};

const handleStar = (req, res, stars) => {
	Product.aggregate([
		{
			$project: {
				document: "$$ROOT",
				// title: "$title",
				floorAverage: {
					$floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
				},
			},
		},
		{ $match: { floorAverage: stars } },
	])
		.limit(12)
		.exec((err, aggregates) => {
			if (err) console.log("AGGREGATE ERROR", err);
			Product.find({ _id: aggregates })
				.populate("category", "_id name")
				.populate("subs", "_id name")
				.populate("postedBy", "_id name")
				.exec((err, products) => {
					if (err) console.log("PRODUCT AGGREGATE ERROR", err);
					res.json(products);
				});
		});
};

const handleSub = async (req, res, sub) => {
	const products = await Product.find({ subs: sub })
		.populate("category", "_id name")
		.populate("subs", "_id name")
		.populate("postedBy", "_id name")
		.exec();

	res.json(products);
};

const handleShipping = async (req, res, shipping) => {
	const products = await Product.find({ shipping })
		.populate("category", "_id name")
		.populate("subs", "_id name")
		.populate("postedBy", "_id name")
		.exec();

	res.json(products);
};

const handleColor = async (req, res, color) => {
	const products = await Product.find({ color })
		.populate("category", "_id name")
		.populate("subs", "_id name")
		.populate("postedBy", "_id name")
		.exec();

	res.json(products);
};

const handleBrand = async (req, res, brand) => {
	console.dir(brand)
	const products = await Product.find({ brand })
		.populate("category", "_id name")
		.populate("subs", "_id name")
		.populate("postedBy", "_id name")
		.exec();

	res.json(products);
};

exports.searchFilters = async(req, res) => {
	const {
		query,
		price,
		category,
		stars,
		sub,
		shipping,
		color,
		brand
	} = req.body;

	if(query) {
		await handleQuery(req, res, query);
	}

	// price [20, 200]
	if (price !== undefined) {
		await handlePrice(req, res, price);
	}

	if (category) {
		await handleCategory(req, res, category);
	}

	if (stars) {
		await handleStar(req, res, stars);
	}

	if (sub) {
		await handleSub(req, res, sub);
	}

	if (shipping) {
		await handleShipping(req, res, shipping);
	}

	if (color) {
		await handleColor(req, res, color);
	}

	if (brand) {
		await handleBrand(req, res, brand);
	}
}