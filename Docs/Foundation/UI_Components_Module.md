# UI Components Module

## Overview

The UI Components Module provides a comprehensive set of reusable UI components built on top of Radix UI primitives and styled with Tailwind CSS. These are Shadcn UI components customized for the application.

## Components

### Core Components

| Component | File | Description |
|-----------|------|-------------|
| Button | [`button.tsx`](../../src/components/ui/button.tsx:1) | Interactive button with variants |
| Input | [`input.tsx`](../../src/components/ui/input.tsx:1) | Text input field |
| Label | [`label.tsx`](../../src/components/ui/label.tsx:1) | Form label |
| Textarea | [`textarea.tsx`](../../src/components/ui/textarea.tsx:1) | Multi-line text input |

### Form Components

| Component | File | Description |
|-----------|------|-------------|
| Select | [`select.tsx`](../../src/components/ui/select.tsx:1) | Dropdown select |
| Checkbox | [`checkbox.tsx`](../../src/components/ui/checkbox.tsx:1) | Checkbox input |
| Radio Group | [`radio-group.tsx`](../../src/components/ui/radio-group.tsx:1) | Radio button group |
| Switch | [`switch.tsx`](../../src/components/ui/switch.tsx:1) | Toggle switch |
| Form | [`form.tsx`](../../src/components/ui/form.tsx:1) | React Hook Form wrapper |

### Layout Components

| Component | File | Description |
|-----------|------|-------------|
| Card | [`card.tsx`](../../src/components/ui/card.tsx:1) | Card container |
| Dialog | [`dialog.tsx`](../../src/components/ui/dialog.tsx:1) | Modal dialog |
| Sheet | [`sheet.tsx`](../../src/components/ui/sheet.tsx:1) | Side panel/drawer |
| Alert Dialog | [`alert-dialog.tsx`](../../src/components/ui/alert-dialog.tsx:1) | Alert confirmation |
| Resizable | [`resizable.tsx`](../../src/components/ui/resizable.tsx:1) | Resizable panels |
| Separator | [`separator.tsx`](../../src/components/ui/separator.tsx:1) | Horizontal/vertical divider |
| Scroll Area | [`scroll-area.tsx`](../../src/components/ui/scroll-area.tsx:1) | Custom scrollbar |

### Navigation Components

| Component | File | Description |
|-----------|------|-------------|
| Tabs | [`tabs.tsx`](../../src/components/ui/tabs.tsx:1) | Tabbed interface |
| Navigation Menu | [`navigation-menu.tsx`](../../src/components/ui/navigation-menu.tsx:1) | Navigation menu |
| Breadcrumb | [`breadcrumb.tsx`](../../src/components/ui/breadcrumb.tsx:1) | Breadcrumb navigation |
| Menubar | [`menubar.tsx`](../../src/components/ui/menubar.tsx:1) | Menu bar |
| Tooltip | [`tooltip.tsx`](../../src/components/ui/tooltip.tsx:1) | Hover tooltip |

### Data Display Components

| Component | File | Description |
|-----------|------|-------------|
| Table | [`table.tsx`](../../src/components/ui/table.tsx:1) | Data table |
| Badge | [`badge.tsx`](../../src/components/ui/badge.tsx:1) | Status badge |
| Avatar | [`avatar.tsx`](../../src/components/ui/avatar.tsx:1) | User avatar |
| Progress | [`progress.tsx`](../../src/components/ui/progress.tsx:1) | Progress bar |
| Skeleton | [`skeleton.tsx`](../../src/components/ui/skeleton.tsx:1) | Loading placeholder |
| Aspect Ratio | [`aspect-ratio.tsx`](../../src/components/ui/aspect-ratio.tsx:1) | Aspect ratio container |

### Feedback Components

| Component | File | Description |
|-----------|------|-------------|
| Toast | [`toast.tsx`](../../src/components/ui/toast.tsx:1) | Toast notification |
| Toaster | [`toaster.tsx`](../../src/components/ui/toaster.tsx:1) | Toast container |
| Sonner | [`sonner.tsx`](../../src/components/ui/sonner.tsx:1) | Sonner toast |
| Alert | [`alert.tsx`](../../src/components/ui/alert.tsx:1) | Alert message |

### Interactive Components

| Component | File | Description |
|-----------|------|-------------|
| Accordion | [`accordion.tsx`](../../src/components/ui/accordion.tsx:1) | Expandable sections |
| Collapsible | [`collapsible.tsx`](../../src/components/ui/collapsible.tsx:1) | Collapsible content |
| Toggle | [`toggle.tsx`](../../src/components/ui/toggle.tsx:1) | Toggle button |
| Toggle Group | [`toggle-group.tsx`](../../src/components/ui/toggle-group.tsx:1) | Toggle button group |
| Dropdown Menu | [`dropdown-menu.tsx`](../../src/components/ui/dropdown-menu.tsx:1) | Dropdown menu |
| Context Menu | [`context-menu.tsx`](../../src/components/ui/context-menu.tsx:1) | Right-click menu |
| Hover Card | [`hover-card.tsx`](../../src/components/ui/hover-card.tsx:1) | Hover popup card |
| Popover | [`popover.tsx`](../../src/components/ui/popover.tsx:1) | Popover panel |

### Data Visualization

| Component | File | Description |
|-----------|------|-------------|
| Chart | [`chart.tsx`](../../src/components/ui/chart.tsx:1) | Recharts wrapper |
| Calendar | [`calendar.tsx`](../../src/components/ui/calendar.tsx:1) | Date picker calendar |
| Carousel | [`carousel.tsx`](../../src/components/ui/carousel.tsx:1) | Image/content carousel |
| Slider | [`slider.tsx`](../../src/components/ui/slider.tsx:1) | Range slider |
| Input OTP | [`input-otp.tsx`](../../src/components/ui/input-otp.tsx:1) | OTP input |

