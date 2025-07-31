# Guía de Estilo de Código - Sistema de Gestión Agrícola

## Filosofía de Desarrollo

### Principios Fundamentales

1. **Código Limpio**: El código debe ser fácil de leer y entender
2. **Consistencia**: Mantener patrones uniformes en todo el proyecto
3. **Componentización**: Dividir la UI en componentes reutilizables
4. **Documentación**: Comentar el "por qué", no el "qué"
5. **Testing**: Cada componente debe ser testeable

### Arquitectura de Componentes

```
Smart Components (Container)
├── Manejo de estado
├── Lógica de negocio
├── Llamadas a APIs
└── Coordinación de componentes

Dumb Components (Presentational)
├── Solo presentación
├── Props como entrada
├── Callbacks para eventos
└── Sin estado complejo
```

## Convenciones de Naming

### Archivos y Carpetas

```javascript
// Componentes React: PascalCase
Dashboard.jsx;
UserProfile.jsx;
StatsCard.jsx;

// Servicios y utilidades: camelCase
api.js;
dateUtils.js;
validators.js;

// Carpetas: kebab-case o camelCase
components / user -
  profile /
    userManagement /
    // Archivos de test: .test.jsx o .spec.jsx
    Dashboard.test.jsx;
api.spec.js;
```

### Variables y Funciones

```javascript
// Variables: camelCase
const userName = "john";
const isLoggedIn = true;
const apiResponse = await fetch();

// Funciones: camelCase con verbos descriptivos
const handleSubmit = () => {};
const validateForm = () => {};
const fetchUserData = () => {};

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = "http://localhost:4000";
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 10;

// Booleanos: is/has/can/should prefixes
const isLoading = false;
const hasPermission = true;
const canEdit = user.role === "Admin";
const shouldShowModal = error && !isLoading;
```

### Componentes React

```javascript
// Props: camelCase descriptivo
<UserCard
  userData={user}
  onEdit={handleEdit}
  showActions={true}
  className="custom-style"
/>;

// Event handlers: handle + EventName
const handleClick = () => {};
const handleInputChange = () => {};
const handleFormSubmit = () => {};
const handleModalClose = () => {};

// State variables: descriptivo + set + Name
const [users, setUsers] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({});
const [selectedItem, setSelectedItem] = useState(null);
```

## Estructura de Componentes

### Template Básico

```javascript
/**
 * Brief description of component purpose
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 * @param {function} props.onAction - Callback for actions
 */
import React, { useState, useEffect } from "react";
import { SomeIcon } from "lucide-react";

function ComponentName({ title, onAction }) {
  // 1. State declarations
  const [localState, setLocalState] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  // 2. Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // 3. Event handlers
  const handleSomeEvent = (event) => {
    // Handle logic
  };

  // 4. Computed values
  const computedValue = useMemo(() => {
    return expensiveCalculation(localState);
  }, [localState]);

  // 5. Early returns (loading, error states)
  if (loading) return <div>Loading...</div>;

  // 6. Main render
  return (
    <div className="component-container">{/* JSX with clear structure */}</div>
  );
}

export default ComponentName;
```

### Props Destructuring

```javascript
// ✓ GOOD: Destructure props in function signature
function UserCard({ user, onEdit, onDelete, showActions = true }) {
  return (
    <div>
      <h3>{user.name}</h3>
      {showActions && (
        <div>
          <button onClick={() => onEdit(user)}>Edit</button>
          <button onClick={() => onDelete(user.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

// ✗ BAD: Don't destructure inside component
function UserCard(props) {
  const { user, onEdit, onDelete, showActions } = props;
  // ...
}
```

### PropTypes y Default Props

```javascript
import PropTypes from "prop-types";

function ComponentName({ title, items, onAction, variant = "primary" }) {
  // Component logic
}

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  onAction: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
};

ComponentName.defaultProps = {
  items: [],
  variant: "primary",
};
```

## Gestión de Estado

### useState Patterns

```javascript
// ✓ GOOD: Separate concerns
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// ✓ GOOD: Complex state with useReducer
const [state, dispatch] = useReducer(reducer, {
  users: [],
  loading: false,
  error: null,
});

// ✗ BAD: Monolithic state object with useState
const [state, setState] = useState({
  users: [],
  loading: false,
  error: null,
  formData: {},
  selectedId: null,
});
```

### State Updates

