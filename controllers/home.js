module.exports = {
    getIndex: (req, res) => {
      res.render("home.ejs");
    },

    getDashboard: async (req, res) => {
		try {
			const profile = await Profile.find({ user: req.user.id });
			res.render("canvas59.ejs", { user: req.user, profile: profile });
		} catch (err) {
			console.log(err);
		}
	},


  
  };
  