### Specialized Components

| Component | File | Description |
|-----------|------|-------------|
| Sidebar | [`sidebar.tsx`](../../src/components/ui/sidebar.tsx:1) | Application sidebar |
| Command | [`command.tsx`](../../src/components/ui/command.tsx:1) | Command palette |
| Pagination | [`pagination.tsx`](../../src/components/ui/pagination.tsx:1) | Pagination controls |

---

## Button Component

### [`src/components/ui/button.tsx`](../../src/components/ui/button.tsx:1)

**Purpose**: Versatile button with multiple variants and sizes.

### Variants

```typescript
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
```

### Usage

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Code

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## Card Component

### [`src/components/ui/card.tsx`](../../src/components/ui/card.tsx:1)

**Purpose**: Container component for grouping related content.

### Sub-components

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Usage

```tsx
<Card className="glass-card border-border/50">
  <CardHeader>
    <CardTitle>Employee Details</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Employee information...</p>
  </CardContent>
</Card>
```

---

## Table Component

### [`src/components/ui/table.tsx`](../../src/components/ui/table.tsx:1)

**Purpose**: Data table with header, body, and row components.

### Sub-components

```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Usage

```tsx
<Table>
  <TableHeader>
    <TableRow className="bg-muted/30">
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map(user => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell><StatusBadge status={user.status} /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Dialog Component

### [`src/components/ui/dialog.tsx`](../../src/components/ui/dialog.tsx:1)

**Purpose**: Modal dialog for forms and confirmations.

### Usage

```tsx
<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      Dialog content
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
      <Button onClick={handleSubmit}>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Sub-components

| Component | Purpose |
|-----------|---------|
| `Dialog` | Root dialog component |
| `DialogTrigger` | Button that opens dialog |
| `DialogContent` | Dialog content container |
| `DialogHeader` | Dialog header |
| `DialogTitle` | Dialog title |
| `DialogDescription` | Dialog description |
| `DialogFooter` | Dialog footer with actions |
| `DialogClose` | Close button |

---

## Toast Components

### [`src/components/ui/toast.tsx`](../../src/components/ui/toast.tsx:1)
### [`src/hooks/use-toast.ts`](../../src/hooks/use-toast.ts:1)

**Purpose**: Toast notifications for user feedback.

### Usage

```tsx
import { useToast } from '@/hooks/use-toast';

const MyComponent = () => {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({ title: 'Success', description: 'Operation completed!' });
  };

  const handleError = () => {
    toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
  };

  return (
    <Button onClick={handleSuccess}>Success</Button>
    <Button onClick={handleError} variant="destructive">Error</Button>
  );
};
```

### Toast Types

| Type | Variant | Description |
|------|---------|-------------|
| Default | `default` | Info toast (blue) |
| Success | `default` | Success message |
| Warning | `default` | Warning message |
| Error | `destructive` | Error/destructive action |

---

## Input Component

### [`src/components/ui/input.tsx`](../../src/components/ui/input.tsx:1)

**Purpose**: Text input field.

### Usage

```tsx
<Input type="text" placeholder="Enter name" />
<Input type="email" placeholder="Enter email" />
<Input type="password" placeholder="Enter password" />
<Input type="date" />
<Input disabled placeholder="Disabled" />
```

---

## Select Component

### [`src/components/ui/select.tsx`](../../src/components/ui/select.tsx:1)

**Purpose**: Dropdown select input.

### Usage

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
    <SelectItem value="3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Sub-components

| Component | Purpose |
|-----------|---------|
| `Select` | Root select component |
| `SelectTrigger` | Select button/trigger |
| `SelectValue` | Display selected value |
| `SelectContent` | Dropdown content |
| `SelectItem` | Individual option |
| `SelectGroup` | Group options |
| `SelectLabel` | Group label |

---

## Badge Component

### [`src/components/ui/badge.tsx`](../../src/components/ui/badge.tsx:1)

**Purpose**: Small status indicator or label.

### Variants

```typescript
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
```

### Usage

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## Progress Component

### [`src/components/ui/progress.tsx`](../../src/components/ui/progress.tsx:1)

**Purpose**: Progress bar indicator.

### Usage

```tsx
<Progress value={75} className="h-2" />
```

---

## Calendar Component

### [`src/components/ui/calendar.tsx`](../../src/components/ui/calendar.tsx:1)

**Purpose**: Date picker calendar (React Day Picker wrapper).

### Usage

```tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

---

## Sidebar Component

### [`src/components/ui/sidebar.tsx`](../../src/components/ui/sidebar.tsx:1)

**Purpose**: Collapsible sidebar (Radix UI Sheet + custom).

### Features

- Glass morphism effect
- Smooth transitions
- Responsive (drawer on mobile)

---

## Chart Component

### [`src/components/ui/chart.tsx`](../../src/components/ui/chart.tsx:1)

**Purpose**: Wrapper for Recharts components.

### Exports

- `ChartContainer`
- `ChartTooltip`
- `ChartTooltipContent`

### Usage

```tsx
<ChartContainer config={chartConfig}>
  <BarChart data={data}>
    <ChartTooltip />
    <Bar dataKey="value" />
  </BarChart>
</ChartContainer>
```

---

## Related Documentation

- [Common Components Module](./Common_Components_Module.md)
- [Stores Module](./Stores_Module.md)

---

*Last Updated: 2026-03-31*
