const bookService = require('../services/bookService');

const bookController = {
  async getAll(req, res) {
    try {
      const { title, author, page, limit } = req.query;
      const result = await bookService.getAllBooks({ title, author, page, limit });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookController;
