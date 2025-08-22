const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipments', require('./routes/equipments'));
app.use('/api/bases', require('./routes/bases'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/expenditures', require('./routes/expenditures'));
app.use('/api/auditlog', require('./routes/auditlog'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard',require('./routes/dashboard'));

module.exports = app;
