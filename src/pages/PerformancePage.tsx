import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Star, Plus } from 'lucide-react';
import { performanceService } from '@/services';
import type { GoalResponseDto, ReviewResponseDto } from '@/types/backend';

const PerformancePage = () => {
  const [goals, setGoals] = useState<GoalResponseDto[]>([]);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch performance data from API
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

  return (
    <div className="space-y-6">
      <PageHeader title="Performance" description="Track goals, reviews, and growth.">
        <Button className="gradient-primary border-0 text-white"><Plus className="w-4 h-4 mr-1" /> New Goal</Button>
      </PageHeader>

      {/* Goals */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Goals</h2>
        {loading ? (
          <div className="text-center text-muted-foreground p-8">Loading...</div>
        ) : goals.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">No goals found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(goal => (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-card border-border/50">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary shrink-0" />
                        <h3 className="font-semibold text-sm text-foreground">{goal.title}</h3>
                      </div>
                      <StatusBadge status={goal.status as any} />
                    </div>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground">Due: {goal.dueDate}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Reviews</h2>
        {loading ? (
          <div className="text-center text-muted-foreground p-8">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">No reviews found</div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-card border-border/50">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{review.employeeName} — {review.period}</h3>
                        <p className="text-xs text-muted-foreground">Reviewed by {review.reviewerName}</p>
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
                        <p className="text-xs font-medium text-foreground mb-1">Self Assessment</p>
                        <p className="text-xs text-muted-foreground">{review.selfComments}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;
