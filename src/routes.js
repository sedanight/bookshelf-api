const {
  addBooks, showAllBooks, showSpecificBook, updateSpecificBook, deleteSpecificBook,
} = require('./handler');

const routes = [{
  method: 'POST',
  path: '/books',
  handler: addBooks,
},
{
  method: 'GET',
  path: '/books',
  handler: showAllBooks,
},
{
  method: 'GET',
  path: '/books/{bookId}',
  handler: showSpecificBook,
},
{
  method: 'PUT',
  path: '/books/{bookId}',
  handler: updateSpecificBook,
},
{
  method: 'DELETE',
  path: '/books/{bookId}',
  handler: deleteSpecificBook,
},
];
module.exports = routes;
