import { Category } from '../interfaces';

export const SEED_ROLES = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'user' },
  { id: 3, name: 'delivery' },
];

export const SEED_USERS = [
  {
    name: 'Adrian',
    lastName: 'Admin',
    email: 'adrian@test.com',
    password: '123123qweQWE',
    isActive: true,
    role_id: 1,
  },
  {
    name: 'Alex',
    lastName: 'Client',
    email: 'alex@test.com',
    password: '123123qweQWE',
    isActive: true,
    role_id: 2,
  },
  {
    name: 'John',
    lastName: 'Delivery',
    email: 'john@test.com',
    password: '123123qweQWE',
    isActive: true,
    role_id: 3,
  },
];

export const SEED_CATEGORIES: Category[] = [
  { name: 'Pan' },
  { name: 'Pan dulce' },
  { name: 'Pasteles y tartas' },
  { name: 'Galletas y Dulces' },
  { name: 'Productos sin gluten' },
  { name: 'Lacteos' },
  { name: 'Productos sin lactosa' },
];

export const SEED_PRODUCTS = [
  {
    title: 'Caja de Panes de Yuca',
    category_id: 1,
    unit: 'units per box',
    quantity: 24,
    price: 54,
  },
  {
    title: 'Caja de Panes de Centeno',
    category_id: 1,
    unit: 'units per box',
    quantity: 24,
    price: 21,
  },
];
