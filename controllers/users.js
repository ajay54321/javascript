const Pet = require("../models/Pet");
const Vaccine = require("../models/Vaccine");

module.exports = {
	getAddPet: async (req, res) => {
		try {
			const pets = await Pet.find({ user: req.user.id });
			res.render("addpet.ejs", 
			{ pets: pets, user: req.user, name: pets.name, species: pets.species  }
			);
		} catch (err) {
			console.log(err);
		}
	},
	getFeed: async (req, res) => {
		try {
			const pets = await Pet.find().sort({ createdAt: "desc" }).lean();
			res.render("feed.ejs", { pets: pets });
		} catch (err) {
			console.log(err);
		}
	},
	getPet: async (req, res) => {
		try {
			const pet = await Pet.findById(req.params.id);
			const vaccine = await Vaccine.find({ petid: req.params.id });
			res.render("pet.ejs", { pet: pet, user: req.user, vaccine: vaccine  });
		} catch (err) {
			console.log(err);
		}
	},

	createPet: async (req, res) => {
		try {
			// Upload image to cloudinary
			let defaultImage = "./public/imgs/heartpaw.jpg"
			if (!req.file){
				petImage = await cloudinary.uploader.upload(defaultImage);
			}else{
				petImage = await cloudinary.uploader.upload(req.file.path);
			}
			
			await Pet.create({
				name: req.body.name || 'Pet with no name',
				image: petImage.secure_url || defaultImage,
				cloudinaryId: petImage.public_id || Math.floor(Math.random()*10000000),
				species: req.body.species || 'Dog',
				likes: 0,
 				user: req.user.id,
			});
			console.log("Pet has been added!");
			res.redirect("/profile");
		} catch (err) {
			console.log(err);
		}
	},

	likePet: async (req, res) => {
		try {
			await Pet.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$inc: { likes: 1 },
				}
			);
			console.log("Likes +1");
			res.redirect(`/pet/${req.params.id}`);
		} catch (err) {
			console.log(err);
		}
	},
	deletePet: async (req, res) => {
		try {
			// Find pet by id
			let pet = await Pet.findById({ _id: req.params.id });
			// Delete image from cloudinary
			await cloudinary.uploader.destroy(pet.cloudinaryId);
			// Delete pet from db
			await Pet.deleteMany({ _id: req.params.id });
			console.log("Deleted Pet");
			res.redirect("/profile");
		} catch (err) {
			res.redirect("/profile");
		}
	},
};
