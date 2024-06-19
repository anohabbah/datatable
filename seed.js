const Factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const { times } = require('lodash');

const db = {};

Factory.define('product')
  .attr('id', () => faker.string.uuid())
  .attr('name', () => faker.commerce.productName())
  .attr('description', () => faker.commerce.productDescription());

db.products = times(10, () => Factory.build('product'));

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
