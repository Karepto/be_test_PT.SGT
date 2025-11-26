const prisma = require('../config/database');

const memberService = {
  validateMemberData(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('Name is required');
    }
    if (!data.email || data.email.trim() === '') {
      errors.push('Email is required');
    }
    if (!data.phone || data.phone.trim() === '') {
      errors.push('Phone is required');
    }
    if (!data.address || data.address.trim() === '') {
      errors.push('Address is required');
    }

    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Email format is invalid');
      }
    }

    if (data.phone) {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
      if (!phoneRegex.test(data.phone.replace(/[\s-]/g, ''))) {
        errors.push('Phone format is invalid');
      }
    }

    return errors;
  },

  async createMember(data) {
    // Validate input
    const validationErrors = this.validateMemberData(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    const existingMember = await this.getMemberByEmail(data.email);
    if (existingMember) {
      throw new Error('Email already exists');
    }

    return await prisma.member.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        address: data.address.trim()
      }
    });
  },

  async getMemberByEmail(email) {
    return await prisma.member.findUnique({
      where: { email: email.trim().toLowerCase() }
    });
  },

  async getMemberBorrowingsWithPagination(memberId, filters = {}) {
    const { status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      throw new Error('Member not found');
    }

    const where = { memberId };
    if (status) {
      where.status = status.toUpperCase();
    }

    // Get total count and data
    const [total, borrowings] = await Promise.all([
      prisma.borrowing.count({ where }),
      prisma.borrowing.findMany({
        where,
        skip,
        take,
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              publishedYear: true
            }
          }
        },
        orderBy: { borrowDate: 'desc' }
      })
    ]);

    return {
      data: borrowings.map(b => ({
        id: b.id,
        book: {
          id: b.book.id,
          title: b.book.title,
          author: b.book.author,
          isbn: b.book.isbn,
          published_year: b.book.publishedYear
        },
        borrow_date: b.borrowDate,
        return_date: b.returnDate,
        status: b.status,
        created_at: b.createdAt
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take)
      }
    };
  }
};

module.exports = memberService;
