import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create QA test users
  const demoBuyer = await prisma.user.create({
    data: {
      name: 'Demo Buyer',
      email: 'demo-buyer@nexbid.com',
      password: 'password', // In real app, this would be hashed
      role: 'BUYER',
    },
  });

  const demoSeller = await prisma.user.create({
    data: {
      name: 'Demo Seller',
      email: 'demo-seller@nexbid.com',
      password: 'password',
      role: 'SELLER',
    },
  });

  // Create additional sample users
  const buyer1 = await prisma.user.create({
    data: {
      name: 'John Buyer',
      email: 'john.buyer@example.com',
      password: 'hashedpassword123', // In real app, this would be hashed
      role: 'BUYER',
    },
  });

  const buyer2 = await prisma.user.create({
    data: {
      name: 'Jane Client',
      email: 'jane.client@example.com',
      password: 'hashedpassword123',
      role: 'BUYER',
    },
  });

  const seller1 = await prisma.user.create({
    data: {
      name: 'Mike Developer',
      email: 'mike.dev@example.com',
      password: 'hashedpassword123',
      role: 'SELLER',
    },
  });

  const seller2 = await prisma.user.create({
    data: {
      name: 'Sarah Designer',
      email: 'sarah.design@example.com',
      password: 'hashedpassword123',
      role: 'SELLER',
    },
  });

  const seller3 = await prisma.user.create({
    data: {
      name: 'Alex Writer',
      email: 'alex.writer@example.com',
      password: 'hashedpassword123',
      role: 'SELLER',
    },
  });

  console.log('✅ Created sample users (including QA test users)');

  // Create sample projects
  // QA Demo project (PENDING status)
  const demoProject = await prisma.project.create({
    data: {
      title: 'Modern Landing Page Design',
      description: 'Need a stunning landing page for our SaaS product. Looking for modern design with smooth animations, responsive layout, and conversion optimization. Should include hero section, features, testimonials, and pricing.',
      minBudget: 1500,
      maxBudget: 3000,
      deadline: new Date('2024-04-01'),
      status: 'PENDING',
      buyerId: demoBuyer.id,
    },
  });

  const project1 = await prisma.project.create({
    data: {
      title: 'E-commerce Website Development',
      description: 'Need a modern e-commerce website built with React and Node.js. Should include user authentication, product catalog, shopping cart, and payment integration.',
      minBudget: 2000,
      maxBudget: 5000,
      deadline: new Date('2024-03-15'),
      status: 'PENDING',
      buyerId: buyer1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App UI/UX Design',
      description: 'Looking for a talented designer to create UI/UX designs for a fitness tracking mobile app. Need wireframes, mockups, and a complete design system.',
      minBudget: 800,
      maxBudget: 1500,
      deadline: new Date('2024-02-28'),
      status: 'PENDING',
      buyerId: buyer2.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Content Writing for Tech Blog',
      description: 'Need 10 high-quality blog posts about web development trends, AI, and cybersecurity. Each post should be 1500-2000 words with proper SEO optimization.',
      minBudget: 500,
      maxBudget: 1000,
      deadline: new Date('2024-02-20'),
      status: 'IN_PROGRESS',
      buyerId: buyer1.id,
      sellerId: seller3.id,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      title: 'Database Optimization',
      description: 'Existing PostgreSQL database needs performance optimization. Looking for someone to analyze queries, create indexes, and improve overall performance.',
      minBudget: 1200,
      maxBudget: 2000,
      deadline: new Date('2024-01-15'),
      status: 'COMPLETED',
      buyerId: buyer2.id,
      sellerId: seller1.id,
      deliverable: 'sample-deliverable.pdf',
    },
  });

  console.log('✅ Created sample projects');

  // Create sample bids
  // Bids for demo project
  await prisma.bid.create({
    data: {
      amount: 2200,
      etaDays: 14,
      message: 'I specialize in modern landing page design with a focus on conversion optimization. I can create a stunning, responsive design that will help boost your conversions.',
      projectId: demoProject.id,
      sellerId: demoSeller.id,
    },
  });

  await prisma.bid.create({
    data: {
      amount: 2800,
      etaDays: 21,
      message: 'I am a UI/UX designer with 4+ years of experience. I can deliver a premium landing page with smooth animations and mobile-first design approach.',
      projectId: demoProject.id,
      sellerId: seller2.id,
    },
  });

  await prisma.bid.create({
    data: {
      amount: 1800,
      etaDays: 10,
      message: 'Quick turnaround specialist! I can create a clean, modern landing page that converts. Includes revisions and source files.',
      projectId: demoProject.id,
      sellerId: seller1.id,
    },
  });

  await prisma.bid.create({
    data: {
      amount: 3500,
      etaDays: 45,
      message: 'I have 5+ years of experience in full-stack development. I can build a modern, responsive e-commerce site with all the features you need.',
      projectId: project1.id,
      sellerId: seller1.id,
    },
  });

  await prisma.bid.create({
    data: {
      amount: 4200,
      etaDays: 60,
      message: 'I specialize in e-commerce development and can provide additional features like inventory management and analytics dashboard.',
      projectId: project1.id,
      sellerId: seller2.id,
    },
  });

  await prisma.bid.create({
    data: {
      amount: 1200,
      etaDays: 21,
      message: 'I am a UX/UI designer with expertise in mobile app design. I can create beautiful, user-friendly designs for your fitness app.',
      projectId: project2.id,
      sellerId: seller2.id,
    },
  });

  await prisma.bid.create({
    data: {
      amount: 750,
      etaDays: 30,
      message: 'I have been writing technical content for 3 years. I can deliver high-quality, SEO-optimized blog posts on time.',
      projectId: project3.id,
      sellerId: seller3.id,
      accepted: true,
    },
  });

  console.log('✅ Created sample bids');

  // Create sample review
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent work! The database performance improved significantly. Very professional and delivered on time.',
      projectId: project4.id,
      sellerId: seller1.id,
    },
  });

  console.log('✅ Created sample review');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 