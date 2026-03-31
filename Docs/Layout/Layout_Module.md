# Layout Module

## Overview

The Layout Module provides the main application shell including sidebar navigation, topbar header, and mobile-responsive navigation. It creates a consistent layout across all authenticated pages.

## Files

| File | Purpose |
|------|---------|
| [`src/components/layout/AppLayout.tsx`](../../src/components/layout/AppLayout.tsx:1) | Main layout wrapper |
| [`src/components/layout/AppSidebar.tsx`](../../src/components/layout/AppSidebar.tsx:1) | Sidebar navigation |
| [`src/components/layout/Topbar.tsx`](../../src/components/layout/Topbar.tsx:1) | Top header bar |
| [`src/components/layout/MobileNav.tsx`](../../src/components/layout/MobileNav.tsx:1) | Mobile bottom navigation |

---

## AppLayout Component

### [`AppLayout.tsx`](../../src/components/layout/AppLayout.tsx:1)

**Purpose**: Main layout wrapper that structures the application with sidebar, header, and main content area.

### Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│                    Application Layout                      │
├────────────┬─────────────────────────────────────────────┤
│            │                   Topbar                    │
│            ├─────────────────────────────────────────────┤
│  Sidebar   │                                             │
│            │                                             │
│  ┌──────┐ │              Main Content                   │
│  │ Logo │ │              (Outlet)                        │
│  ├──────┤ │                                             │
│  │ Nav  │ │                                             │
│  │ Items│ │                                             │
│  │      │ │                                             │
│  ├──────┤ │                                             │
│  │Logout│ │                                             │
│  └──────┘ │                                             │
├────────────┴─────────────────────────────────────────────┤
│                   MobileNav (Fixed Bottom)                │
└──────────────────────────────────────────────────────────┘
```

### Responsive Behavior

| Breakpoint | Sidebar | Content Margin | Mobile Nav |
|------------|---------|----------------|------------|
| < 768px (Mobile) | Hidden | 0px | Visible |
| ≥ 768px (Tablet+) | Visible | 250px (250px or 68px collapsed) | Hidden |

### Code Structure

```typescript
const AppLayout = () => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        "md:ml-[250px]",  // Desktop: margin for sidebar
        sidebarCollapsed && "md:ml-[68px]"  // Collapsed sidebar
      )}>
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
```

### Key Points

1. **Sidebar Fixed**: Always visible on desktop, hidden on mobile
2. **Content Margin**: Adapts to sidebar width (collapsed/expanded)
3. **Mobile Bottom Nav**: Fixed at bottom on mobile devices
4. **Smooth Transitions**: CSS transitions for layout changes
5. **Outlet Pattern**: Uses React Router's `<Outlet>` for nested routes

---

## AppSidebar Component

### [`AppSidebar.tsx`](../../src/components/layout/AppSidebar.tsx:1)

**Purpose**: Navigation sidebar with role-based menu items and collapse functionality.

### Visual Design

```
┌─────────────────────────────┐
│  ┌───┐                      │
│  │ E │ EMS                  │  ← Logo
├──┴───┴──────────────────────┤
│  OVERVIEW                   │  ← Group Label
│  ┌─────────────────────────┐│
│  │ Dashboard               ││  ← Nav Item (Active)
│  └─────────────────────────┘│
│  PEOPLE                     │
│  ┌─────────────────────────┐│
│  │ Employees               ││
│  │ Departments             ││
│  └─────────────────────────┘│
│  TIME & LEAVE              │
│  ┌─────────────────────────┐│
│  │ Attendance              ││
│  │ Leaves                  ││
│  └─────────────────────────┘│
│  ...                        │
├─────────────────────────────┤
│  ┌─────────────────────────┐│
│  │ Logout                  ││
│  └─────────────────────────┘│
│  [ < ]                      │  ← Collapse Button
└─────────────────────────────┘
```

### Expanded vs Collapsed State

| State | Width | Labels | Icons |
|-------|-------|--------|-------|
| Expanded | 250px | Visible | + Text |
| Collapsed | 68px | Hidden | Icons only |

### Navigation Groups

```typescript
const navigationConfig: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', path: '/', icon: 'LayoutDashboard', roles: [...] },
    ],
  },
  {
    label: 'People',
    items: [
      { title: 'Employees', path: '/employees', icon: 'Users', roles: [...] },
      { title: 'Departments', path: '/departments', icon: 'Building2', roles: [...] },
    ],
  },
  // ... more groups
];
```

### Role-Based Filtering

```typescript
const navGroups = getNavForRole(user.role);
// Filters items based on user's role
```

### Icon Mapping

```typescript
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard, Users, Building2, Clock, CalendarDays,
  Wallet, TrendingUp, BarChart3, Shield,
};
```

### Active Route Detection

```typescript
const active = location.pathname === item.path || 
               (item.path !== '/' && location.pathname.startsWith(item.path));
