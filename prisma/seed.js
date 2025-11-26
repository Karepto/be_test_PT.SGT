require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  await prisma.borrowing.deleteMany();
  await prisma.book.deleteMany();
  await prisma.member.deleteMany();

  console.log('Seeding books...');
  const booksData = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publishedYear: 1925, stock: 5, isbn: '9780743273565' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', publishedYear: 1960, stock: 3, isbn: '9780446310789' },
    { title: '1984', author: 'George Orwell', publishedYear: 1949, stock: 4, isbn: '9780451524935' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', publishedYear: 1813, stock: 6, isbn: '9780141439518' },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', publishedYear: 1951, stock: 3, isbn: '9780316769488' },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', publishedYear: 1937, stock: 7, isbn: '9780547928227' },
    { title: 'The Da Vinci Code', author: 'Dan Brown', publishedYear: 2003, stock: 4, isbn: '9780307474278' },
    { title: 'The Alchemist', author: 'Paulo Coelho', publishedYear: 1988, stock: 5, isbn: '9780062315007' },
    { title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', publishedYear: 1943, stock: 8, isbn: '9780156012195' },
    { title: 'Brave New World', author: 'Aldous Huxley', publishedYear: 1932, stock: 4, isbn: '9780060850524' },
    { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', publishedYear: 1954, stock: 6, isbn: '9780618640157' },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', publishedYear: 1997, stock: 7, isbn: '9780590353427' },
    { title: 'The Chronicles of Narnia', author: 'C.S. Lewis', publishedYear: 1950, stock: 5, isbn: '9780066238501' },
    { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', publishedYear: 1967, stock: 3, isbn: '9780060883287' },
    { title: 'The Hunger Games', author: 'Suzanne Collins', publishedYear: 2008, stock: 6, isbn: '9780439023481' },
    { title: 'The Road', author: 'Cormac McCarthy', publishedYear: 2006, stock: 4, isbn: '9780307387899' },
    { title: 'The Kite Runner', author: 'Khaled Hosseini', publishedYear: 2003, stock: 5, isbn: '9781594631931' },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', publishedYear: 2005, stock: 4, isbn: '9780307949486' },
    { title: 'The Book Thief', author: 'Markus Zusak', publishedYear: 2005, stock: 6, isbn: '9780375842207' },
    { title: 'Life of Pi', author: 'Yann Martel', publishedYear: 2001, stock: 5, isbn: '9780156027328' },
  ];

  for (const book of booksData) {
    await prisma.book.create({ data: book });
  }
  console.log(`Created ${booksData.length} books`);

  console.log('Seeding members...');
  const membersData = [
    { name: 'John Doe', email: 'john.doe@email.com', phone: '081234567890', address: '123 Main St, City' },
    { name: 'Jane Smith', email: 'jane.smith@email.com', phone: '081234567891', address: '456 Oak Ave, Town' },
    { name: 'Robert Johnson', email: 'robert.j@email.com', phone: '081234567892', address: '789 Pine Rd, Village' },
    { name: 'Mary Williams', email: 'mary.w@email.com', phone: '081234567893', address: '321 Elm St, Borough' },
    { name: 'Michael Brown', email: 'michael.b@email.com', phone: '081234567894', address: '654 Maple Dr, District' },
    { name: 'Sarah Davis', email: 'sarah.d@email.com', phone: '081234567895', address: '987 Cedar Ln, County' },
    { name: 'James Wilson', email: 'james.w@email.com', phone: '081234567896', address: '147 Birch Ave, State' },
    { name: 'Emily Taylor', email: 'emily.t@email.com', phone: '081234567897', address: '258 Spruce St, Province' },
    { name: 'David Anderson', email: 'david.a@email.com', phone: '081234567898', address: '369 Ash Rd, Territory' },
    { name: 'Lisa Thomas', email: 'lisa.t@email.com', phone: '081234567899', address: '741 Walnut Ct, Region' },
    { name: 'Kevin Martin', email: 'kevin.m@email.com', phone: '081234567800', address: '852 Cherry Ln, Area' },
    { name: 'Jennifer White', email: 'jennifer.w@email.com', phone: '081234567801', address: '963 Palm Ave, Zone' },
    { name: 'Christopher Lee', email: 'chris.l@email.com', phone: '081234567802', address: '159 Beach Rd, Sector' },
    { name: 'Amanda Clark', email: 'amanda.c@email.com', phone: '081234567803', address: '357 Coast St, District' },
    { name: 'Daniel Martinez', email: 'daniel.m@email.com', phone: '081234567804', address: '468 River Dr, County' },
    { name: 'Michelle Garcia', email: 'michelle.g@email.com', phone: '081234567805', address: '789 Lake Ave, State' },
    { name: 'Andrew Robinson', email: 'andrew.r@email.com', phone: '081234567806', address: '951 Ocean Blvd, Province' },
    { name: 'Patricia Rodriguez', email: 'patricia.r@email.com', phone: '081234567807', address: '753 Bay St, Territory' },
    { name: 'Joseph Hall', email: 'joseph.h@email.com', phone: '081234567808', address: '246 Harbor Rd, Region' },
    { name: 'Nicole King', email: 'nicole.k@email.com', phone: '081234567809', address: '135 Port Ave, Area' },
  ];

  for (const member of membersData) {
    await prisma.member.create({ data: member });
  }
  console.log(`Created ${membersData.length} members`);

  const allBooks = await prisma.book.findMany();
  const allMembers = await prisma.member.findMany();

  console.log('Seeding borrowings...');
  const borrowingsData = [
    { bookIdx: 0, memberIdx: 0, borrowDate: new Date('2024-11-21'), returnDate: new Date('2024-11-28'), status: 'RETURNED' },
    { bookIdx: 1, memberIdx: 1, borrowDate: new Date('2024-11-22'), returnDate: new Date('2024-11-29'), status: 'RETURNED' },
    { bookIdx: 2, memberIdx: 2, borrowDate: new Date('2024-11-23'), returnDate: new Date('2024-11-30'), status: 'RETURNED' },
    { bookIdx: 3, memberIdx: 3, borrowDate: new Date('2024-11-24'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 4, memberIdx: 4, borrowDate: new Date('2024-11-25'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 5, memberIdx: 5, borrowDate: new Date('2024-11-26'), returnDate: new Date('2024-12-03'), status: 'RETURNED' },
    { bookIdx: 6, memberIdx: 6, borrowDate: new Date('2024-11-27'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 7, memberIdx: 7, borrowDate: new Date('2024-11-28'), returnDate: new Date('2024-12-05'), status: 'RETURNED' },
    { bookIdx: 8, memberIdx: 8, borrowDate: new Date('2024-11-29'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 9, memberIdx: 9, borrowDate: new Date('2024-11-30'), returnDate: new Date('2024-12-07'), status: 'RETURNED' },
    { bookIdx: 10, memberIdx: 10, borrowDate: new Date('2024-12-01'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 11, memberIdx: 11, borrowDate: new Date('2024-12-02'), returnDate: new Date('2024-12-09'), status: 'RETURNED' },
    { bookIdx: 12, memberIdx: 12, borrowDate: new Date('2024-12-03'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 13, memberIdx: 13, borrowDate: new Date('2024-12-04'), returnDate: new Date('2024-12-11'), status: 'RETURNED' },
    { bookIdx: 14, memberIdx: 14, borrowDate: new Date('2024-12-05'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 15, memberIdx: 15, borrowDate: new Date('2024-12-06'), returnDate: new Date('2024-12-13'), status: 'RETURNED' },
    { bookIdx: 16, memberIdx: 16, borrowDate: new Date('2024-12-07'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 17, memberIdx: 17, borrowDate: new Date('2024-12-08'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 18, memberIdx: 18, borrowDate: new Date('2024-12-09'), returnDate: null, status: 'BORROWED' },
    { bookIdx: 19, memberIdx: 19, borrowDate: new Date('2024-12-10'), returnDate: new Date('2024-12-17'), status: 'RETURNED' },
  ];

  for (const b of borrowingsData) {
    await prisma.borrowing.create({
      data: {
        bookId: allBooks[b.bookIdx].id,
        memberId: allMembers[b.memberIdx].id,
        borrowDate: b.borrowDate,
        returnDate: b.returnDate,
        status: b.status
      }
    });
  }
  console.log(`Created ${borrowingsData.length} borrowings`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
