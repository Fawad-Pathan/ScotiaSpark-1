export interface RewardGoal {
  id: string;
  title: string;
  description: string;
  type: 'lesson_completion' | 'lifetime_invested' | 'recurring_setup' | 'fhsa_percent';
  pointsOnUnlock: number;
  rewardSubtext: string;
  requiredCount?: number;
  requiredAmount?: number;
  requiredPercent?: number;
}

export const SCENE_REWARD_GOALS: RewardGoal[] = [
  {
    id: 'goal_basics',
    title: 'Scotia Basics Reward',
    description: 'Complete all 12 Scotia Basics lessons',
    requiredCount: 12,
    type: 'lesson_completion',
    pointsOnUnlock: 600,
    rewardSubtext: '≈ $6.00 toward Sobeys, Cineplex, or your portfolio',
  },
  {
    id: 'goal_first_500',
    title: 'First $500 Invested',
    description: 'Reach $500 in lifetime contributions',
    requiredAmount: 500,
    type: 'lifetime_invested',
    pointsOnUnlock: 200,
    rewardSubtext: '≈ $2.00 reward',
  },
  {
    id: 'goal_first_recurring',
    title: 'First Recurring Contribution',
    description: 'Set up your first auto-contribution',
    requiredCount: 1,
    type: 'recurring_setup',
    pointsOnUnlock: 500,
    rewardSubtext: '≈ $5.00 reward',
  },
  {
    id: 'goal_first_home_quarter',
    title: 'First Home Saver',
    description: 'Reach 25% of your First Home goal',
    requiredPercent: 25,
    type: 'fhsa_percent',
    pointsOnUnlock: 250,
    rewardSubtext: '≈ $2.50 reward',
  },
];

export interface RewardState {
  completedLessonCount: number;
  lifetimeInvested: number;
  recurringSetupCount: number;
  fhsaPercent: number;
  unlockedGoalIds: string[];
}

export function getProgressForGoal(state: RewardState, goalId: string): number {
  const goal = SCENE_REWARD_GOALS.find(g => g.id === goalId);
  if (!goal) return 0;

  switch (goal.type) {
    case 'lesson_completion':
      return Math.min((state.completedLessonCount / (goal.requiredCount ?? 12)) * 100, 100);
    case 'lifetime_invested':
      return Math.min((state.lifetimeInvested / (goal.requiredAmount ?? 500)) * 100, 100);
    case 'recurring_setup':
      return Math.min((state.recurringSetupCount / (goal.requiredCount ?? 1)) * 100, 100);
    case 'fhsa_percent':
      return Math.min((state.fhsaPercent / (goal.requiredPercent ?? 25)) * 100, 100);
    default:
      return 0;
  }
}

export function getCurrentGoal(state: RewardState): RewardGoal | null {
  let lowestProgress = Infinity;
  let currentGoal: RewardGoal | null = null;

  for (const goal of SCENE_REWARD_GOALS) {
    if (state.unlockedGoalIds.includes(goal.id)) continue;
    const progress = getProgressForGoal(state, goal.id);
    if (progress < lowestProgress) {
      lowestProgress = progress;
      currentGoal = goal;
    }
  }

  return currentGoal;
}

export function checkGoalUnlocks(state: RewardState): string[] {
  const newlyUnlocked: string[] = [];
  for (const goal of SCENE_REWARD_GOALS) {
    if (state.unlockedGoalIds.includes(goal.id)) continue;
    const progress = getProgressForGoal(state, goal.id);
    if (progress >= 100) {
      newlyUnlocked.push(goal.id);
    }
  }
  return newlyUnlocked;
}
