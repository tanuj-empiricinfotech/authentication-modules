# Authentication Showcase Repository

## Overview

This repository demonstrates two comprehensive authentication implementations in Next.js, showcasing different approaches to user authentication and management.

## Repository Structure

The repository is organized into two main branches, each featuring a distinct authentication implementation:

### 1. Clerk Authentication Branch (`clerk/auth`)
![Clerk Authentication](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpGyGJjtCLUjLuqETtVNOEezMt6HGKMwkB1A&s)

##  Authentication Features

### Sign-In & Sign-Up Flow
- Complete authentication workflow with multiple login options
- Email and password authentication
- Social login with Google integration
- Secure and intuitive user registration process

### Authentication Methods
- Email/Password Login
- Google OAuth Sign-In
- One-Time Password (OTP) authentication via email
- Passwordless login options

##  Security Features

### Account Protection
- Forgot password functionality
- Secure password reset mechanism

### Device Management
- Active device tracking
- Comprehensive device information display:
  - Login timestamp
  - Browser type
  - Device location (city)
  - IP address tracking
- Sign out from all devices option

##  Profile Management

### Profile Customization
- Username modification
- Profile image upload and update
- Email address changes
- Personal information editing

### Security Settings
- Password update functionality
- Current password verification for security changes
- Account deletion option with confirmation process

### Technologies Used
- Next.js
- Clerk Authentication
- React
- TypeScript

##  Additional Features
- Responsive authentication interfaces
- Accessible design for various user needs

### 2. NextAuth Authentication Branch (`next/auth`)
![NextAuth Authentication](https://avatars.githubusercontent.com/u/67470890?s=200&v=4)

#### Key Features:
- Multi-method authentication:
  - Google Account Sign-In/Sign-Up
  - GitHub Account Sign-In/Sign-Up
  - Credentials-based Login

#### Authentication Flows:
- Sign-Up Options:
  - Google Account (Instant Login)
  - GitHub Account (Instant Login)
  - Credentials-based Sign-Up
    - Custom password creation
    - Separate sign-in process

- Sign-In Options:
  - Google Authentication
  - GitHub Authentication
  - Credentials-based Login

#### Advanced Authentication Features:
- Forgot Password Flow
  - Email-based password reset
  - Secure reset link generation
- Protected Pages
  - Authentication-based page access control
  - Automatic redirection for unauthorized access
- Profile Management
  - Change password functionality
  - Additional security options

#### Authentication Enhancements:
- "Remember Me" functionality
  - Encrypted credential storage
  - Local browser credential autofill
- Comprehensive error handling
- Secure authentication state management

## Technology Stack

- **Framework:** Next.js
- **Authentication Libraries:**
  - Clerk Authentication
  - NextAuth.js
- **Additional Technologies:**
  - React
  - Authentication Providers (Google, GitHub)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Git

### Repository Cloning
```bash
git clone https://github.com/tanuj-empiricinfotech/authentication-modules.git
cd authentication-modules

```

### Branch Selection
```bash
# Switch to Clerk Authentication implementation
git checkout clerk/auth

# OR switch to NextAuth implementation
git checkout next/auth
```

### Installation
```bash
# Install dependencies
npm install
# or
yarn install
```

### Configuration
1. Create `.env` file
2. Add required environment variables
   - Authentication provider credentials
   - Secret keys
   - Other configuration parameters

### Running the Project
```bash
npm run dev
# or
yarn dev
```

## Security Considerations
- Implemented secure authentication flows
- Encrypted credential storage
- Protected route handling
- Comprehensive error management
