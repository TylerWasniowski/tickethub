import 'pretty-error/start';
import 'dotenv/config';
import express from 'express';
import { promisify } from 'util';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import assets from 'tickethub-frontend';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
// import ticketsRouter from './routes/tickets';
// import homeRouter from './routes/home';

import accountRouter from './routes/account';
import searchRouter from './routes/search';
import checkoutRouter from './routes/checkout';

const port = process.env.PORT || 2000;
process.on('unhandledRejection', err => {
  throw err;
});

(async () => {
  const app = express();

  // this sets the public directory to the frontend package's build directory
  app.use(express.static(assets));

  // app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  // app.use(express.static(path.join(__dirname, 'public')));
  app.use(
    expressSession({ secret: 'max', saveUninitialized: false, resave: false })
  );

  // set API routes here

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  // app.use('/tickets', ticketsRouter);
  // app.use('/home', homeRouter);

  app.use('/account', accountRouter);
  app.use('/search', searchRouter);
  app.use('/checkout', checkoutRouter);

  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log('app started');
})();