```

### Code Structure

```typescript
const AppSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const navGroups = getNavForRole(user.role);

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen glass-sidebar z-40 transition-all duration-300",
      sidebarCollapsed ? "w-[68px]" : "w-[250px]"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center border-b px-4">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          E
        </div>
        {!sidebarCollapsed && <span className="ml-3 font-bold">EMS</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <p className="text-[11px] uppercase font-semibold tracking-wider mb-2 px-3">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link key={item.path} to={item.path}
                      className={cn(active && "bg-sidebar-primary text-sidebar-primary-foreground")}>
                  <Icon className="w-[18px] h-[18px]" />
                  {!sidebarCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-2">
        <button onClick={logout}>
          <LogOut className="w-[18px] h-[18px]" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
        <button onClick={toggleSidebar}>
          <ChevronLeft className={cn(sidebarCollapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
};
```

---

## Topbar Component

### [`Topbar.tsx`](../../src/components/layout/Topbar.tsx:1)

**Purpose**: Header bar with search, theme toggle, notifications, and user info.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [☰]  [🔍 Search............................]    [🌙/☀️] [🔔]  [👤 JD] │
└─────────────────────────────────────────────────────────────────────────┘
                                                          User Avatar  User Info
```

### Features

1. **Mobile Menu Toggle**: Hamburger menu button (visible only on mobile)
2. **Search**: Global search input (hidden on small screens)
3. **Theme Toggle**: Switch between light/dark mode
4. **Notifications**: Bell icon with notification indicator
5. **User Info**: Avatar with name and role

### Code Structure

```typescript
const Topbar = () => {
  const { user } = useAuthStore();
  const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input placeholder="Search..." className="pl-9 w-64 bg-muted/50 border-0 h-9" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
```

### Sticky Behavior
- Topbar uses `position: sticky` and `top-0` to remain visible when scrolling

---

## MobileNav Component

### [`MobileNav.tsx`](../../src/components/layout/MobileNav.tsx:1)

**Purpose**: Bottom navigation bar for mobile devices.

### Visual Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      Main Content Area                                   │
│                                                                         │
│                                                                         │
│                                                                         │
├─────────┬─────────────┬─────────────┬─────────────┬─────────────────────┤
│    🏠   │      👥     │      🕐     │      📅     │         📊         │
│ Dashboard│  Employees  │ Attendance  │    Leaves   │    Performance      │
└─────────┴─────────────┴─────────────┴─────────────┴─────────────────────┘
                              Mobile Navigation
```

### Responsive Visibility

| Device | Sidebar | Topbar | MobileNav |
|--------|---------|--------|-----------|
| Mobile (<768px) | Hidden | Visible | Visible (fixed bottom) |
| Tablet/Desktop (≥768px) | Visible | Visible | Hidden |

---

## State Dependencies

| Component | Store | State Used |
|-----------|-------|------------|
| AppSidebar | `authStore` | `user`, `logout` |
| AppSidebar | `uiStore` | `sidebarCollapsed`, `toggleSidebar` |
| AppLayout | `uiStore` | `sidebarCollapsed` |
| Topbar | `authStore` | `user` |
| Topbar | `uiStore` | `darkMode`, `toggleDarkMode`, `toggleSidebar` |

---

## Styling

### Glass Effect
Uses `glass-sidebar` class for frosted glass effect:
```css
.glass-sidebar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradients
Primary gradient for logo and accents:
```css
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Authentication Module](../Authentication/Authentication_Module.md)
- [Navigation Module](../Foundation/Navigation_Module.md)
- [Stores Module](../Foundation/Stores_Module.md)

---

*Last Updated: 2026-03-31*
