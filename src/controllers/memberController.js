const memberService = require('../services/memberService');

const memberController = {

  async create(req, res) {
    try {
      const member = await memberService.createMember(req.body);
      res.status(201).json(member);
    } catch (error) {
 
      if (error.message.includes('required') || 
          error.message.includes('invalid') || 
          error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async getMemberBorrowings(req, res) {
    try {
      const { id } = req.params;
      const { status, page, limit } = req.query;
      const result = await memberService.getMemberBorrowingsWithPagination(id, { status, page, limit });
      res.json(result);
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = memberController;
