'use strict';

// Catalog of sample records grouped by the model clusters defined in initModels.
const sampleData = {
  // ✅ Authentication and user identity samples.
  auth: {
    // Demonstrates a fully verified admin-level user with a pre-hashed password.
    users: [
      {
        email: 'demo.admin@portfolio.example',
        // Store a pre-generated bcrypt hash so the sample can be inserted directly.
        password_hash: '$2b$10$IMyMOTfPpRQ4x9EESwmI6eI7TX6CbYAYusOGFaZS5nUXm3jfR1TRS', // hash for "AdminPass!23"
        first_name: 'Dana',
        last_name: 'Admin',
        phone_number: '+1-415-555-0199',
        status: 'verified',
        // Keep a plaintext note to clarify the intended login secret for demos.
        note_password_plaintext: 'AdminPass!23',
      },
    ],
  },

  // ✅ Portfolio samples that show a complete profile for a single person.
  portfolio: {
    // Primary career shell that the related records attach to.
    career: {
      user_email: 'demo.admin@portfolio.example',
      headline: 'Full-Stack Engineer specializing in Next.js and Express APIs',
      summary: 'Engineer with 8+ years building user-centric web applications, scalable services, and analytics pipelines.',
      location: 'San Francisco, CA',
      website_url: 'https://portfolio.example/dana',
      github_url: 'https://github.com/danadev',
      linkedin_url: 'https://www.linkedin.com/in/dana-engineer/',
    },
    // Work history covering both startup and enterprise contexts.
    experiences: [
      {
        company_name: 'Aurora Analytics',
        title: 'Senior Software Engineer',
        employment_type: 'Full-time',
        start_date: '2021-03-01',
        end_date: null,
        is_current: true,
        description: 'Leading a squad building event-driven data products, defining API contracts, and mentoring junior engineers.',
      },
      {
        company_name: 'Northwind Labs',
        title: 'Full-Stack Developer',
        employment_type: 'Contract',
        start_date: '2018-06-01',
        end_date: '2021-02-28',
        is_current: false,
        description: 'Delivered greenfield dashboards with React and Express, optimized SQL queries, and automated CI/CD pipelines.',
      },
    ],
    // Highlighted projects to showcase breadth of skills.
    projects: [
      {
        name: 'Realtime Portfolio Tracker',
        role: 'Technical Lead',
        description: 'Streaming stock tracker with WebSockets, Redis-backed caching, and responsive Next.js dashboards.',
        tech_stack: 'Next.js, React, Tailwind CSS, Express.js, PostgreSQL, Redis, WebSockets',
        link_url: 'https://portfolio.example/dana/projects/realtime-tracker',
        start_date: '2022-01-10',
        end_date: null,
      },
      {
        name: 'Infrastructure as Code Accelerator',
        role: 'Backend Engineer',
        description: 'Template library for provisioning Kubernetes clusters with automated secrets management and observability.',
        tech_stack: 'Node.js, Terraform, Helm, Grafana, Prometheus',
        link_url: 'https://portfolio.example/dana/projects/iac-accelerator',
        start_date: '2020-02-15',
        end_date: '2020-12-20',
      },
    ],
    // Educational background with targeted coursework.
    educations: [
      {
        school_name: 'University of Washington',
        degree: 'B.S. Computer Science',
        field_of_study: 'Software Engineering',
        start_date: '2012-09-01',
        end_date: '2016-06-01',
        grade: '3.8 GPA',
        summary: 'Coursework in distributed systems, databases, and human-computer interaction.',
      },
    ],
    // Skills broken down by proficiency and years of experience.
    skills: [
      { name: 'JavaScript', level: 'expert', category: 'Languages', years_experience: 9 },
      { name: 'React', level: 'expert', category: 'Frontend', years_experience: 7 },
      { name: 'Express.js', level: 'advanced', category: 'Backend', years_experience: 7 },
      { name: 'PostgreSQL', level: 'advanced', category: 'Database', years_experience: 6 },
      { name: 'Sequelize', level: 'advanced', category: 'ORM', years_experience: 5 },
      { name: 'Kubernetes', level: 'intermediate', category: 'DevOps', years_experience: 4 },
    ],
  },

  // ✅ Bar menu samples with rich base definitions and recipes.
  bar: {
    // Spirit bases that recipes reference by name for clarity.
    bases: [
      { name: 'Vodka', description: 'Clean, neutral spirit ideal for citrus-forward and herbal cocktails.' },
      { name: 'Tequila', description: 'Blue agave spirit with earthy sweetness and peppery finish.' },
      { name: 'Rum', description: 'Molasses- and cane-based spirit ranging from light to funky dark expressions.' },
    ],
    // Large set of recipes mapped to the above bases.
    recipes: [
      // Vodka cocktails
      { base_name: 'Vodka', name: 'Classic Martini', description: 'Ultra-cold, spirit-forward sipper.', ingredients: '2.5 oz vodka; 0.5 oz dry vermouth; lemon twist', instructions: 'Stir with ice until frosty. Strain into a chilled coupe. Express lemon oils over the top.', glass_type: 'Coupe', garnish: 'Lemon twist', is_alcoholic: true, abv: 28.5 },
      { base_name: 'Vodka', name: 'Moscow Mule', description: 'Zesty, ginger-forward highball.', ingredients: '2 oz vodka; 0.5 oz lime juice; ginger beer to top', instructions: 'Build over ice in a copper mug. Top with ginger beer and gently stir.', glass_type: 'Copper Mug', garnish: 'Lime wheel + mint', is_alcoholic: true, abv: 12.2 },
      { base_name: 'Vodka', name: 'Cosmopolitan', description: 'Crisp, tart, and citrusy pink cocktail.', ingredients: '1.5 oz vodka; 1 oz cranberry juice; 0.75 oz triple sec; 0.5 oz lime juice', instructions: 'Shake with ice until well-chilled. Double strain into a coupe.', glass_type: 'Coupe', garnish: 'Orange peel', is_alcoholic: true, abv: 20.1 },
      { base_name: 'Vodka', name: 'Espresso Martini', description: 'Velvety coffee cocktail with a subtle bite.', ingredients: '1.5 oz vodka; 1 oz espresso; 0.75 oz coffee liqueur; 0.25 oz simple syrup', instructions: 'Shake hard with ice for foam. Double strain into a coupe.', glass_type: 'Coupe', garnish: '3 coffee beans', is_alcoholic: true, abv: 18.8 },
      { base_name: 'Vodka', name: 'Cucumber Basil Fizz', description: 'Garden-fresh spritz with herbal brightness.', ingredients: '1.5 oz vodka; 0.75 oz lime juice; 0.5 oz simple syrup; 3 basil leaves; 3 cucumber slices; soda water to top', instructions: 'Muddle cucumber and basil with syrup and lime. Shake with vodka and ice. Strain over fresh ice and top with soda.', glass_type: 'Collins', garnish: 'Cucumber ribbon', is_alcoholic: true, abv: 10.4 },

      // Tequila cocktails
      { base_name: 'Tequila', name: 'Classic Margarita', description: 'Bright, salty, and agave-forward.', ingredients: '2 oz blanco tequila; 1 oz lime juice; 0.75 oz agave syrup; pinch of salt', instructions: 'Shake with ice and strain over fresh ice in a rocks glass with a salted rim.', glass_type: 'Rocks', garnish: 'Lime wheel + salt rim', is_alcoholic: true, abv: 22.3 },
      { base_name: 'Tequila', name: 'Paloma', description: 'Citrus soda refresher with grapefruit bite.', ingredients: '1.5 oz tequila; 0.5 oz lime juice; 2 oz grapefruit soda; pinch of salt', instructions: 'Build in a Collins glass over ice. Top with soda and give a quick stir.', glass_type: 'Collins', garnish: 'Grapefruit wedge', is_alcoholic: true, abv: 10.8 },
      { base_name: 'Tequila', name: 'Smoky Oaxacan Daisy', description: 'Layers mezcal smoke with bright lime and orange.', ingredients: '1 oz tequila; 1 oz mezcal; 0.75 oz lime juice; 0.75 oz orange liqueur; 0.25 oz agave', instructions: 'Shake with ice until chilled. Strain into a chilled coupe.', glass_type: 'Coupe', garnish: 'Flamed orange peel', is_alcoholic: true, abv: 24.1 },
      { base_name: 'Tequila', name: 'Spicy Watermelon Cooler', description: 'Fruity refresher with a jalapeño kick.', ingredients: '1.5 oz tequila; 1 oz watermelon juice; 0.75 oz lime; 0.5 oz agave; 2 jalapeño slices', instructions: 'Muddle jalapeño with agave, shake all ingredients with ice, and strain over crushed ice.', glass_type: 'Double Rocks', garnish: 'Watermelon spear', is_alcoholic: true, abv: 14.2 },
      { base_name: 'Tequila', name: 'Ranch Water', description: 'Ultra-simple West Texas highball.', ingredients: '1.5 oz tequila; 0.75 oz lime juice; topo chico to top', instructions: 'Build in a highball glass with ice. Top with sparkling mineral water and give a gentle stir.', glass_type: 'Highball', garnish: 'Lime wedge', is_alcoholic: true, abv: 9.6 },

      // Rum cocktails
      { base_name: 'Rum', name: 'Daiquiri', description: 'Three-ingredient classic that spotlights the rum.', ingredients: '2 oz white rum; 0.75 oz lime juice; 0.75 oz simple syrup', instructions: 'Shake hard with ice and fine strain into a chilled coupe.', glass_type: 'Coupe', garnish: 'Lime wheel', is_alcoholic: true, abv: 23.5 },
      { base_name: 'Rum', name: 'Mojito', description: 'Minty, bubbly refresher.', ingredients: '2 oz white rum; 0.75 oz lime; 0.5 oz simple syrup; 6 mint leaves; soda water', instructions: 'Muddle mint with syrup and lime. Add rum and ice, then top with soda and gently stir.', glass_type: 'Collins', garnish: 'Mint bouquet', is_alcoholic: true, abv: 11.3 },
      { base_name: 'Rum', name: 'Dark and Stormy', description: 'Spicy ginger and caramelized rum notes.', ingredients: '2 oz dark rum; 0.5 oz lime juice; ginger beer to top', instructions: 'Build over ice in a highball. Top with ginger beer and briefly stir.', glass_type: 'Highball', garnish: 'Lime wedge', is_alcoholic: true, abv: 11.7 },
      { base_name: 'Rum', name: 'Jungle Bird', description: 'Tropical bitter-sweet tiki staple.', ingredients: '1.5 oz blackstrap rum; 1.5 oz pineapple juice; 0.75 oz Campari; 0.5 oz lime; 0.5 oz simple syrup', instructions: 'Shake with ice and strain over a large cube.', glass_type: 'Double Rocks', garnish: 'Pineapple frond', is_alcoholic: true, abv: 17.9 },
      { base_name: 'Rum', name: 'Piña Colada', description: 'Creamy coconut indulgence.', ingredients: '2 oz white rum; 2 oz pineapple juice; 1.5 oz cream of coconut; 0.5 oz lime', instructions: 'Blend with crushed ice until smooth or shake and serve over pebble ice.', glass_type: 'Hurricane', garnish: 'Pineapple wedge + cherry', is_alcoholic: true, abv: 12.5 },
      { base_name: 'Rum', name: 'Hotel Nacional', description: 'Elegant, silky tropical sour.', ingredients: '1.5 oz aged rum; 1 oz pineapple juice; 0.5 oz apricot liqueur; 0.5 oz lime; 0.25 oz simple syrup', instructions: 'Shake until chilled and fine strain into a coupe.', glass_type: 'Coupe', garnish: 'Dehydrated pineapple', is_alcoholic: true, abv: 19.4 },
    ],
  },

  // ✅ Game server samples to illustrate multiple environments.
  game: {
    servers: [
      {
        name: 'Summit Arena',
        img_src: 'https://cdn.example.com/games/summit-arena.png',
        port: 3001,
        status: 'open',
        description: 'US-West PvP arena tuned for low-latency ranked matches.',
      },
      {
        name: 'Glacier Co-op',
        img_src: 'https://cdn.example.com/games/glacier-coop.png',
        port: 3002,
        status: 'open',
        description: 'Four-player cooperative survival with dynamic weather events.',
      },
      {
        name: 'Nebula Sandbox',
        img_src: 'https://cdn.example.com/games/nebula-sandbox.png',
        port: 3003,
        status: 'draft',
        description: 'Creative build server for experimenting with mods and scripting.',
      },
    ],
  },
};

module.exports = sampleData;
