# 🎨 CosyNeige Design System - Implementation Guide

## Overview
Complete guide for modernizing admin and client sections with the new design system components.

---

## 📦 Available Components

All components can be imported from `@/components/ui`:

```typescript
import {
  Button, Card, Badge, Section,
  H1, H2, H3, H4, Text,
  Input, Select, Textarea
} from '@/components/ui';
```

---

## 🔧 Component Usage Guide

### 1. Button Component

**Replace this pattern:**
```tsx
// ❌ Old inline style
<button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold">
  Submit
</button>
```

**With:**
```tsx
// ✅ New component
<Button variant="primary" size="md">
  Submit
</Button>
```

**Variants:**
- `primary` - slate-700 background (main actions)
- `secondary` - slate-100 background (secondary actions)
- `outline` - bordered with no fill (tertiary actions)

**Sizes:**
- `sm` - Small (px-4 py-2)
- `md` - Medium (px-6 py-3) [default]
- `lg` - Large (px-8 py-4)

**Props:**
```tsx
<Button
  variant="primary"
  size="lg"
  fullWidth
  disabled={isLoading}
  onClick={handleClick}
>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

---

### 2. Input Component

**Replace this pattern:**
```tsx
// ❌ Old inline style
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Email
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700"
  />
</div>
```

**With:**
```tsx
// ✅ New component
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
  error={errors.email}
/>
```

**All Input Props:**
```tsx
<Input
  label="First Name"
  type="text"
  placeholder="Enter your name"
  value={firstName}
  onChange={handleChange}
  fullWidth
  disabled={isSubmitting}
  error={errors.firstName}
  required
/>
```

---

### 3. Badge Component

**Replace status indicators:**
```tsx
// ❌ Old inline style
<span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium">
  Confirmed
</span>
```

**With:**
```tsx
// ✅ New component
<Badge variant="primary" size="md">
  Confirmed
</Badge>
```

**With icons:**
```tsx
<Badge icon="✅" variant="primary">
  Confirmed
</Badge>

<Badge icon="⏳" variant="secondary">
  Pending
</Badge>

<Badge icon="❌" variant="outline">
  Cancelled
</Badge>
```

---

### 4. Card Component

**Replace card containers:**
```tsx
// ❌ Old inline style
<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
  <h3 className="text-xl font-bold mb-4">Title</h3>
  <p>Content...</p>
</div>
```

**With:**
```tsx
// ✅ New component
<Card hover padding="md">
  <H3>Title</H3>
  <Text>Content...</Text>
</Card>
```

**Padding options:**
- `none` - No padding
- `sm` - Small (p-4)
- `md` - Medium (p-6 md:p-8) [default]
- `lg` - Large (p-8 md:p-10)

---

### 5. Typography Components

**Replace headings:**
```tsx
// ❌ Old inline style
<h1 className="text-4xl md:text-5xl font-bold text-slate-900">
  Welcome
</h1>
```

**With:**
```tsx
// ✅ New component
<H1>Welcome</H1>
<H1 gradient>Welcome with Gradient</H1>
```

**All typography components:**
```tsx
<H1>Hero Title</H1>           {/* 4xl to 6xl */}
<H2>Section Title</H2>        {/* 3xl to 5xl */}
<H3>Subsection Title</H3>     {/* 2xl to 4xl */}
<H4>Card Title</H4>           {/* xl to 2xl */}

<Text variant="large">Large body text</Text>
<Text variant="body">Normal body text</Text>
<Text variant="small">Small text</Text>
<Text muted>Muted gray text</Text>
```

---

### 6. Select & Textarea

**Select with options:**
```tsx
<Select
  label="Status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  fullWidth
  options={[
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]}
/>
```

**Textarea:**
```tsx
<Textarea
  label="Message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows={5}
  fullWidth
  placeholder="Enter your message..."
/>
```

---

## 🎯 Admin Panel Modernization Examples

### Example 1: User Management Button

**Before:**
```tsx
<button className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold">
  + Add User
</button>
```

**After:**
```tsx
<Button variant="primary" size="md">
  + Add User
</Button>
```

---

### Example 2: Reservation Status Badge

**Before:**
```tsx
<span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
  Confirmed
</span>
```

**After:**
```tsx
<Badge variant="primary" icon="✅">
  Confirmed
</Badge>
```

---

### Example 3: Stats Card

**Before:**
```tsx
<div className="bg-white rounded-xl shadow-lg p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-600">Total Reservations</p>
      <p className="text-3xl font-bold text-slate-900">{total}</p>
    </div>
    <div className="text-4xl">📅</div>
  </div>
