const admin = require("../firebase");

exports.authCheck = (req, res, cb) => {
  console.log(req.headers);
  cb();
};
