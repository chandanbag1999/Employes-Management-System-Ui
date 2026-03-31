# Performance Module

## Overview

The Performance Module handles employee performance tracking including goal setting, progress tracking, and performance reviews with ratings.

## Files

| File | Purpose |
|------|---------|
| [`src/pages/PerformancePage.tsx`](../../src/pages/PerformancePage.tsx:1) | Main performance management page |
| [`src/services/performanceService.ts`](../../src/services/performanceService.ts:1) | Performance API service |

---

## PerformancePage Component

### [`PerformancePage.tsx`](../../src/pages/PerformancePage.tsx:1)

**Purpose**: Main performance management page with goals and reviews sections.

### Page Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Performance                                           [New Goal]       │
│  Track goals, reviews, and growth.                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  Goals                                                                    │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐│
│  │ 🎯 Complete API Integration     │ │ 🎯 Improve Code Quality         ││
│  │   75% progress                 │ │   50% progress                 ││
│  │   ████████████░░░░░░░░          │ │   ██████████░░░░░░░░░░          ││
│  │   Due: Apr 15, 2026            │ │   Due: May 1, 2026             ││
│  └─────────────────────────────────┘ └─────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────────┤
│  Reviews                                                                   │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ John Doe — Q1 2026                              ⭐ 4.5  [Completed]│ │
│  │ Reviewed by: Jane Smith                                          │ │
│  │ Excellent performance with strong technical skills...              │ │
│  │ ┌───────────────────────────────────────────────────────────────┐ │ │
│  │ │ Self Assessment                                               │ │ │
│  │ │ Met all quarterly targets and contributed to team success...   │ │ │
│  │ └───────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features

1. **Goals Section**: Display employee goals with progress bars
2. **Reviews Section**: Display performance reviews with ratings
3. **New Goal Button**: Create new performance goals
4. **Progress Tracking**: Visual progress indicators
5. **Rating Display**: Star ratings for reviews

### State Management

```typescript
const [goals, setGoals] = useState<GoalResponseDto[]>([]);
const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
const [loading, setLoading] = useState(true);
```

### Data Fetching

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [goalsData, reviewsData] = await Promise.all([
        performanceService.getGoals({ page: 1, pageSize: 50 }),
        performanceService.getReviews({ page: 1, pageSize: 50 })
      ]);
      setGoals(goalsData.data || []);
      setReviews(reviewsData.data || []);
    } catch (err) {
      console.error('Error fetching performance data:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Goals Display

```typescript
{goals.map(goal => (
  <Card key={goal.id} className="glass-card border-border/50">
    <CardContent className="p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary shrink-0" />
          <h3 className="font-semibold text-sm">{goal.title}</h3>
        </div>
        <StatusBadge status={goal.status as any} />
      </div>
      <p className="text-xs text-muted-foreground">{goal.description}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{goal.progress}%</span>
        </div>
        <Progress value={goal.progress} className="h-2" />
      </div>
      <p className="text-xs text-muted-foreground">Due: {goal.dueDate}</p>
    </CardContent>
  </Card>
))}
```

### Reviews Display

```typescript
{reviews.map(review => (
  <Card key={review.id} className="glass-card border-border/50">
    <CardContent className="p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-sm">
            {review.employeeName} — {review.period}
          </h3>
          <p className="text-xs text-muted-foreground">
            Reviewed by {review.reviewerName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-warning/10">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className="text-sm font-bold text-warning">{review.rating}</span>
          </div>
          <StatusBadge status={review.status as any} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{review.comments}</p>
      {review.selfComments && (
        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium mb-1">Self Assessment</p>
          <p className="text-xs text-muted-foreground">{review.selfComments}</p>
        </div>
      )}
    </CardContent>
  </Card>
))}
```

---

## Performance Service

### [`performanceService.ts`](../../src/services/performanceService.ts:1)

**Purpose**: API methods for performance operations.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/performance/goals` | Get all goals |
| POST | `/performance/goals` | Create new goal |
| PUT | `/performance/goals/:id` | Update goal progress |
| GET | `/performance/reviews` | Get all reviews |
| POST | `/performance/reviews` | Create new review |

### Service Methods

```typescript
export const performanceService = {
  // GET /api/v1/performance/goals
  getGoals: async (filter: PerformanceFilter = {}): Promise<any> => {
    const params = new URLSearchParams();
    if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const response = await api.get<ApiResponse<any>>(`/performance/goals?${params}`);
    return response.data.data;
  },

  // POST /api/v1/performance/goals
  createGoal: async (data: {
    employeeId: number;
    title: string;
    description: string;
    dueDate: string;
  }): Promise<GoalResponseDto> => {
    const response = await api.post<ApiResponse<GoalResponseDto>>('/performance/goals', data);
    return response.data.data;
  },

  // PUT /api/v1/performance/goals/:id
  updateGoalProgress: async (id: number, data: { progress: number }): Promise<GoalResponseDto> => {
    const response = await api.put<ApiResponse<GoalResponseDto>>(`/performance/goals/${id}`, data);
    return response.data.data;
  },

  // GET /api/v1/performance/reviews
  getReviews: async (filter: PerformanceFilter = {}): Promise<any> => {
    const params = new URLSearchParams();
    if (filter.employeeId) params.append('employeeId', filter.employeeId.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const response = await api.get<ApiResponse<any>>(`/performance/reviews?${params}`);
    return response.data.data;
  },

  // POST /api/v1/performance/reviews
  createReview: async (data: {
    employeeId: number;
    period: string;
    rating: number;
    comments: string;
    selfComments?: string;
  }): Promise<ReviewResponseDto> => {
    const response = await api.post<ApiResponse<ReviewResponseDto>>('/performance/reviews', data);
    return response.data.data;
  },
};
```

### Filter Types

```typescript
interface PerformanceFilter {
  employeeId?: number;
  status?: string;
  page?: number;
  pageSize?: number;
}
```

### Response Types

```typescript
interface GoalResponseDto {
  id: number;
  employeeId: number;
  title: string;
  description: string;
  progress: number;
  status: string;
  dueDate: string;
}

interface ReviewResponseDto {
  id: number;
  employeeId: number;
  employeeName: string;
  reviewerId: number;
  reviewerName: string;
  period: string;
  rating: number;
  comments: string;
  selfComments?: string;
  status: string;
  createdAt: string;
}
```

---

## Goal Status Types

| Status | Description |
|--------|-------------|
| NotStarted | Goal not yet started |
| InProgress | Goal is being worked on |
| Completed | Goal has been completed |

---

## Review Rating Scale

| Rating | Description |
|--------|-------------|
| 1.0 - 2.0 | Below Expectations |
| 2.1 - 3.0 | Meets Some Expectations |
| 3.1 - 4.0 | Meets Expectations |
| 4.1 - 5.0 | Exceeds Expectations |

---

## Related Documentation

- [Core Application Module](../Core/Core_Application_Module.md)
- [Layout Module](../Layout/Layout_Module.md)
- [Common Components Module](../Foundation/Common_Components_Module.md)
- [Services Module](../Foundation/Services_Module.md)
- [Types Module](../Foundation/Types_Module.md)

---

*Last Updated: 2026-03-31*
