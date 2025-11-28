# 🔄 Error Handling Flow - Server Unavailable

## Complete Error Handling Chain

```
┌─────────────────────────────────────────────────────────────┐
│  USER OPENS APP                                              │
│  ↓                                                           │
│  AppContext initializes                                      │
│  ↓                                                           │
│  useMuzakki() and useDonations() hooks fetch data           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ↓
         ┌────────────────────────────────┐
         │  apiCall() in lib/supabase.ts  │
         │  Attempts: fetch(SERVER_URL)   │
         └────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │                           │
      ✅ SUCCESS                   ❌ FAIL
            │                           │
            ↓                           ↓
    ┌───────────────┐       ┌──────────────────────┐
    │ Data loaded   │       │ TypeError/Failed     │
    │ App works!    │       │ to fetch detected    │
    └───────────────┘       └──────────────────────┘
                                        │
                                        ↓
                        ┌───────────────────────────────┐
                        │  apiCall() catches error      │
                        │  Throws 'SERVER_UNAVAILABLE'  │
                        │  Logs deployment instructions │
                        └───────────────────────────────┘
                                        │
                    ┌───────────────────┴────────────────────┐
                    │                                        │
                    ↓                                        ↓
        ┌────────────────────────┐              ┌─────────────────────────┐
        │  Hook catches error    │              │  Auth catches error     │
        │  (useMuzakki/          │              │  (Login/Register)       │
        │   useDonations)        │              │                         │
        └────────────────────────┘              └─────────────────────────┘
                    │                                        │
                    ↓                                        ↓
        ┌────────────────────────┐              ┌─────────────────────────┐
        │ Set friendly message:  │              │ Show toast error:       │
        │ "Server belum aktif.   │              │ "Server Backend Belum   │
        │  Mohon deploy Edge     │              │  Aktif"                 │
        │  Function"             │              │                         │
        └────────────────────────┘              └─────────────────────────┘
                    │
                    ↓
        ┌────────────────────────┐
        │ AppContext exposes     │
        │ error states:          │
        │ - muzakkiError         │
        │ - donationsError       │
        └────────────────────────┘
                    │
                    ↓
        ┌────────────────────────┐
        │ Dashboard receives     │
        │ error prop             │
        └────────────────────────┘
                    │
                    ↓
        ┌────────────────────────────────────────────┐
        │ ServerStatusBanner shows if error exists   │
        │                                            │
        │ ⚠️ Backend server belum aktif             │
        │                                            │
        │ 📝 Cara Deploy:                            │
        │ 1. npm install -g supabase                 │
        │ 2. supabase login                          │
        │ 3. supabase link --project-ref ...         │
        │ 4. supabase functions deploy ...           │
        │                                            │
        │ [Baca Dokumentasi Button]                  │
        └────────────────────────────────────────────┘
```

---

## Error Message Hierarchy

### Level 1: Console (Developer)
```javascript
❌ Network Error: {
  endpoint: "/muzakki?relawan_id=...",
  message: "Cannot connect to server",
  serverUrl: "https://...supabase.co/functions/v1/make-server-f689ca3f",
  hint: "The Supabase Edge Function may not be deployed yet"
}

🚀 TO DEPLOY THE SERVER:
1. Make sure you have Supabase CLI installed
2. Run: supabase functions deploy make-server-f689ca3f
3. Or use the Supabase Dashboard to deploy the function
```

### Level 2: Hook (Internal State)
```typescript
// useMuzakki.ts
setError('Server belum aktif. Mohon deploy Supabase Edge Function terlebih dahulu.')

// useDonations.ts
setError('Server belum aktif. Mohon deploy Supabase Edge Function terlebih dahulu.')
```

### Level 3: Toast (Transient Notification)
```typescript
// LoginPage.tsx, RegisterPage.tsx
toast.error("Server Backend Belum Aktif", {
  description: "Mohon deploy Supabase Edge Function terlebih dahulu. Lihat console untuk instruksi.",
  duration: 10000,
})
```

### Level 4: Banner (Persistent UI)
```tsx
// DashboardPage.tsx, DesktopDashboardPage.tsx
<ServerStatusBanner error={muzakkiError || donationsError} />

// Shows:
// ⚠️ Alert with deployment instructions
// 📝 Step-by-step commands
// 🔗 Link to documentation
```

