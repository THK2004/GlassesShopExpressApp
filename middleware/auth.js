module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
        return next();
    }
  
      // Handle unauthorized access
        res.status(401);
        return res.redirect('/user/login');
    },
  };