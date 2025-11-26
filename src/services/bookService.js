const prisma = require('../config/database');

const bookService = {
  async getAllBooks(filters = {}) {
    const { title, author, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where = {};
    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive'
      };
    }
    if (author) {
      where.author = {
        contains: author,
        mode: 'insensitive'
      };
    }

    const [total, books] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const booksWithAvailability = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      published_year: book.publishedYear,
      stock: book.stock,
      isbn: book.isbn,
      available: book.stock > 0
    }));

    return {
      data: booksWithAvailability,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    };
  },

  async getAvailableBooks() {
    return await prisma.book.findMany({
      where: {
        stock: {
          gt: 0
        }
      }
    });
  }
};

module.exports = bookService;
