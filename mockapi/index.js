const Factory = require('rosie').Factory;
const { faker } = require('@faker-js/faker');
const { times } = require('lodash');

Factory.define('product')
  .attr('id', () => faker.string.uuid())
  .attr('name', () => faker.commerce.productName())
  .attr('description', () => faker.commerce.productDescription());

Factory.define('option')
  .attr('id', () => faker.string.uuid())
  .attr('label', () => faker.lorem.words())
  .attr('active', () => faker.datatype.boolean({ probability: 0.5 }));

module.exports = () => {
  const db = {};

  db['products'] = times(10, () => Factory.build('product'));
  db['options'] = times(20, () => Factory.build('option'));

  return db;
};