</div>
```

**After:**
```tsx
<Card hover padding="md">
  <div className="flex items-center justify-between">
    <div>
      <Text variant="small" muted>Total Reservations</Text>
      <H2>{total}</H2>
    </div>
    <div className="text-4xl">📅</div>
  </div>
</Card>
```

---

## 👤 Client Section Modernization Examples

### Example 1: Login Form

**Before:**
```tsx
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Email *
  </label>
  <input
    type="email"
    required
    value={formData.email}
    onChange={(e) => setFormData({...formData, email: e.target.value})}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700"
  />
</div>

<button
  type="submit"
  disabled={isSubmitting}
  className="w-full bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold"
>
  Login
</button>
```

**After:**
```tsx
<Input
  label="Email *"
  type="email"
  required
  value={formData.email}
  onChange={(e) => setFormData({...formData, email: e.target.value})}
  fullWidth
  error={errors.email}
/>

<Button
  type="submit"
  disabled={isSubmitting}
  variant="primary"
  size="lg"
  fullWidth
>
  {isSubmitting ? 'Loading...' : 'Login'}
</Button>
```

---

### Example 2: Dashboard Reservation Card

**Before:**
```tsx
<div className="bg-white rounded-lg shadow-md p-4 border">
  <div className="flex justify-between items-start">
    <div>
      <h3 className="font-bold text-lg">Reservation #{id}</h3>
      <p className="text-gray-600">{checkIn} - {checkOut}</p>
    </div>
    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
      Confirmed
    </span>
  </div>
</div>
```

**After:**
```tsx
<Card hover padding="md">
  <div className="flex justify-between items-start">
    <div>
      <H4>Reservation #{id}</H4>
      <Text variant="small" muted>{checkIn} - {checkOut}</Text>
    </div>
    <Badge variant="primary" icon="✅">
      Confirmed
    </Badge>
  </div>
</Card>
```

---

## 🚀 Step-by-Step Migration Guide

### Step 1: Add Imports
At the top of your admin/client page files:

```tsx
import { Button, Card, Badge, H1, H2, H3, H4, Text, Input } from '@/components/ui';
```

### Step 2: Replace Buttons
Search for: `className.*bg-slate-700.*text-white`
Replace with Button component

### Step 3: Replace Form Inputs
Search for: `<input` with inline className
Replace with Input component

### Step 4: Replace Status Indicators
Search for: `bg-green-100`, `bg-blue-100`, `bg-red-100`
Replace with Badge component

### Step 5: Replace Card Containers
Search for: `bg-white rounded`
Replace with Card component

### Step 6: Replace Headings
Search for: `<h1`, `<h2`, `<h3`
Replace with H1, H2, H3 components

---

## 💡 Quick Reference

| Old Pattern | New Component | Example |
|-------------|---------------|---------|
| Button with bg-slate-700 | `<Button variant="primary">` | Submit, Save, Add |
| Button with border | `<Button variant="outline">` | Cancel, Secondary |
| Status badge | `<Badge variant="primary">` | Confirmed, Active |
| White card container | `<Card hover>` | Data displays |
| Form input | `<Input fullWidth>` | Email, Name, etc |
| Select dropdown | `<Select options={...}>` | Status, Category |
| Textarea | `<Textarea rows={5}>` | Messages, Notes |
| h1 heading | `<H1>` | Page titles |
| h2 heading | `<H2>` | Section titles |
| h3 heading | `<H3>` | Card titles |

---

## ✅ Benefits

- **Consistency**: Same look & feel across all pages
- **Maintainability**: Update once, applies everywhere
- **Accessibility**: Built-in ARIA support
- **Type Safety**: Full TypeScript support
- **Responsiveness**: Mobile-first design
- **Less Code**: No need to remember className patterns

---

## 🎨 Color System

All components use the **slate palette**:
- `slate-50` - Lightest backgrounds
- `slate-100` - Light backgrounds
- `slate-200` - Borders
- `slate-700` - Primary buttons & accents
- `slate-800` - Hover states
- `slate-900` - Dark text & headings

---

## 📝 Notes

- All components are already styled with the slate design system
- Components are responsive by default
- All form components support error states
- Typography components support gradient prop
- Card components support hover effects
- Button components support loading/disabled states

---

**Last Updated:** 2025
**Version:** 1.0.0
