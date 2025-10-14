# Project Details: Basic UI/Backend Structure Setup

This document outlines the tasks and evaluation criteria for setting up the basic UI and backend structure for the Legal AI application.

---

## 1. Task Breakdown

### Task 1: Setup Basic UI Structure (5 Marks)
*   **Objective**: Implement a modern, responsive, and scalable UI foundation using Next.js, ShadCN UI, and Tailwind CSS.
*   **Key Components**:
    *   **Root Layout (`src/app/layout.tsx`)**: Global layout with theme provider and Firebase integration.
    *   **Dashboard Layout (`src/app/dashboard/layout.tsx`)**: Main application shell with a persistent sidebar and header.
    *   **Admin Layout (`src/app/admin/layout.tsx`)**: Secure layout for administrative functions.
    *   **UI Components (`src/components/ui/`)**: Leverage pre-built, production-ready components from ShadCN for consistency (Buttons, Cards, Forms, etc.).
    *   **Styling (`src/app/globals.css`)**: Centralized theme and styling using CSS variables for easy customization.

### Task 2: Setup Backend Structure (5 Marks)
*   **Objective**: Establish a robust backend foundation using Next.js Server Actions, Genkit for AI, and Firebase for data and authentication.
*   **Key Components**:
    *   **Genkit Initialization (`src/ai/genkit.ts`)**: Centralized setup for the Genkit AI toolkit and Google AI models.
    *   **AI Flows (`src/ai/flows/`)**: Organized structure for individual AI capabilities (e.g., chat, document analysis).
    *   **Firebase Integration (`src/firebase/`)**: Modular setup for Firebase services (Auth, Firestore) with custom hooks (`useUser`, `useCollection`) for easy data access.
    *   **Service Layer (`src/services/`)**: Simulated services (e.g., `legal-search.ts`) to mimic data retrieval for RAG models.

### Task 3: Implement Authentication Flow (5 Marks)
*   **Objective**: Create a complete and secure user authentication system using Firebase Authentication.
*   **Key Components**:
    *   **Login Page (`src/app/login/page.tsx`)**: UI and logic for email/password and social (Google, GitHub) login.
    *   **Registration Page (`src/app/register/page.tsx`)**: UI and logic for new user sign-up, including creating a corresponding user document in Firestore.
    *   **User State Management (`src/firebase/use-user.ts`)**: A custom hook to provide the current user's authentication state across the application.
    *   **Role-based Redirection**: Logic to redirect users to the correct dashboard (e.g., `/admin` or `/dashboard`) based on their role after login.

### Task 4: Develop Core Feature Pages (5 Marks)
*   **Objective**: Build the primary feature pages with placeholder data and UI components, ready for full functionality integration.
*   **Key Components**:
    *   **Main Dashboard (`src/app/dashboard/page.tsx`)**: Role-based landing page with quick-access links.
    *   **LegalAI Chat (`src/app/dashboard/case-management/page.tsx`)**: The primary conversational interface.
    *   **Document Review (`src/app/dashboard/document-review/page.tsx`)**: File upload and analysis interface.
    *   **Admin User Management (`src/app/admin/users/page.tsx`)**: Real-time table for viewing and managing users from Firestore.

---

## 2. Evaluation Criteria

Each task will be evaluated based on the following criteria, with each criterion worth 5 marks.

### 1. Feature Completion
*   **5 Marks (Excellent)**: All key components of the task are fully implemented and functional as per the objectives. The structure is complete and ready for further development.
*   **3 Marks (Good)**: Most key components are implemented, but some minor parts are missing or incomplete. The core structure is present.
*   **1 Mark (Needs Improvement)**: Significant parts of the task are missing. The structure is incomplete and not ready for the next phase.

### 2. Integration of Components
*   **5 Marks (Excellent)**: All components (UI, backend, services) are seamlessly integrated. Data flows correctly between the frontend and backend. Hooks and providers are used effectively.
*   **3 Marks (Good)**: Components are mostly integrated, but there are some minor issues with data flow or state management.
*   **1 Mark (Needs Improvement)**: Components are poorly integrated, leading to crashes, data inconsistencies, or a non-functional UI.

### 3. Innovation & Tech Use
*   **5 Marks (Excellent)**: The project effectively uses modern technologies and best practices (Next.js App Router, Server Components, Genkit, custom hooks). The architecture is clean, scalable, and forward-thinking.
*   **3 Marks (Good)**: The project uses the specified technologies, but the implementation could be cleaner or more efficient. Some legacy patterns might be present.
*   **1 Mark (Needs Improvement)**: The technology stack is not used correctly, or the architecture is outdated and difficult to maintain.

### 4. Usability & Functionality
*   **5 Marks (Excellent)**: The user interface is intuitive, responsive, and error-free. All interactive elements work as expected. The application provides a smooth and professional user experience.
*   **3 Marks (Good)**: The application is functional, but there are some minor UI/UX issues, such as non-responsive elements or confusing navigation.
*   **1 Mark (Needs Improvement)**: The application is difficult to use, buggy, or non-functional. Core features are broken or inaccessible.
