export const mockProjects = [
  {
    id: 'mock-1',
    title: 'Modern Landing Page Design',
    description: 'Need a stunning, responsive landing page for a SaaS product. Must be mobile-first and conversion-optimized.',
    minBudget: 2000,
    maxBudget: 3000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING' as const,
    buyerId: 'buyer-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    buyer: {
      id: 'buyer-1',
      name: 'Demo Buyer',
      email: 'demo-buyer@nexbid.com',
      role: 'BUYER' as const,
      createdAt: new Date().toISOString(),
    },
    bids: [],
    reviews: [],
    _count: { bids: 0 }
  },
  {
    id: 'mock-2',
    title: 'E-commerce Mobile App',
    description: 'React Native app for online marketplace with payment integration and real-time chat.',
    minBudget: 7000,
    maxBudget: 9000,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    buyer: {
      id: 'buyer-2',
      name: 'Tech Startup',
      email: 'founder@startup.com',
      role: 'BUYER'
    },
    bids: [],
    _count: { bids: 3 }
  },
  {
    id: 'mock-3',
    title: 'AI-Powered Dashboard',
    description: 'Build a comprehensive analytics dashboard with machine learning insights and real-time data visualization.',
    minBudget: 10000,
    maxBudget: 14000,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: {
      id: 'buyer-3',
      name: 'DataCorp Inc',
      email: 'cto@datacorp.com',
      role: 'BUYER'
    },
    bids: [],
    _count: { bids: 5 }
  },
  {
    id: 'mock-4',
    title: 'Brand Identity & Logo Design',
    description: 'Complete brand identity package including logo, color palette, typography, and brand guidelines for a fintech startup.',
    minBudget: 3000,
    maxBudget: 4000,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: {
      id: 'buyer-4',
      name: 'FinanceFlow',
      email: 'design@financeflow.io',
      role: 'BUYER'
    },
    bids: [],
    _count: { bids: 8 }
  },
  {
    id: 'mock-5',
    title: 'Blockchain Smart Contract Development',
    description: 'Develop and audit smart contracts for a DeFi protocol with yield farming and staking mechanisms.',
    minBudget: 12000,
    maxBudget: 18000,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: {
      id: 'buyer-5',
      name: 'CryptoVentures',
      email: 'dev@cryptoventures.xyz',
      role: 'BUYER'
    },
    bids: [],
    _count: { bids: 12 }
  },
  {
    id: 'mock-6',
    title: 'Video Editing & Motion Graphics',
    description: 'Create promotional video content with motion graphics and animations for a product launch campaign.',
    minBudget: 3800,
    maxBudget: 4600,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    buyer: {
      id: 'buyer-6',
      name: 'Creative Studios',
      email: 'projects@creativestudios.com',
      role: 'BUYER'
    },
    bids: [],
    _count: { bids: 4 }
  }
]; 