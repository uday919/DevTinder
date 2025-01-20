const auth = (req, res, next) => {
  console.log('admin auth is getting checked');
  const token = 'xyz';
  const isAdminAuth = token === 'xyz';
  if (!isAdminAuth) {
    res.status(401).send('Unauthorized request');
  } else {
    next();
  }
};

module.exports = { auth };