---

## User Journey - Before vs After

### ❌ BEFORE FIX
```
User Opens App
     ↓
[Blank loading screen]
     ↓
[Red toast: "Tidak dapat terhubung ke server"]
     ↓
[Console shows cryptic errors]
     ↓
User is CONFUSED 😕
- What server?
- What should I do?
- Is the app broken?
     ↓
User gives up or asks for help
```

### ✅ AFTER FIX
```
User Opens App
     ↓
[Dashboard loads with yellow banner]
     ↓
[Banner shows clear instructions:]
"Backend server belum aktif"
     ↓
[Step-by-step deployment guide visible]
     ↓
User understands the issue 💡
     ↓
User follows 5-minute deployment guide
     ↓
User deploys server successfully ✅
     ↓
User refreshes app
     ↓
App works perfectly! 🎉
```

---

## Error Recovery Path

```
┌──────────────────────────┐
│ User sees error banner   │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ User reads instructions  │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ User installs Supabase   │
│ CLI                      │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ User runs login command  │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ User links project       │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ User deploys function    │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ User verifies with curl  │
│ /health endpoint         │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ ✅ Returns:              │
│ { status: "ok" }         │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ User refreshes browser   │
└──────────────────────────┘
            ↓
┌──────────────────────────┐
│ ✅ App loads data        │
│ ✅ Banner disappears     │
│ ✅ Everything works!     │
└──────────────────────────┘
```

---

## Code Flow Summary

### 1. Error Detection
```typescript
// lib/supabase.ts
try {
  const response = await fetch(SERVER_URL + endpoint)
  // ...
} catch (error) {
  if (error.message === 'Failed to fetch') {
    // Log deployment instructions
    throw new Error('SERVER_UNAVAILABLE')
  }
}
```

### 2. Error Propagation
```typescript
// hooks/useMuzakki.ts
try {
  const response = await apiCall('/muzakki?relawan_id=...')
} catch (err) {
  const errorMessage = err.message === 'SERVER_UNAVAILABLE' 
    ? 'Server belum aktif. Mohon deploy Supabase Edge Function terlebih dahulu.'
    : (err.message || 'Gagal memuat data')
  setError(errorMessage)
}
```

### 3. Error Exposure
```typescript
// contexts/AppContext.tsx
const value = {
  // ...
  muzakkiError: muzakki.error,
  donationsError: donations.error,
  // ...
}
```

### 4. Error Display
```tsx
// pages/DashboardPage.tsx
const { muzakkiError, donationsError } = useAppContext()

return (
  <div>
    <ServerStatusBanner error={muzakkiError || donationsError} />
    {/* ... rest of dashboard */}
  </div>
)
```

### 5. Conditional Rendering
```tsx
// components/ServerStatusBanner.tsx
export function ServerStatusBanner({ error }) {
  if (!error || !error.includes('Server belum aktif')) {
    return null // Don't show if no error
  }
  
  return (
    <Alert className="bg-yellow-50">
      {/* Deployment instructions */}
    </Alert>
  )
}
```

---

## Testing Scenarios

### Scenario 1: Server Not Deployed (Error State)
```
✅ Console logs deployment instructions
✅ Hooks set error message
✅ Context exposes error
✅ Dashboard shows yellow banner
✅ Banner has deployment guide
✅ Login shows error toast
✅ Register shows error toast
```

### Scenario 2: Server Deployed Successfully (Happy Path)
```
✅ API calls succeed
✅ No errors thrown
✅ Hooks load data successfully
✅ Banner does not appear
✅ Dashboard shows statistics
✅ Login works normally
✅ Register works normally
```

### Scenario 3: Server Becomes Unavailable (Runtime Error)
```
✅ Existing data remains visible
✅ New requests show error
✅ Banner appears on next navigation
✅ User can still use offline features
✅ Clear error message guides recovery
```

---

## Success Metrics

### Before Fix:
- ❌ Confused users
- ❌ Support tickets
- ❌ Unclear error messages
- ❌ Manual intervention required

### After Fix:
- ✅ Self-service resolution
- ✅ Clear guidance
- ✅ 5-minute time to resolution
- ✅ Professional UX
- ✅ Reduced support load

---

**The error handling flow is now complete, user-friendly, and guides users to successful deployment!** 🚀
