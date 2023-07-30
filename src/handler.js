/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
const { nanoid } = require('nanoid');
const { books } = require('./books');

const addBooks = (request, h) => {
  const id = nanoid(16);
  const {
    name = '', year = 0, author = '', summary = '', publisher = '',
    pageCount = 0, readPage = 0, reading = false,
  } = request.payload;
  if (name === '') {
    return h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (pageCount < readPage) {
    return h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  } if (pageCount === readPage) {
    finished = true;
  }
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);
  const isSuccess = books.reduce((book) => book.id === id).length > 0;
  if (isSuccess !== 0) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }
  const response = h.response({
    status: 'error',
    message:
      'Buku gagal ditambahkan',
  }).code(500);
  return response;
};
const showAllBooks = (request, h) => {
  const arrBooks = [];
  let res = null;
  let { name = '', reading = '', finished = '' } = request.query;
  let result = -1;
  if (books.size === 0) {
    res = h.response({ status: 'success', data: { books: [] } });
  } else {
    for (let i = 0; i < books.length; i++) {
      result = -1;
      if (name !== '' || reading !== '' || finished !== '') {
        if (reading === '0') reading = false;
        else if (reading === '1') reading = true;
        if (finished === '0') finished = false;
        else if (finished === '1') finished = true;
        if (name === books[i].name && reading == books[i].reading
              && finished == books[i].finished && finished !== ''
              && reading !== '') {
          result = 1;
        } else if (name === books[i].name && reading == books[i].reading
              && reading !== '') {
          result = 2;
        } else if (name === books[i].name && finished == books[i].finished
              && finished !== '') {
          result = 3;
        } else if (reading == books[i].reading
              && finished == books[i].finished && finished !== ''
              && reading !== '') {
          result = 4;
        } else if (books[i].name.toLowerCase().includes(
          name.toLowerCase(),
        ) && name !== '') {
          result = 5;
        } else if (reading == books[i].reading && reading !== '') {
          result = 6;
        } else if (finished == books[i].finished && finished !== '') {
          result = 7;
        }
      } else {
        result = 0;
      }
      if (result >= 0) {
        arrBooks.push({
          id: books[i].id,
          name: books[i].name,
          publisher: books[i].publisher,
        });
      }
    }

    res = h.response({ status: 'success', data: { books: arrBooks } });
  }
  return res.code(200);
};
const showSpecificBook = (request, h) => {
  const { bookId } = request.params;
  const idx = books.findIndex((note) => note.id === bookId);
  if (idx !== -1) {
    return h.response({ status: 'success', data: { book: books[idx] } }).code(200);
  }
  return h.response({ status: 'fail', message: 'Buku tidak ditemukan' })
    .code(404);
};
const updateSpecificBook = (request, h) => {
  const {
    name = '', year = 0, author = '', summary = '', publisher = '',
    pageCount = '', readPage = '', reading = '',
  } = request.payload;
  if (name === '') {
    return h.response({
      status: 'fail',
      message:
      'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  } if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. '
      + 'readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }
  const { bookId } = request.params;
  const idx = books.findIndex((book) => book.id === bookId);
  let finished = false;
  if (readPage === pageCount) {
    finished = true;
  }

  if (idx !== -1) {
    const updatedAt = new Date().toISOString();
    const { insertedAt } = books[idx];
    books[idx] = {
      ...books[idx],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
      insertedAt,
    };
    return h.response({
      status: 'success',
      message:
      'Buku berhasil diperbarui',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message:
      'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteSpecificBook = (request, h) => {
  const { bookId } = request.params;
  const idx = books.findIndex((book) => book.id === bookId);
  if (idx !== -1) {
    books.splice(idx, 1);
    return h.response({
      status: 'success',
      message:
      'Buku berhasil dihapus',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message:
      'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBooks,
  showAllBooks,
  showSpecificBook,
  updateSpecificBook,
  deleteSpecificBook,
};
