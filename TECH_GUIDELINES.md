# Technical Guidelines & Codestyle

## Tech Stack

- **Framework:** React (Latest)
- **Build Tool:** Vite
- **Language:** TypeScript (Strict Mode)
- **Styling:** Vanilla CSS (Modern features: Flexbox, Grid, CSS Variables)
- **Testing:** Jest + React Testing Library
- **Routing:** React Router

## Folder Structure

Follow this mandatory structure for all components:

```text
src/components/ComponentName/
├── component.tsx        # React component logic and structure
└── component.test.ts    # Tests for the specific component
```

Other directories:

- `src/hooks`: Custom React hooks.
- `src/api`: API service layers and data fetching logic.

## Clean Code Principles

- **DRY (Don't Repeat Yourself):** Extract common logic into hooks or utility functions.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering. Write code for readability first.
- **Single Responsibility Principle (SRP):** Each component/function should do one thing well.
- **Descriptive Naming:** Use clear, intent-revealing names for variables, functions, and components.
- **Composition over Inheritance:** Leverage React's component composition patterns.

## Testing Standards (TDD)

- All components must have a corresponding `.test.ts` file.
- Aim for high coverage of user interactions and edge cases.
- Use `screen` from `@testing-library/react` for accessible queries.
- Mock external dependencies (API calls, Routing) using Jest mocks.

## Styling Guidelines

- Use CSS Variables for the color palette, typography settings, and spacing.
- Prioritize responsive design (Mobile First).
- Use CSS Modules or standard CSS with clear naming conventions (e.g., BEM) to avoid global conflicts.
- Implement smooth transitions and hover states for all interactive elements.
