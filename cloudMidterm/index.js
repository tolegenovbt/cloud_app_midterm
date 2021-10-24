'use strict';

const express = require('express'),
      logger = require('morgan'),
      port = 8080
const app = express();
app.use(logger('dev'));
app.use(express.json());

app.set('view engine', 'ejs')
app.set('views', './ejs')

app.use(express.static('./ejs'))

app.use('/yacht', require('./routes/yacht'));

app.listen(port, function(){
    console.log('application is listening at port: ' + port);
});
