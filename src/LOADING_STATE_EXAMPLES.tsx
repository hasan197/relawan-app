// ============================================
// 📚 LOADING STATE USAGE EXAMPLES
// ============================================

import { 
  LoadingSpinner,
  LoadingSpinnerInline,
  CardSkeleton,
  TableSkeleton,
  StatsCardSkeleton,
  DashboardSkeleton,
  MuzakkiListSkeleton,
  ProgramCardSkeleton,
  ChatSkeleton,
  LeaderboardSkeleton
} from './components/LoadingState';

// ============================================
// EXAMPLE 1: Full Page Loading (Dashboard)
// ============================================
export function DashboardExample() {
  const { data, loading } = useSomeData();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header /> {/* Keep header visible */}
        <div className="container px-4 py-6">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  return <ActualDashboard data={data} />;
}

// ============================================
// EXAMPLE 2: Section Loading (List)
// ============================================
export function MuzakkiListExample() {
  const { muzakkiList, loading } = useMuzakki(relawanId);

  return (
    <div>
      <Header />
      <SearchBar /> {/* Keep search visible */}
      
      {loading ? (
        <MuzakkiListSkeleton />
      ) : muzakkiList.length === 0 ? (
        <EmptyState />
      ) : (
        <MuzakkiList data={muzakkiList} />
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 3: Stats Cards Loading
// ============================================
export function StatsExample() {
  const { stats, loading } = useStatistics(userId);

  return (
    <div className="container">
      <h2>Statistics</h2>
      
      {loading ? (
        <StatsCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total" value={stats.total} />
          {/* ... more stat cards */}
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 4: Table Loading
// ============================================
export function TableExample() {
  const { data, loading } = useTableData();

  return (
    <div>
      <h3>Data Table</h3>
      
      {loading ? (
        <TableSkeleton rows={10} cols={5} />
      ) : (
        <Table data={data} />
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 5: With Error Handling
// ============================================
export function WithErrorExample() {
  const { data, loading, error, refetch } = useData();

  if (loading) {
    return <LoadingSpinner message="Memuat data..." />;
  }

  if (error) {
    return (
      <ErrorCard 
        message={error} 
        onRetry={refetch}
      />
    );
  }

  return <DataComponent data={data} />;
}

// ============================================
// EXAMPLE 6: Inline Loading (Button Action)
// ============================================
export function InlineLoadingExample() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitData();
    setSubmitting(false);
  };

  return (
    <Button onClick={handleSubmit} disabled={submitting}>
      {submitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Menyimpan...
        </>
      ) : (
        'Submit'
      )}
    </Button>
  );
}

// ============================================
// EXAMPLE 7: Chat Loading
// ============================================
export function ChatExample() {
  const { messages, loading, sending, sendMessage } = useChat(reguId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner message="Memuat chat..." />
      </div>
    );
  }

  return (
    <div>
      <ChatHeader />
      
      {messages.length === 0 ? (
        <EmptyChat />
      ) : (
        <ChatMessages messages={messages} />
      )}

      <ChatInput 
        onSend={sendMessage}
        disabled={sending}
      />
    </div>
  );
}

// ============================================
// EXAMPLE 8: Programs Grid
// ============================================
export function ProgramsExample() {
  const { programs, loading } = usePrograms();

  return (
    <div>
      <Header />
      <CategoryFilter /> {/* Keep filter visible */}
      
      {loading ? (
        <ProgramCardSkeleton count={6} />
      ) : programs.length === 0 ? (
        <EmptyPrograms />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {programs.map(p => <ProgramCard key={p.id} {...p} />)}
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 9: Leaderboard
// ============================================
export function LeaderboardExample() {
  const { reguStats, loading } = useAdminStats();

  return (
    <div>
      <h2>Leaderboard Regu</h2>
      
      {loading ? (
        <LeaderboardSkeleton count={10} />
      ) : (
        <div className="space-y-3">
          {reguStats.map((regu, idx) => (
            <ReguCard key={regu.id} regu={regu} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 10: Custom Card Skeleton
// ============================================
export function CustomSkeletonExample() {
  const { data, loading } = useCustomData();

  return (
    <div>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <CustomList data={data} />
      )}
    </div>
  );
}

// ============================================
// BEST PRACTICES
// ============================================

/*
✅ DO:
- Match skeleton structure to actual content
- Keep headers & navigation visible during loading
- Show appropriate number of skeleton items (3-5)
- Use consistent loading patterns across app
- Handle error states separately
- Show empty states when no data

❌ DON'T:
- Show blank white screens
- Hide entire page during loading
- Use spinners for list content (use skeletons)
- Forget to handle error states
- Show too many skeleton items (causes confusion)
- Mix different loading patterns in same context
*/

// ============================================
// LOADING STATE DECISION TREE
// ============================================

/*
🤔 Which loading component to use?

1. **Full Page Load** (initial page load)
   → Use DashboardSkeleton or LoadingSpinner

2. **List/Grid Items** (muzakki, programs, etc)
   → Use CardSkeleton or specific skeleton (MuzakkiListSkeleton)

3. **Stats Cards** (dashboard stats)
   → Use StatsCardSkeleton

4. **Table Data**
   → Use TableSkeleton

5. **Chat Messages**
   → Use ChatSkeleton

6. **Leaderboard/Rankings**
   → Use LeaderboardSkeleton

7. **Button Actions** (form submit, delete, etc)
   → Use Loader2 icon with disabled state

8. **Inline Sections**
   → Use LoadingSpinnerInline

9. **Custom Layout**
   → Build custom using Skeleton component
*/

// ============================================
// PERFORMANCE TIPS
// ============================================

/*
⚡ Performance Optimization:

1. **Don't over-animate**
   - One shimmer animation is enough
   - Avoid multiple spinners on same page

2. **Appropriate skeleton count**
   - 3-5 items for mobile
   - 5-10 items for desktop
   - Don't show 100 skeletons

3. **Lazy load images in actual content**
   - Skeleton → Load → Fade in

4. **Use React.memo for skeleton components**
   - Prevent unnecessary re-renders
   - Skeletons are static, no need to re-render

5. **Preload critical data**
   - Start fetch on route enter
   - Show skeleton immediately
   - Smooth transition when data arrives
*/

export default {
  DashboardExample,
  MuzakkiListExample,
  StatsExample,
  TableExample,
  WithErrorExample,
  InlineLoadingExample,
  ChatExample,
  ProgramsExample,
  LeaderboardExample,
  CustomSkeletonExample
};
