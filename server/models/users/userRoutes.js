var userController = require('./userController.js');

module.exports = function(app){
	//app is the userRouter injected from middleware.js


	//set up routes for post and get of signup, login, and signedin
	// app.post('/login', userController.signin);
	// app.post('/signup', userController.signup);
	// app.get('/signedin', userController.checkAuth);
 console.log('hereherereherehrer')
 app.post('/get_user', userController.getUser);

};