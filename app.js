const dotenv = require('dotenv');
const cronTracker = require('./cronTracker');
const moment = require('moment');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
  });

/* Cron Related Tasks */
console.log(`--------------job instantiation 
at ${moment().format("dddd,Do MMMM YYYY, h:mm:ss a Z")}--------------------`);
cronTracker.stockMonitorCron.start();

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
  });

