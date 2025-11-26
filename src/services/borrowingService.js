// Borrowing service
const prisma = require('../config/database');

const borrowingService = {

  async createBorrowing(data) {
    // Validate input - support single or multiple books
    const bookIds = Array.isArray(data.book_id) ? data.book_id : [data.book_id];
    
    if (!data.member_id) {
      throw new Error('member_id is required');
    }

    if (!bookIds.length || bookIds.some(id => !id)) {
      throw new Error('book_id is required');
    }

    return await prisma.$transaction(async (tx) => {
      // Check if member exists
      const member = await tx.member.findUnique({
        where: { id: data.member_id }
      });

      if (!member) {
        throw new Error('Member not found');
      }

      // Check member's current borrowing count (max 3 books)
      const activeBorrowingsCount = await tx.borrowing.count({
        where: {
          memberId: data.member_id,
          status: 'BORROWED'
        }
      });

      // Check if adding these books would exceed the limit
      const totalBooksAfterBorrow = activeBorrowingsCount + bookIds.length;
      if (totalBooksAfterBorrow > 3) {
        throw new Error(`Member cannot borrow more than 3 books. Current: ${activeBorrowingsCount}, Requesting: ${bookIds.length}`);
      }

      // Validate all books exist and have stock
      const books = await tx.book.findMany({
        where: { id: { in: bookIds } }
      });

      if (books.length !== bookIds.length) {
        throw new Error('One or more books not found');
      }

      // Check stock for each book
      const booksOutOfStock = books.filter(book => book.stock <= 0);
      if (booksOutOfStock.length > 0) {
        const titles = booksOutOfStock.map(b => b.title).join(', ');
        throw new Error(`Books not available (out of stock): ${titles}`);
      }

      // Create borrowings for each book
      const borrowings = [];
      for (const bookId of bookIds) {
        const borrowing = await tx.borrowing.create({
          data: {
            bookId: bookId,
            memberId: data.member_id,
            borrowDate: new Date(),
            status: 'BORROWED'
          },
          include: {
            book: true,
            member: true
          }
        });

        // Decrease book stock
        await tx.book.update({
          where: { id: bookId },
          data: {
            stock: {
              decrement: 1
            }
          }
        });

        borrowings.push(borrowing);
      }

      // Return single object if single book, array if multiple
      return bookIds.length === 1 ? borrowings[0] : borrowings;
    });
  },

  async returnBook(id) {
    return await prisma.$transaction(async (tx) => {
      // Check if borrowing exists
      const borrowing = await tx.borrowing.findUnique({
        where: { id },
        include: {
          book: true,
          member: true
        }
      });

      if (!borrowing) {
        throw new Error('Borrowing record not found');
      }

      // Check if already returned
      if (borrowing.status === 'RETURNED') {
        throw new Error('Book has already been returned');
      }

      // Update borrowing status and return date
      const updatedBorrowing = await tx.borrowing.update({
        where: { id },
        data: {
          status: 'RETURNED',
          returnDate: new Date()
        },
        include: {
          book: true,
          member: true
        }
      });

      // Increase book stock
      await tx.book.update({
        where: { id: borrowing.bookId },
        data: {
          stock: {
            increment: 1
          }
        }
      });

      return updatedBorrowing;
    });
  }

};

module.exports = borrowingService;
