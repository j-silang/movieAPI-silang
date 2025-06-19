const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth")

module.exports.register = async(req, res) => {
	try{
		const existingUser = await User.findOne({ email: req.body.email });
		if(existingUser){
			return res.status(400).json({ error: "Email already in use" });
		}
		if(req.body.password.length < 8){
			return res.status(400).json({ error: "Password must be at least 8 characters"});
		}
		const newUser = new User ({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		})
		const savedUser = await newUser.save();
		return res.status(201).json({
			// success: true,
			message: "Registered Successfully"
		});
	}catch(error){
		return error.message ? res.status(400).json({ error: error.message }) : errorHandler(error, req, res);
	}
}

module.exports.login = async(req, res) => {
	try{
		const foundUser = await User.findOne({ email: req.body.email });
		if(!foundUser){
			return res.status(404).json({ message: "Email not found"});
		}else{
			const passValidated = bcrypt.compareSync(req.body.password, foundUser.password);
			if(passValidated){
				return res.status(200).json({
					// success: true,
					access: auth.createAccessToken(foundUser)
				})
			}else{
                return res.status(401).json({message:"Email and password do not match"});
            }
		}
	}catch(error){
		return error.message ? res.status(400).json({ error: error.message }) : errorHandler(error, req, res);
	}
}