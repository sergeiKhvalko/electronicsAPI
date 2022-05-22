const admin = require("../firebase");

exports.authCheck = async (req, res, cb) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    cb();
  } catch (err) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};
