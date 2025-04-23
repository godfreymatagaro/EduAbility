src/
├── assets/                    # Static assets like images, fonts, etc.
│   ├── images/
│   └── fonts/
├── components/                # Reusable UI components
│   ├── common/               # Generic components (e.g., Button, Input)
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   ├── layout/               # Layout-related components (e.g., Navbar, Footer)
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── features/             # Feature-specific components
│   │   ├── HeroSection.jsx
│   │   └── SearchBar.jsx
│   └── auth/                 # Authentication-related components
│       ├── LoginForm.jsx
│       └── RegisterForm.jsx
├── pages/                    # Page components (mapped to routes)
│   ├── HomePage.jsx
│   ├── TechnologiesPage.jsx
│   ├── ComparePage.jsx
│   ├── FeedbackPage.jsx
│   └── NotFoundPage.jsx
├── routes/                   # Route definitions
│   ├── index.jsx
│   └── routes.jsx
├── services/                 # API and external service integrations
│   ├── api.js
│   └── axiosInstance.js
├── utils/                    # Utility functions and helpers
│   ├── constants.js
│   ├── helpers.js
│   └── accessibility.js
├── styles/                   # Global styles and Tailwind configuration
│   ├── tailwind.css
│   └── global.css
├── App.jsx                   # Root component
├── main.jsx                  # Entry point
└── vite.config.js            # Vite configuration