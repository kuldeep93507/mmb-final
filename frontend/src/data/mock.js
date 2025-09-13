// Mock data for MMB Portfolio Website

export const mockData = {
  // Hero Section
  hero: {
    name: "MMB",
    tagline: "Modern Web Solutions That Convert Visitors Into Customers",
    description: "Professional Website Development, UX/UI Design & Digital Solutions",
    ctaText: "Let's Work Together",
    heroImage: "/uploads/hero-image.svg"
  },

  // About Section
  about: {
    title: "About MMB",
    description: "Passionate web developer and designer with expertise in creating modern, responsive websites that deliver exceptional user experiences. Specialized in React, Node.js, and modern web technologies.",
    experience: "3+ Years",
    projectsCompleted: "15+",
    happyClients: "12+",
    skills: [
      "React & Next.js",
      "Node.js & Express",
      "MongoDB & Firebase",
      "Tailwind CSS",
      "WordPress Development",
      "UX/UI Design",
      "SEO Optimization"
    ]
  },

  // Services
  services: [
    {
      id: 1,
      title: "Website Development",
      description: "Custom responsive websites built with modern technologies like React, Next.js, and Node.js",
      price: "Starting from ₹15,000",
      duration: "7-14 days",
      features: ["Responsive Design", "Fast Loading", "SEO Optimized", "Admin Panel"],
      icon: "Globe"
    },
    {
      id: 2,
      title: "Landing Page Design",
      description: "High-conversion landing pages that turn visitors into customers with compelling design and copy",
      price: "Starting from ₹8,000",
      duration: "3-5 days", 
      features: ["Conversion Focused", "Mobile First", "A/B Testing", "Analytics Setup"],
      icon: "Layout"
    },
    {
      id: 3,
      title: "UX/UI Design",
      description: "User-centered design approach with wireframes, prototypes, and beautiful interfaces",
      price: "Starting from ₹12,000",
      duration: "5-10 days",
      features: ["User Research", "Wireframes", "Prototypes", "Design System"],
      icon: "Palette"
    },
    {
      id: 4,
      title: "WordPress Development",
      description: "Custom WordPress themes and plugins with easy-to-use admin panels",
      price: "Starting from ₹10,000", 
      duration: "5-7 days",
      features: ["Custom Themes", "Plugin Development", "WooCommerce", "SEO Ready"],
      icon: "Wordpress"
    },
    {
      id: 5,
      title: "Content Writing",
      description: "SEO-optimized content that engages your audience and improves search rankings",
      price: "Starting from ₹500/page",
      duration: "1-3 days",
      features: ["SEO Optimized", "Engaging Copy", "Research Based", "Plagiarism Free"],
      icon: "PenTool"
    },
    {
      id: 6,
      title: "Digital Marketing",
      description: "Complete digital marketing solutions including social media and SEO strategies",
      price: "Starting from ₹5,000/month",
      duration: "Ongoing",
      features: ["Social Media", "SEO Strategy", "Content Calendar", "Analytics"],
      icon: "TrendingUp"
    }
  ],

  // Portfolio Projects
  projects: [
    {
      id: 1,
      title: "Skillpay - Payment Solutions",
      description: "Modern payment gateway website with secure transactions and user-friendly interface",
      image: "/uploads/blog-api-security.svg",
      category: "Website Development",
      tags: ["React", "Payment Gateway", "Security"],
      liveUrl: "https://skillpay.shop",
      technologies: ["React", "Node.js", "Stripe", "MongoDB"]
    },
    {
      id: 2,
      title: "Durga Chemical Solutions",
      description: "Corporate website for chemical solutions company with product catalog and inquiry system",
      image: "/uploads/project-corporate.svg",
      category: "Corporate Website",
      tags: ["WordPress", "Corporate", "Catalog"],
      liveUrl: "https://durgachemsol.com",
      technologies: ["WordPress", "PHP", "MySQL"]
    },
    {
      id: 3,
      title: "Hisar Job Place",
      description: "Job portal connecting employers with job seekers in Hisar region",
      image: "/uploads/blog-tailwind-css.svg",
      category: "Web Application",
      tags: ["Job Portal", "React", "Database"],
      liveUrl: "https://hisarjobplace.in",
      technologies: ["React", "Node.js", "MongoDB", "JWT"]
    },
    {
      id: 4,
      title: "NeoGenie Shop",
      description: "E-commerce platform with modern design and seamless shopping experience",
      image: "/uploads/project-ecommerce.svg",
      category: "E-commerce",
      tags: ["E-commerce", "Shopping", "Payment"],
      liveUrl: "https://neogenie.shop",
      technologies: ["React", "Node.js", "Stripe", "MongoDB"]
    },
    {
      id: 5,
      title: "Pensiya Krishi Farm",
      description: "Agricultural website showcasing farm products and organic farming practices",
      image: "/uploads/project-agriculture.svg",
      category: "Agriculture",
      tags: ["Agriculture", "Organic", "Products"],
      liveUrl: "https://pensiyakrishifarm.com",
      technologies: ["WordPress", "WooCommerce", "PHP"]
    },
    {
      id: 6,
      title: "Krishi Ledger App",
      description: "Farm management application for tracking crops, expenses, and profits",
      image: "/uploads/project-app.svg",
      category: "Web Application",
      tags: ["Agriculture", "Management", "Dashboard"],
      liveUrl: "https://app--krishi-ledger-copy-copy-0e9155b6.base44.app",
      technologies: ["React", "Node.js", "Charts.js", "MongoDB"]
    }
  ],

  // Testimonials
  testimonials: [
    {
      id: 1,
      name: "Rajesh Kumar",
      position: "CEO, Durga Chemical Solutions",
      company: "Durga Chemical Solutions",
      rating: 5,
      text: "MMB delivered an exceptional website that perfectly represents our brand. Professional service and excellent communication throughout the project.",
      image: "/uploads/avatar-male-1.svg"
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "Founder, NeoGenie Shop",
      company: "NeoGenie Shop", 
      rating: 5,
      text: "The e-commerce platform MMB built for us increased our sales by 40%. Amazing work and great attention to detail!",
      image: "/uploads/avatar-female-1.svg"
    },
    {
      id: 3,
      name: "Amit Singh",
      position: "Owner, Pensiya Krishi Farm",
      company: "Pensiya Krishi Farm",
      rating: 5,
      text: "Professional, timely delivery, and excellent support. MMB understood our agricultural business needs perfectly.",
      image: "/uploads/avatar-male-2.svg"
    }
  ],

  // Blog Posts
  blogPosts: [
    {
      id: 1,
      title: "Complete Guide to React Hooks in 2024",
      excerpt: "Master React Hooks with practical examples and learn how to build modern, efficient React applications using useState, useEffect, and custom hooks.",
      image: "/uploads/blog-react-hooks.svg",
      category: "React",
      author: "MMB",
      publishDate: "2024-01-25",
      readTime: "12 min read",
      tags: ["React", "Hooks", "JavaScript", "Frontend"]
    },
    {
      id: 2,
      title: "Building Responsive Websites with Tailwind CSS",
      excerpt: "Learn advanced Tailwind CSS techniques for creating beautiful, responsive designs that work perfectly across all devices and screen sizes.",
      image: "/uploads/blog-tailwind-css.svg",
      category: "CSS",
      author: "MMB",
      publishDate: "2024-01-22",
      readTime: "8 min read",
      tags: ["Tailwind CSS", "Responsive Design", "CSS", "Web Design"]
    },
    {
      id: 3,
      title: "Node.js Best Practices for Production Applications",
      excerpt: "Essential Node.js best practices, security considerations, and performance optimizations for building scalable backend applications in production.",
      image: "/uploads/blog-nodejs.svg",
      category: "Node.js",
      author: "MMB",
      publishDate: "2024-01-20",
      readTime: "15 min read",
      tags: ["Node.js", "Backend", "JavaScript", "Best Practices"]
    },
    {
      id: 4,
      title: "SEO Optimization for Modern Web Applications",
      excerpt: "Complete SEO guide for modern web apps including technical SEO, Core Web Vitals, and strategies to improve search engine rankings in 2024.",
      image: "/uploads/blog-seo.svg",
      category: "SEO",
      author: "MMB",
      publishDate: "2024-01-18",
      readTime: "10 min read",
      tags: ["SEO", "Web Performance", "Google", "Rankings"]
    },
    {
      id: 5,
      title: "MongoDB Database Design Patterns and Best Practices",
      excerpt: "Learn MongoDB schema design patterns, indexing strategies, and performance optimization techniques for building efficient database solutions.",
      image: "/uploads/blog-mongodb.svg",
      category: "Database",
      author: "MMB",
      publishDate: "2024-01-15",
      readTime: "11 min read",
      tags: ["MongoDB", "Database", "NoSQL", "Performance"]
    },
    {
      id: 6,
      title: "WordPress vs Custom Development: Complete Comparison",
      excerpt: "Detailed comparison between WordPress and custom development approaches, helping you choose the right solution for your business needs.",
      image: "/uploads/blog-wordpress.svg",
      category: "WordPress",
      author: "MMB",
      publishDate: "2024-01-12",
      readTime: "9 min read",
      tags: ["WordPress", "Custom Development", "CMS", "Decision Guide"]
    },
    {
      id: 7,
      title: "API Security Best Practices for Web Developers",
      excerpt: "Essential security practices for REST APIs including authentication, authorization, rate limiting, and protection against common vulnerabilities.",
      image: "/uploads/blog-api-security.svg",
      category: "Security",
      author: "MMB",
      publishDate: "2024-01-10",
      readTime: "13 min read",
      tags: ["API Security", "REST API", "Authentication", "Web Security"]
    },
    {
      id: 8,
      title: "Performance Optimization Techniques for React Applications",
      excerpt: "Advanced React performance optimization strategies including code splitting, lazy loading, memoization, and bundle size reduction techniques.",
      image: "/uploads/blog-react-performance.svg",
      category: "React",
      author: "MMB",
      publishDate: "2024-01-08",
      readTime: "14 min read",
      tags: ["React", "Performance", "Optimization", "Code Splitting"]
    }
  ],

  // Contact Information
  contact: {
    email: "hello@mmb.dev",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    address: "India",
    social: {
      linkedin: "https://linkedin.com/in/mmb",
      github: "https://github.com/mmb",
      twitter: "https://twitter.com/mmb",
      instagram: "https://instagram.com/mmb"
    }
  },

  // Stats
  stats: [
    { label: "Projects Completed", value: "15+" },
    { label: "Happy Clients", value: "12+" },
    { label: "Years Experience", value: "3+" },
    { label: "Technologies", value: "10+" }
  ]
};

export default mockData;