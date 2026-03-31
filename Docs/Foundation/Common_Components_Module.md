# Common Components Module

## Overview

The Common Components Module provides reusable UI components used across multiple pages in the application. These components abstract common patterns and ensure consistency.

## Files

| File | Purpose |
|------|---------|
| [`src/components/common/PageHeader.tsx`](../../src/components/common/PageHeader.tsx:1) | Page title with description |
| [`src/components/common/StatCard.tsx`](../../src/components/common/StatCard.tsx:1) | Statistics card with icon |
| [`src/components/common/StatusBadge.tsx`](../../src/components/common/StatusBadge.tsx:1) | Status indicator badge |
| [`src/components/common/ErrorBoundary.tsx`](../../src/components/common/ErrorBoundary.tsx:1) | Error handling wrapper |
| [`src/components/NavLink.tsx`](../../src/components/NavLink.tsx:1) | Navigation link component |

---

## PageHeader Component

### [`src/components/common/PageHeader.tsx`](../../src/components/common/PageHeader.tsx:1)

**Purpose**: Displays page title, description, and action buttons in a consistent layout.

### Interface

```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}
```

### Usage

```tsx
<PageHeader 
  title="Employees" 
  description="Manage your organization's employees"
>
  <Button>Add Employee</Button>
</PageHeader>
```

### Rendered Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Employees                                      [Add Employee]    │
│ Manage your organization's employees                             │
└─────────────────────────────────────────────────────────────────┘
```

### Code

```typescript
const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
};
```

---

## StatCard Component

### [`src/components/common/StatCard.tsx`](../../src/components/common/StatCard.tsx:1)

**Purpose**: Displays a statistic with value, change indicator, and icon.

### Interface

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient?: string;
}
```

### Usage

```tsx
<StatCard 
  title="Total Employees" 
  value={150} 
  change="+4 this month"
  changeType="positive"
  icon={<Users className="w-5 h-5" />}
/>
```

### Rendered Structure

```
┌─────────────────────────────────────┐
│                                     │
│  Total Employees                    │
│  150                                │
│  +4 this month  (green)             │
│                                     │
│                              ┌──────│
│                              │  👥  │  ← Icon with gradient
│                              └──────│
└─────────────────────────────────────┘
```

### Code

```typescript
const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType = 'neutral', icon, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-xl p-5 relative overflow-hidden group hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={cn(
              "text-xs font-medium",
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-destructive',
              changeType === 'neutral' && 'text-muted-foreground',
            )}>
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          "w-11 h-11 rounded-lg flex items-center justify-center text-white shrink-0",
          gradient || "gradient-primary"
        )}>
          {icon}
        </div>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity gradient-primary rounded-xl" />
    </motion.div>
  );
};
```

### Gradient Classes

| Class | Description |
|-------|-------------|
| `gradient-primary` | Purple gradient (default) |
| `gradient-success` | Green gradient |
| `gradient-warning` | Yellow/Orange gradient |
| `gradient-info` | Blue gradient |

---

## StatusBadge Component

### [`src/components/common/StatusBadge.tsx`](../../src/components/common/StatusBadge.tsx:1)

**Purpose**: Displays status indicators with appropriate colors and styling.

### Interface

```typescript
export type StatusType = 'Active' | 'Inactive' | 'OnLeave' | 'Present' | 'Absent' | 'Late' | 'HalfDay' | 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Processed' | 'Paid' | 'NotStarted' | 'InProgress' | 'Completed';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}
```

### Status Styles

```typescript
const statusStyles: Record<StatusType, string> = {
  Active: 'bg-success/10 text-success border-success/20',
  Inactive: 'bg-muted text-muted-foreground border-muted',
  OnLeave: 'bg-warning/10 text-warning border-warning/20',
  Present: 'bg-success/10 text-success border-success/20',
  Absent: 'bg-destructive/10 text-destructive border-destructive/20',
  Late: 'bg-warning/10 text-warning border-warning/20',
  HalfDay: 'bg-info/10 text-info border-info/20',
  Pending: 'bg-warning/10 text-warning border-warning/20',
  Approved: 'bg-success/10 text-success border-success/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  Draft: 'bg-muted text-muted-foreground border-muted',
  Processed: 'bg-info/10 text-info border-info/20',
  Paid: 'bg-success/10 text-success border-success/20',
  NotStarted: 'bg-muted text-muted-foreground border-muted',
  InProgress: 'bg-info/10 text-info border-info/20',
  Completed: 'bg-success/10 text-success border-success/20',
};
```

### Usage

```tsx
<StatusBadge status="Active" />
<StatusBadge status="Pending" />
<StatusBadge status="Approved" />
```

### Rendered Output

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Active         │ │ Pending        │ │ Approved       │
└────────────────┘ └────────────────┘ └────────────────┘
     Green            Yellow            Green
```

### Code

```typescript
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const label = status.replace(/([A-Z])/g, ' $1').trim();
  return (
    <Badge variant="outline" className={cn('font-medium text-xs border', statusStyles[status], className)}>
      {label}
    </Badge>
  );
};
```

---

## ErrorBoundary Component

### [`src/components/common/ErrorBoundary.tsx`](../../src/components/common/ErrorBoundary.tsx:1)

**Purpose**: Catches JavaScript errors in child components and displays a fallback UI.

### Interface

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

### Default Fallback

```tsx
<div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
  <AlertCircle className="w-12 h-12 text-destructive mb-4" />
  <h2 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h2>
  <p className="text-sm text-muted-foreground mb-4">
    An error occurred. Please refresh the page or contact support.
  </p>
  <Button onClick={() => window.location.reload()}>
    Refresh Page
  </Button>
</div>
```

### Usage

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Code

```typescript
class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultFallback />;
    }
    return this.props.children;
  }
}
```

---

## NavLink Component

### [`src/components/NavLink.tsx`](../../src/components/NavLink.tsx:1)

**Purpose**: Wrapper around React Router's Link component for consistent navigation styling.

### Interface

```typescript
interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  active?: boolean;
}
```

### Usage

```tsx
<NavLink to="/employees" active={true}>
  <Users className="w-5 h-5" />
  <span>Employees</span>
</NavLink>
```

### Code

```typescript
const NavLink: React.FC<NavLinkProps> = ({ to, active, children, className, ...props }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
```

---

## Related Documentation

- [Layout Module](../Layout/Layout_Module.md)
- [Dashboard Module](../Dashboard/Dashboard_Module.md)
- [UI Components Module](./UI_Components_Module.md)

---

*Last Updated: 2026-03-31*
