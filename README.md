# Philippine Cooperative Management System

A comprehensive cooperative management system built with Next.js for Philippine cooperatives, featuring member management, loan processing, savings accounts, and financial reporting.

## Features

- **Authentication & RBAC**: Role-based access control for Admin, Staff, and Members
- **Member Management**: Complete member registration and profile management
- **Loan Management**: Online loan applications, approvals, and payment tracking
- **Savings Management**: Savings account creation, deposits, and withdrawals
- **Financial Reports**: Comprehensive reporting and analytics
- **Responsive Design**: Mobile-friendly interface

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

2. Access the application at [http://localhost:9032](http://localhost:9032)

## Demo Credentials

- **Admin**: admin / admin123
- **Staff**: staff / staff123  
- **Member**: member / member123

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Authentication**: Local storage (demo)
- **Deployment**: Docker & Docker Compose
