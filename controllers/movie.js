const Movie = require("../models/Movie");
const { errorHandler } = require("../auth");

module.exports.addMovie = async(req, res) => {
	try{
		let newMovie = new Movie ({
			title: req.body.title,
			director: req.body.director,
			year: req.body.year,
			description: req.body.description,
			genre: req.body.genre
		})
		const savedMovie =  await newMovie.save();
		/*return res.status(201).json({
			success: true,
			message: "Movie added",
			savedMovie: savedMovie
		});*/
		return res.status(201).send(savedMovie);
	}catch(error){
		return error.message ? res.status(400).json({ error: error.message }) : errorHandler(error, req, res);
	}
}

module.exports.getAllMovies = async(req, res) => {
	try{
		const foundMovies = await Movie.find({})
		res.status(200).json({
			// success: true,
			movies: foundMovies
		})
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.getMovieById = async(req, res) => {
	try{
		const foundMovie = await Movie.findById(req.params.movieId);
		if(!foundMovie){
			return res.status(404).json({ message: "Movie not found "});
		}else{
			/*return res.status(200).json({
				success: true,
				foundMovie: foundMovie
			});*/
			return res.status(200).send(foundMovie);
		}
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.updateMovie = async(req, res) => {
	try{
		let movieUpdate = {
			title: req.body.title,
			director: req.body.director,
			year: req.body.year,
			description: req.body.description,
			genre: req.body.genre
		}
		const updatedMovie = await Movie.findByIdAndUpdate(req.params.movieId, movieUpdate, { new: true })
		if(!updatedMovie){
			return res.status(404).json({ message: "Movie not found" })
		}else{
			return res.status(200).json({
				// success: true,
				message: "Movie updated successfully",
				updatedMovie: updatedMovie
			});
		}
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.deleteMovie = async(req, res) => {
	try{
		const deletedMovie = await Movie.deleteOne({ _id: req.params.movieId });
		if(deletedMovie.deletedCount === 0){
			return res.status(404).json({ message: "Movie not found" });
		}else{
			return res.status(200).json({
				// success: true,
				message: "Movie deleted successfully"
			});
		}
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.addComment = async(req, res) => {
	try{
		const updatedMovie = await Movie.findByIdAndUpdate(
			{ _id: req.params.movieId },
			{
				$push: {
					comments: {
						userId: req.user.id,
						comment: req.body.comment
					}
				}
			},
			{ new: true, runValidators: true}
		).select("-comments.datePosted");
		if(!updatedMovie){
			return res.status(404).json({ message: "Movie not found" });
		}else{
			return res.status(200).json({
				// success: true,
				message: "comment added successfully",
				updatedMovie: updatedMovie
			})
		}
	}catch(error){
		return errorHandler(error, req, res);
	}
}

module.exports.getComments = async(req, res) => {
	try{
		const foundMovie = await Movie.findById({ _id: req.params.movieId });
		if(!foundMovie){
			return res.status(404).json({ message: "Movie not found" });
		}else{
			return res.status(200).json({
				// success: true,
				comments: foundMovie.comments
			})
		}
	}catch(error){
		return errorHandler(error, req, res);
	}
}