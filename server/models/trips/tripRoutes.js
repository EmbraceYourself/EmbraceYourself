var tripController = require('./tripController.js');

module.exports = function (app) {


  console.log('IN TRIP CONTROLLER......');
  app.get('/viewTrip', tripController.getTrip);


}