```javascript
// ✓ GOOD: Functional updates for dependent state
setCount((prevCount) => prevCount + 1);

// ✓ GOOD: Object spread for partial updates
setFormData((prev) => ({
  ...prev,
  [fieldName]: value,
}));

// ✓ GOOD: Array operations
setItems((prev) => [...prev, newItem]); // Add
setItems((prev) => prev.filter((item) => item.id !== id)); // Remove
setItems((prev) =>
  prev.map((item) => (item.id === targetId ? { ...item, ...updates } : item))
); // Update

// ✗ BAD: Direct mutation
items.push(newItem); // Mutates array
item.property = newValue; // Mutates object
```

## JSX Patterns

### Conditional Rendering

```javascript
// ✓ GOOD: Short-circuit evaluation for simple conditions
{
  isLoading && <Spinner />;
}
{
  error && <ErrorMessage error={error} />;
}
{
  items.length > 0 && <ItemList items={items} />;
}

// ✓ GOOD: Ternary for if-else
{
  user ? <UserProfile user={user} /> : <LoginForm />;
}

// ✓ GOOD: Early return for complex conditions
if (!user) {
  return <div>Please log in</div>;
}

// ✗ BAD: Ternary with null
{
  condition ? <Component /> : null;
} // Use && instead
```

### List Rendering

```javascript
// ✓ GOOD: Proper key usage
{
  users.map((user) => <UserCard key={user.id} user={user} />);
}

// ✓ GOOD: Index as key only for static lists
{
  staticItems.map((item, index) => <div key={index}>{item}</div>);
}

// ✗ BAD: Index as key for dynamic lists
{
  users.map((user, index) => (
    <UserCard key={index} user={user} /> // Causes re-render issues
  ));
}
```

### Event Handlers in JSX

```javascript
// ✓ GOOD: Pre-defined handlers
const handleEdit = (user) => {
  // Logic here
};

<button onClick={() => handleEdit(user)}>Edit</button>

// ✓ GOOD: Simple inline handlers
<input onChange={(e) => setSearchTerm(e.target.value)} />

// ✗ BAD: Complex logic inline
<button onClick={() => {
  // 10+ lines of logic
  // This should be extracted
}}>
  Submit
</button>
```

## Styling con Tailwind CSS

### Class Organization

```javascript
// ✓ GOOD: Logical grouping of classes
<div className="
  flex items-center justify-between
  px-4 py-2
  bg-white border border-gray-200 rounded-lg
  hover:shadow-md transition-shadow duration-200
">

// ✓ GOOD: Conditional classes with clsx/classnames
import clsx from 'clsx';

<button className={clsx(
  'px-4 py-2 rounded font-medium transition-colors',
  variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
  variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  disabled && 'opacity-50 cursor-not-allowed'
)}>
```

### Responsive Design

```javascript
// ✓ GOOD: Mobile-first approach
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">

// ✓ GOOD: Consistent spacing scale
<div className="space-y-4 md:space-y-6 lg:space-y-8">

// ✓ GOOD: Responsive padding/margins
<div className="px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
```

### Component-Specific Styles

```javascript
// ✓ GOOD: Style variants as props
function Button({ variant = "primary", size = "md", children, ...props }) {
  const baseClasses =
    "font-medium rounded transition-colors focus:outline-none focus:ring-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## API Integration Patterns

### Service Layer

```javascript
// ✓ GOOD: Centralized API configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  retries: 3,
};

// ✓ GOOD: Consistent error handling
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
}

