var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var tripRouter = express.Router();
  var reviewRouter = express.Router();
  var userRouter = express.Router();
  var riderRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use('/api/trips', tripRouter); 
  app.use('/api/reviews', reviewRouter); 
  app.use('/api/user', userRouter);
  app.use('/api/rider', riderRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../models/trips/tripRoutes.js')(tripRouter);
  require('../models/reviews/reviewRoutes.js')(reviewRouter);
  require('../models/users/userRoutes.js')(userRouter);
};