var tripController = require('./tripController.js');

module.exports = function (app) {


  console.log('IN TRIP CONTROLLER......');
  app.post('/add_rider', riderController.addRider);
  app.post('/get_rider', riderController.getRider);



}