// ✓ GOOD: Resource-specific functions
export const userAPI = {
  getAll: (token) =>
    apiRequest("/users", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  create: (userData, token) =>
    apiRequest("/users", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(userData),
    }),

  update: (id, userData, token) =>
    apiRequest(`/users/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(userData),
    }),

  delete: (id, token) =>
    apiRequest(`/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
```

### Custom Hooks para API

```javascript
// ✓ GOOD: Reusable data fetching hook
function useApiData(endpoint, token, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiRequest(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchData();
    }
  }, [endpoint, token, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
}

// Usage
function UsersList({ token }) {
  const { data: users, loading, error, refetch } = useApiData("/users", token);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## Error Handling

### Component Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Oops! Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
          <button onClick={() => window.location.reload()}>Reload page</button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling

```javascript
// ✓ GOOD: Comprehensive error handling
async function handleFormSubmit(formData) {
  setLoading(true);
  setError(null);

  try {
    const result = await api.createUser(formData, token);

    if (result.error) {
      // Server returned error in response
      setError(result.error);
      return;
    }

    // Success
    setUsers((prev) => [...prev, result]);
    setForm(initialFormState);
    onSuccess?.(result);
  } catch (error) {
    // Network or other errors
    if (error.name === "AbortError") {
      // Request was cancelled
      return;
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
}
```

## Performance Best Practices

### Memoization

```javascript
// ✓ GOOD: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return items
    .filter((item) => item.category === selectedCategory)
    .sort((a, b) => b.date - a.date)
    .slice(0, 10);
}, [items, selectedCategory]);

// ✓ GOOD: Memoize callback functions
const handleItemClick = useCallback(
  (item) => {
    onItemSelect(item);
    analytics.track("item_clicked", { itemId: item.id });
  },
  [onItemSelect]
);

// ✓ GOOD: Memoize components
const MemoizedItemCard = React.memo(function ItemCard({ item, onEdit }) {
  return (
    <div className="item-card">
      <h3>{item.title}</h3>
      <button onClick={() => onEdit(item)}>Edit</button>
    </div>
  );
});
```

### Lazy Loading

```javascript
// ✓ GOOD: Code splitting with lazy loading
const HeavyReportPage = React.lazy(() => import("./pages/HeavyReportPage"));
const UserManagement = React.lazy(() => import("./pages/UserManagement"));

function App() {
  return (
    <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
      <Routes>
        <Route path="/reports" element={<HeavyReportPage />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Suspense>
  );
}

// ✓ GOOD: Image lazy loading
function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
```

## Testing Guidelines

### Component Testing

```javascript
// ✓ GOOD: Testing user interactions
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("UserForm", () => {
  const mockProps = {
    onSubmit: jest.fn(),
    initialData: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits form with correct data", async () => {
    const user = userEvent.setup();
    render(<UserForm {...mockProps} />);

    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
      });
    });
  });

  test("displays validation errors", async () => {
    const user = userEvent.setup();
    render(<UserForm {...mockProps} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });
});
```

### Mock Patterns

```javascript
// ✓ GOOD: Mock external dependencies
jest.mock("../services/api", () => ({
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

// ✓ GOOD: Test custom hooks
import { renderHook, act } from "@testing-library/react";
import { useUsers } from "../hooks/useUsers";

test("useUsers hook loads data correctly", async () => {
  const mockUsers = [{ id: 1, name: "John" }];
  api.getUsers.mockResolvedValue(mockUsers);

  const { result } = renderHook(() => useUsers("mock-token"));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual(mockUsers);
  });
});
```

## Documentación

### JSDoc Standards

```javascript
/**
 * UserCard component displays user information in a card format
 *
 * Features:
 * - Shows avatar, name, and role
 * - Provides edit/delete actions for admins
 * - Responsive design for mobile and desktop
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - User object to display
 * @param {string} props.user.id - Unique user identifier
 * @param {string} props.user.name - User's full name
 * @param {string} props.user.email - User's email address
 * @param {string} props.user.role - User's role (Admin/User)
 * @param {function} props.onEdit - Callback when edit button is clicked
 * @param {function} props.onDelete - Callback when delete button is clicked
 * @param {boolean} [props.showActions=true] - Whether to show action buttons
 * @param {string} [props.className] - Additional CSS classes
 *
 * @returns {JSX.Element} Rendered user card component
 *
 * @example
 * const user = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' };
 *
 * <UserCard
 *   user={user}
 *   onEdit={(user) => setEditingUser(user)}
 *   onDelete={(userId) => handleDelete(userId)}
 *   showActions={currentUser.role === 'Admin'}
 * />
 */
function UserCard({
  user,
  onEdit,
  onDelete,
  showActions = true,
  className = "",
}) {
  // Component implementation
}
```

### README Structure

````markdown
# Component Name

Brief description of the component's purpose.

## Usage

```jsx
import ComponentName from "./ComponentName";

<ComponentName prop1="value" prop2={callback} />;
```
````

## Props

| Prop  | Type     | Required | Default | Description          |
| ----- | -------- | -------- | ------- | -------------------- |
| prop1 | string   | Yes      | -       | Description of prop1 |
| prop2 | function | Yes      | -       | Description of prop2 |
| prop3 | boolean  | No       | false   | Description of prop3 |

## Examples

### Basic Usage

```jsx
<ComponentName prop1="basic" prop2={handleAction} />
```

### Advanced Usage

```jsx
<ComponentName
  prop1="advanced"
  prop2={handleAction}
  prop3={true}
  className="custom-styles"
/>
```

## Notes

- Important implementation details
- Browser compatibility notes
- Performance considerations

```

## Code Review Checklist

### Before Submitting PR

- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Code follows style guide
- [ ] Components are properly documented
- [ ] No unused imports or variables
- [ ] Responsive design tested
- [ ] Accessibility considerations addressed
- [ ] Performance impact considered

### Reviewer Guidelines

- [ ] Code is readable and well-structured
- [ ] Logic is sound and efficient
- [ ] Error handling is appropriate
- [ ] Tests cover edge cases
- [ ] Documentation is accurate
- [ ] No security vulnerabilities
- [ ] Follows project conventions
```
