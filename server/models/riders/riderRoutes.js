var riderController = require('./riderController.js');

module.exports = function (app) {


  console.log('IN TRIP CONTROLLER......');
  app.post('/add_rider', riderController.addRider);
  app.post('/get_trip_riders', riderController.getTripRiders);
  app.post('/delete_rider', riderController.deleteRider);



}