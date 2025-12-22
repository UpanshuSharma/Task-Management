# Task Management Dashboard

A Task management application built with React, TypeScript, and React Router. Features a dynamic form system driven by JSON configuration with real-time validation and persistent storage.

## Table of Contents
- [Project Setup](#project-setup)
- [Component Architecture](#component-architecture)
- [Routing](#routing)
- [Dynamic Form System](#dynamic-form-system)
- [Available Scripts](#available-scripts)

---

## Project Setup

### Tech Stack
- **Frontend Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2 (Fast refresh & optimized builds)
- **Routing**: React Router 7.11 (Hash-based routing)
- **State Management**: React Context API with useReducer
- **Styling**: Pure CSS (Component-scoped CSS modules)
- **Persistence**: Browser localStorage

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

The application uses **Hash Router** for client-side routing without server configuration.

---

## Component Architecture

### High-Level Structure

```
App (Root Component)
├── NavBar (Navigation)
├── Main Content Area
│   ├── Info (Dashboard Summary)
│   ├── TaskList (Task Grid)
│   └── Router Outlet (Dynamic Routes)
└── TaskContextProvider (State Management)
```

### Core Components

#### **Context Layer** - State Management
- **TaskContext.tsx** - Global state management using React Context + useReducer
  - Manages all tasks with CRUD operations
  - Provides filtering (All, Pending, In Progress, Completed)
  - Supports sorting (By Due Date, By Title)
  - Persists data to localStorage automatically
  - **Actions**: ADD_TASK, UPDATE_TASK, DELETE_TASK, SET_FILTER, SET_SORT

#### **Common Components** - Reusable UI Components
- **NavBar.tsx** - Navigation bar with route links
- **TaskCard.tsx** - Individual task card display
  - Shows: Title, Description, Due Date, Status Badge
  - Actions: Edit button (✏️), Delete button (🗑️)
  - Color-coded borders by status (PENDING, IN_PROGRESS, COMPLETED)
- **InfoCard.tsx** - Summary card for dashboard metrics

#### **Feature Components** - Page-Level Components
- **TaskList.tsx** - Grid layout displaying all filtered tasks
- **Info.tsx** - Dashboard showing task statistics
  - Total tasks, Pending count, In Progress count, Completed count

#### **Form Components** - Dynamic Form System
- **DynamicForm.tsx** - Renders forms from JSON configuration
  - Real-time validation
  - Error handling & display
  - Success/error messages
- **FormField.tsx** - Wrapper for individual form fields
- **TextField.tsx** - Text input component (text, email, number, date)
- **SelectField.tsx** - Dropdown/select component
- **SubmitButton.tsx** - Styled submit button with hover effects
- **SubmitMessage.tsx** - Success/error message display

#### **Modal Components**
- **Modal.tsx** - Reusable modal dialog for forms

### Styling Architecture
- **Pure CSS** with BEM naming convention
- **Component-scoped CSS files**:
  - `navbar.css` - Navigation styling
  - `taskcard.css` - Task card styling (responsive, status-based colors)
  - `info.css` - Dashboard info styling
  - `modal.css` - Modal styling
  - `form.css` - Form components styling (centralized in `/form/components/styles`)

### Data Flow
```
User Interaction (UI)
    ↓
Event Handler (onChange, onBlur, onClick)
    ↓
State Update (TaskContext dispatch)
    ↓
localStorage Sync (useEffect)
    ↓
Component Re-render (React)
```

---

## Routing

### Route Configuration
Hash-based routing with 2 main routes:

```
/              → Redirects to /all-task
/#/all-task    → Display all tasks (default view)
/#/complete-task → Display completed tasks only
```

### Route Structure
```typescript
// src/routes/route.tsx
{
  path: "/",
  element: <App />,
  children: [
    {
      index: true,
      element: <Navigate to="/all-task" replace />
    },
    {
      path: "all-task",
      element: <TaskList />
    },
    {
      path: "complete-task",
      element: <TaskList />  // Same component, filtered by context
    }
  ]
}
```

### Navigation Flow
- Root (`/`) redirects to `/all-task` automatically
- Routes are nested under `<App />` component
- `<Outlet />` in App renders the active route
- NavBar handles route navigation via React Router links
- Filtering happens at the TaskContext level based on current route

---

## Dynamic Form System

### Overview
The application uses a **JSON-driven configuration approach** to generate forms dynamically. This allows form structure, validation rules, and options to be defined in configuration files without touching component code.

### Config-Driven Architecture

#### **Form Configuration** (`FormConfig.json`)
Central configuration file that defines the form structure:

```json
{
  "id": "FORM_CONFIG",
  "type": "SECTION",
  "fields": [
    {
      "id": "title",
      "label": "Title",
      "type": "text",
      "placeholder": "Enter Title",
      "metadata": {
        "validator": {
          "required": true,
          "minLength": 3,
          "maxLength": 20
        }
      }
    },
    {
      "id": "status",
      "label": "Status",
      "type": "select",
      "options": [
        { "label": "Pending", "value": "PENDING" },
        { "label": "In Progress", "value": "IN_PROGRESS" },
        { "label": "Completed", "value": "COMPLETED" }
      ],
      "metadata": {
        "validator": { "required": true }
      }
    },
    {
      "id": "dueDate",
      "type": "date",
      "label": "Due Date",
      "metadata": {
        "validator": {
          "required": true,
          "notBefore": "today"
        }
      }
    }
  ]
}
```

### Form Data Types

```typescript
// Field Type - Supported input types
type FieldType = 'text' | 'email' | 'number' | 'select' | 'date';

// Validation Rules - Comprehensive validation options
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  minDate?: string;
  maxDate?: string;
  notBefore?: string;  // 'today' - prevent past dates
  notAfter?: string;
}

// Form Data - Runtime form values
interface FormData {
  [fieldId: string]: string | number;
}
```

### Key Features

#### **1. Real-Time Validation**
- Validates on blur (when field loses focus)
- Validates on change (if field was already touched)
- Shows/hides error messages dynamically
- Visual feedback: red border on error, green border on valid

#### **2. Custom Hooks for Form Management**

**useFormState Hook**
- Manages form data, errors, and touched state
- Initializes with default values from config or passed props
- Returns setters for programmatic updates

**useValidator Hook**
- Validates individual fields based on config rules
- Supports 8+ validation types
- Returns `{ valid: boolean, message: string }`

#### **3. Dynamic Field Rendering**
- `FormField` component reads config and renders appropriate input
- `TextField` for text/email/number/date inputs
- `SelectField` for dropdown selections
- Each field can have unique validation rules

#### **4. Form Submission Flow**
```
User clicks Submit
    ↓
Validate all fields at once
    ↓
If errors exist → Show error messages & highlight fields
    ↓
If valid → Call onSubmit callback with form data
    ↓
Clear form or show success message
```

#### **5. Character Count (Text Fields)**
- Displays remaining characters for fields with `maxLength`
- Format: `Current / Max` (e.g., "15 / 100")

#### **6. Success/Error Messages**
- Displays submission status after form submit
- Auto-dismisses after 4 seconds
- Color-coded: Green for success, Red for error

### Form Integration Example

```typescript
// Usage in a component
import formConfig from '../config/FormConfig.json';
import { DynamicForm } from '../form/DynamicForm';
import { useTaskContext } from '../context/TaskContext';

function TaskFormComponent() {
  const { addTask } = useTaskContext();

  const handleFormSubmit = (data: FormData) => {
    addTask({
      title: data.title as string,
      description: data.description as string,
      status: data.status as TaskStatus,
      dueDate: data.dueDate as string
    });
  };

  return (
    <DynamicForm
      config={formConfig as FormConfig}
      onSubmit={handleFormSubmit}
      initialValues={{}}
    />
  );
}
```

### Validation Examples

```json
// Email validation
{
  "id": "email",
  "type": "email",
  "metadata": {
    "validator": {
      "required": true,
      "pattern": "email"
    }
  }
}

// Date validation - future dates only
{
  "id": "dueDate",
  "type": "date",
  "metadata": {
    "validator": {
      "required": true,
      "notBefore": "today"
    }
  }
}

// Text with length constraints
{
  "id": "title",
  "type": "text",
  "metadata": {
    "validator": {
      "required": true,
      "minLength": 3,
      "maxLength": 50
    }
  }
}
```

---

## Available Scripts

```bash
npm run dev       # Start development server with HMR
npm run build     # Build for production (TypeScript + Vite)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint on all files
```

---

## Project Structure

```
src/
├── common/                      # Reusable components
│   ├── info card/
│   │   └── InfoCard.tsx
│   ├── nav bar/
│   │   ├── NavBar.tsx
│   │   └── navbar.css
│   └── task-card/
│       ├── TaskCard.tsx
│       └── taskcard.css
├── components/                  # Feature components
│   ├── info/
│   │   ├── Info.tsx
│   │   └── info.css
│   └── tasks/
│       └── TaskList.tsx
├── config/                      # Configuration files
│   ├── FormConfig.json         # Form definition
│   └── helper.ts               # Utility functions
├── context/
│   └── TaskContext.tsx         # Global state management
├── form/                        # Form system
│   ├── DynamicForm.tsx         # Main form component
│   ├── components/
│   │   ├── fields/             # Input components
│   │   │   ├── FormField.tsx
│   │   │   ├── TextField.tsx
│   │   │   └── SelectField.tsx
│   │   ├── ui/                 # UI components
│   │   │   ├── SubmitButton.tsx
│   │   │   └── SubmitMessage.tsx
│   │   └── styles/
│   │       └── form.css        # Centralized form styles
│   └── hook/
│       ├── useValidator.ts     # Validation logic
│       └── useFormState.ts     # Form state management
├── modal/                       # Modal dialog
│   ├── Modal.tsx
│   └── modal.css
├── routes/                      # Routing configuration
│   ├── route.tsx               # Router setup
│   └── constant.ts             # Route paths
├── type/                        # TypeScript definitions
│   ├── form_type.d.ts          # Form types
│   └── task_type.ts            # Task types
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

---

## Key Features

**Task Management**
- Create, Read, Update, Delete tasks
- Filter by status (All, Pending, In Progress, Completed)
- Sort by Due Date or Title
- Persistent storage (localStorage)

**Dynamic Forms**
- JSON-driven form configuration
- 5+ field types (text, email, number, date, select)
- Real-time validation with custom rules
- Character count for text inputs
- Success/Error feedback messages

**Responsive UI**
- Pure CSS with component scoping
- Mobile-friendly grid layout
- Smooth animations and transitions
- Color-coded status indicators

**Type Safety**
- Full TypeScript support
- Strict type checking
- Comprehensive type definitions
- Type-safe state management

---

## License

MIT
