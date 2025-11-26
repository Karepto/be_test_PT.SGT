const borrowingService = require('../services/borrowingService');

const borrowingController = {

  async create(req, res) {
    try {
      const borrowing = await borrowingService.createBorrowing(req.body);
      res.status(201).json(borrowing);
    } catch (error) {

      if (error.message.includes('required') ||
          error.message.includes('not found') ||
          error.message.includes('not available') ||
          error.message.includes('cannot borrow')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async returnBook(req, res) {
    try {
      const borrowing = await borrowingService.returnBook(req.params.id);
      res.json(borrowing);
    } catch (error) {

      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('already been returned')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = borrowingController;
