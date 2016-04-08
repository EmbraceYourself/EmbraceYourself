var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var tripRouter = express.Router();
  var reviewRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use('/api/trips', tripRouter); // use user router for all user request

  // authentication middleware used to decode token and made available on the request
  //app.use('/api/trips', helpers.decode);
  app.use('/api/reviews', reviewRouter); // user review router for review request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../models/trips/tripRoutes.js')(tripRouter);
  require('../models/reviews/reviewRoutes.js')(reviewRouter);
};