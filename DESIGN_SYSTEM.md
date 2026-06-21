# BucketX Invoice — Design System Guide

A complete reference for replicating the visual theme of this project in any other PHP/web application.

---

## Stack & Dependencies

| Library | Version | Purpose |
|---|---|---|
| Bootstrap | 5.3.3 | Grid, utilities, components |
| Bootstrap Icons | 1.11.3 | Icon set |
| Inter (Google Fonts) | 300–800 | Primary typeface |
| DataTables | 1.13.11 + BS5 | Server-side tables |
| SweetAlert2 | 11 | Confirm dialogs & flash messages |
| Chart.js | 4 | Dashboard charts |
| jQuery | 3.7.1 | DOM & AJAX |

**CDN block to paste in `<head>`:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;450;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
<link href="https://cdn.datatables.net/1.13.11/css/dataTables.bootstrap5.min.css" rel="stylesheet">
```

**CDN block before `</body>`:**

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://cdn.datatables.net/1.13.11/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.11/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
```

---

## CSS Variables (Design Tokens)

Paste this `:root` block at the top of your stylesheet. These tokens drive the entire theme.

```css
:root {
  /* Brand — Red gradient accent */
  --primary:            #Fd0304;
  --primary-dark:       #cc0000;
  --primary-light:      #fef2f2;
  --brand-gradient:     linear-gradient(to right, #ffb25f, #ed1c24, #ff0000);

  /* Semantic colors */
  --secondary:          #64748b;
  --success:            #10b981;
  --success-light:      #ecfdf5;
  --warning:            #f59e0b;
  --warning-light:      #fffbeb;
  --danger:             #ef4444;
  --danger-light:       #fef2f2;
  --info:               #06b6d4;
  --info-light:         #ecfeff;

  /* Sidebar — dark glassmorphism panel */
  --sidebar-bg:         #0f172a;
  --sidebar-text:       #94a3b8;
  --sidebar-active-bg:  rgba(255, 255, 255, 0.06);
  --sidebar-active-text:#ffffff;
  --sidebar-active-border: #Fd0304;
  --sidebar-hover-bg:   rgba(255, 255, 255, 0.03);
  --sidebar-width:      260px;

  /* Topbar */
  --topbar-height:      60px;
  --topbar-bg:          rgba(255, 255, 255, 0.8);
  --topbar-shadow:      0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Layout & Cards */
  --body-bg:            #f8fafc;
  --body-color:         #0f172a;
  --card-bg:            #ffffff;
  --card-shadow:        0 4px 6px -1px rgba(0,0,0,.05), 0 2px 4px -2px rgba(0,0,0,.05);
  --card-hover-shadow:  0 10px 15px -3px rgba(79,70,229,.1), 0 4px 6px -4px rgba(79,70,229,.1);
  --border-color:       #e2e8f0;

  /* Shape */
  --border-radius:      12px;
  --border-radius-sm:   8px;
  --border-radius-lg:   16px;

  /* Motion */
  --transition:         all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow:    all 0.4s  cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Typography

- **Font family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Base size:** `0.9rem` on body, `0.85rem` inside tables and forms
- **Antialiasing:** `-webkit-font-smoothing: antialiased`
- **Letter spacing:** `-0.02em` on headings, `0.04em` on uppercase labels

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--body-bg);
  color: var(--body-color);
  font-size: 0.9rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
```

---

## Layout Structure

```
<body>
  <aside class="sidebar">          ← Fixed, 260px, dark
  <div class="sidebar-overlay">   ← Mobile backdrop
  <div class="main-content">      ← margin-left: 260px
    <header class="topbar">       ← Sticky, 60px, frosted glass
    <main class="content-area">   ← padding: 1.5rem
    <footer class="site-footer">
```

The `.main-content` shifts its `margin-left` to `0` on mobile and the sidebar slides in via `transform: translateX(-100%)` → `translateX(0)`.

---

## Sidebar

**Structure:**

```html
<aside class="sidebar" id="sidebar">

  <!-- Logo / Brand -->
  <div class="sidebar-brand">
    <div class="sidebar-brand-icon">
      <!-- icon or img -->
    </div>
    <div class="sidebar-brand-text">
      App Name
      <small>Tagline</small>
    </div>
  </div>

  <!-- Nav -->
  <nav class="sidebar-nav">
    <div class="sidebar-heading">Section Label</div>
    <a href="#" class="sidebar-link active">
      <i class="bi bi-speedometer2"></i>
      <span>Dashboard</span>
    </a>
    <!-- more links -->
  </nav>

  <!-- User strip at bottom -->
  <div class="sidebar-footer">
    <div class="sidebar-user">
      <div class="sidebar-user-avatar">A</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">Admin</div>
        <div class="sidebar-user-role">Administrator</div>
      </div>
      <a href="/logout" class="sidebar-logout-btn">
        <i class="bi bi-box-arrow-right"></i>
      </a>
    </div>
  </div>

</aside>
```

**Key CSS rules:**

```css
.sidebar            { background: #0f172a; width: 260px; height: 100vh; position: fixed; }
.sidebar-link       { color: #94a3b8; border-left: 3px solid transparent; padding: .6rem 1.5rem; }
.sidebar-link:hover { background: rgba(255,255,255,.03); color: #cdd6e0; }
.sidebar-link.active{ background: rgba(255,255,255,.06); color: #fff; border-left-color: #Fd0304; }
.sidebar-link.active i { color: #Fd0304; }
.sidebar-heading    { font-size: .65rem; text-transform: uppercase; letter-spacing: .08em;
                      color: rgba(136,153,170,.5); padding: .75rem 1.5rem .4rem; }
```

**Active link detection (PHP helper):**

```php
function is_active(string $segment): string {
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    return str_contains($uri, $segment) ? 'active' : '';
}
```

---

## Topbar

```html
<header class="topbar">
  <button class="topbar-toggle" id="sidebarToggle">
    <i class="bi bi-list"></i>
  </button>

  <div class="topbar-breadcrumb">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="/dashboard"><i class="bi bi-house-door"></i></a></li>
        <li class="breadcrumb-item active">Page Title</li>
      </ol>
    </nav>
  </div>

  <div class="topbar-right">
    <span class="topbar-user d-none d-sm-flex">
      <i class="bi bi-person-circle"></i> Admin
    </span>
    <a href="/logout" class="topbar-btn">
      <i class="bi bi-box-arrow-right"></i>
      <span class="d-none d-md-inline">Logout</span>
    </a>
  </div>
</header>
```

```css
.topbar        { height: 60px; background: rgba(255,255,255,.8); backdrop-filter: blur(8px);
                 position: sticky; top: 0; z-index: 1020; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
.topbar-toggle { display: none; } /* shown only on mobile */
```

---

## Page Header

Every page starts with this pattern:

```html
<div class="page-header animate-fade-in">
  <div>
    <h1><i class="bi bi-receipt-cutoff text-primary me-2"></i>Page Title</h1>
    <p>Short description of this page.</p>
  </div>
  <div class="page-header-actions">
    <a href="/new" class="btn btn-primary">
      <i class="bi bi-plus-circle"></i> New Item
    </a>
  </div>
</div>
```

```css
.page-header   { display:flex; align-items:center; justify-content:space-between;
                 margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem; }
.page-header h1{ font-size:1.4rem; font-weight:700; letter-spacing:-.02em; margin:0; }
.page-header p { color: var(--secondary); font-size:.85rem; margin:0; }
```

---

## Stat Cards (Dashboard KPIs)

```html
<div class="stat-card stat-primary d-flex align-items-center justify-content-between">
  <div>
    <div class="stat-card-label">Today's Sales</div>
    <div class="stat-card-value">₹12,450</div>
    <div class="stat-card-change up"><i class="bi bi-arrow-up"></i> +8% vs yesterday</div>
  </div>
  <div class="stat-card-icon text-primary">
    <i class="bi bi-wallet2"></i>
  </div>
</div>
```

Variants: `stat-primary` · `stat-success` · `stat-warning` · `stat-danger` · `stat-info`

```css
.stat-card {
  border-left: 4px solid var(--primary);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  transition: var(--transition);
}
.stat-card:hover            { transform: translateY(-2px); box-shadow: var(--card-hover-shadow); }
.stat-card.stat-success     { border-left-color: var(--success); }
.stat-card.stat-warning     { border-left-color: var(--warning); }
.stat-card.stat-danger      { border-left-color: var(--danger);  }
.stat-card.stat-info        { border-left-color: var(--info);    }
.stat-card-label            { font-size:.75rem; font-weight:600; text-transform:uppercase;
                               letter-spacing:.04em; color:var(--secondary); margin-bottom:.5rem; }
.stat-card-value            { font-size:1.5rem; font-weight:700; letter-spacing:-.02em; }
.stat-card-icon             { font-size:2rem; opacity:.15; }
.stat-card-change.up        { color: var(--success); font-size:.75rem; }
.stat-card-change.down      { color: var(--danger);  font-size:.75rem; }
```

---

## Cards

```html
<div class="card">
  <div class="card-header">
    <span><i class="bi bi-table text-primary me-2"></i>Card Title</span>
    <a href="#" class="btn btn-sm btn-outline-primary">Action</a>
  </div>
  <div class="card-body">
    <!-- content -->
  </div>
</div>
```

```css
.card         { background:#fff; border:1px solid #e2e8f0; border-radius:12px;
                box-shadow: var(--card-shadow); transition: var(--transition); }
.card:hover   { box-shadow: var(--card-hover-shadow); }
.card-header  { background:transparent; border-bottom:1px solid #e2e8f0;
                padding:1rem 1.25rem; font-weight:600; font-size:.95rem;
                display:flex; align-items:center; justify-content:space-between; }
.card-body    { padding: 1.25rem; }
```

---

## Tables (DataTables)

```html
<div class="card">
  <div class="card-body">
    <div class="table-responsive">
      <table class="table align-middle table-striped w-100" id="myTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th class="text-end">Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</div>
```

```css
.table thead th   { background:var(--body-bg); font-weight:600; font-size:.75rem;
                    text-transform:uppercase; letter-spacing:.04em; color:var(--secondary);
                    border-bottom:2px solid var(--border-color); padding:.75rem 1rem; }
.table tbody td   { padding:.75rem 1rem; vertical-align:middle; font-size:.85rem; }
.table tbody tr:hover { background: rgba(79,140,255,.03); }
```

**DataTables init pattern:**

```js
$('#myTable').DataTable({
  processing: true,
  serverSide: true,
  ajax: { url: '/data-endpoint', method: 'POST' },
  columns: [
    { data: 'id' },
    { data: 'name' },
    {
      data: 'amount',
      className: 'text-end fw-semibold',
      render: data => '₹' + data.toLocaleString('en-IN', { minimumFractionDigits: 2 })
    },
    {
      data: 'status',
      render: data => {
        const map = { active:'badge-success', inactive:'badge-danger', pending:'badge-warning' };
        return `<span class="badge ${map[data] || 'badge-secondary'}">${data}</span>`;
      }
    },
    {
      data: 'id', orderable: false,
      render: id =>
        `<div class="btn-group btn-group-sm">
           <a href="/view/${id}" class="btn btn-sm btn-outline-primary"><i class="bi bi-eye"></i> View</a>
           <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${id}">
             <i class="bi bi-trash"></i> Delete
           </button>
         </div>`
    }
  ],
  pageLength: 25,
  order: [[0, 'desc']]
});
```

---

## Buttons

```html
<!-- Filled -->
<button class="btn btn-primary"><i class="bi bi-plus-circle"></i> New</button>
<button class="btn btn-success"><i class="bi bi-check-circle"></i> Save</button>
<button class="btn btn-danger"><i class="bi bi-trash"></i> Delete</button>
<button class="btn btn-warning"><i class="bi bi-pencil"></i> Edit</button>

<!-- Outlined -->
<button class="btn btn-outline-primary">View</button>
<button class="btn btn-outline-secondary">Cancel</button>

<!-- Icon-only square button -->
<button class="btn btn-icon btn-outline-primary"><i class="bi bi-eye"></i></button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

```css
.btn          { font-size:.85rem; font-weight:500; border-radius:8px; padding:.5rem 1rem;
                transition: var(--transition); display:inline-flex; align-items:center; gap:.4rem; }
.btn:active   { transform: scale(0.97); }
.btn-primary  { background:var(--primary); border-color:var(--primary); color:#fff; }
.btn-primary:hover { background:var(--primary-dark); box-shadow:0 4px 12px rgba(79,140,255,.3); }
.btn-icon     { width:34px; height:34px; padding:0; justify-content:center; }
```

---

## Badges

```html
<span class="badge badge-success">Active</span>
<span class="badge badge-danger">Returned</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-info">UPI</span>
<span class="badge badge-secondary">Draft</span>
```

```css
.badge            { font-size:.7rem; font-weight:600; padding:.35em .65em;
                    border-radius:50px; letter-spacing:.02em; }
.badge-success    { background:var(--success-light); color:#065f46; }
.badge-danger     { background:var(--danger-light);  color:#991b1b; }
.badge-warning    { background:var(--warning-light); color:#92400e; }
.badge-info       { background:var(--info-light);    color:#1e40af; }
.badge-secondary  { background:#f1f5f9; color:#475569; }
```

---

## Forms

```html
<div class="mb-3">
  <label for="name" class="form-label">Customer Name</label>
  <input type="text" class="form-control" id="name" placeholder="Enter name">
</div>

<div class="mb-3">
  <label class="form-label">Amount</label>
  <div class="input-group">
    <span class="input-group-text"><i class="bi bi-currency-rupee"></i></span>
    <input type="number" class="form-control" placeholder="0.00">
  </div>
</div>

<div class="mb-3">
  <label class="form-label">Category</label>
  <select class="form-select">
    <option>Choose...</option>
  </select>
</div>
```

```css
.form-control, .form-select {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: .5rem .85rem;
  font-size: .875rem;
  transition: var(--transition);
}
.form-control:focus, .form-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79,140,255,.15);
}
.form-label {
  font-size: .8rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: .35rem;
}
/* Remove number input spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
input[type="number"] { -moz-appearance: textfield; }
```

---

## Modals

```html
<div class="modal fade" id="myModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal Title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <!-- form / content -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
```

```css
.modal-content { border:none; border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,.15); }
.modal-header  { border-bottom:1px solid var(--border-color); padding:1rem 1.5rem; }
.modal-title   { font-size:1rem; font-weight:600; }
.modal-body    { padding:1.5rem; }
.modal-footer  { border-top:1px solid var(--border-color); padding:1rem 1.5rem; }
```

---

## SweetAlert2 — Confirm & Flash Pattern

**Confirm delete:**

```js
Swal.fire({
  title: 'Are you sure?',
  text: 'This action cannot be undone.',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#ef4444',
  confirmButtonText: 'Yes, delete it!'
}).then(result => {
  if (result.isConfirmed) {
    // perform action
  }
});
```

**Flash messages (from PHP session → JS):**

```php
// In layout, after body
$flash = Session::getFlash('success');
```

```js
// In layout JS block
if (typeof flashType !== 'undefined' && flashType) {
  Swal.fire({
    icon: flashType,
    title: flashMessage,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
}
```

---

## Auth Page (Login)

```html
<div class="auth-wrapper">
  <div class="auth-card">

    <div class="auth-brand">
      <div class="auth-brand-icon">
        <i class="bi bi-box-seam"></i>
      </div>
      <h2>App Name</h2>
      <p>Tagline here</p>
    </div>

    <form class="auth-form">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-person"></i></span>
          <input type="text" class="form-control" placeholder="Enter username">
        </div>
      </div>
      <div class="mb-4">
        <label class="form-label">Password</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-lock"></i></span>
          <input type="password" class="form-control" placeholder="Enter password" id="password">
          <button type="button" class="password-toggle" id="togglePassword">
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>
      <button type="submit" class="btn btn-primary w-100 btn-lg">
        <i class="bi bi-box-arrow-in-right"></i> Sign In
      </button>
    </form>

  </div>
</div>
```

```css
.auth-wrapper {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center; padding: 2rem;
  background: linear-gradient(135deg, #1a0b0c 0%, #4a0d0e 50%, #1a0b0c 100%);
}
.auth-card {
  width: 100%; max-width: 420px;
  background: #fff; border-radius: 16px;
  box-shadow: 0 25px 80px rgba(0,0,0,.25);
  padding: 2.5rem;
  animation: fadeInUp 0.6s ease both;
}
.auth-brand-icon {
  width: 56px; height: 56px; margin: 0 auto .75rem;
  background: var(--brand-gradient);
  border-radius: 14px; display: flex; align-items: center;
  justify-content: center; font-size: 1.5rem; color: #fff;
}
.password-toggle {
  background: var(--body-bg); border: none;
  border-left: 1px solid var(--border-color);
  padding: .65rem .85rem; cursor: pointer; color: var(--secondary);
  border-top-right-radius: 8px; border-bottom-right-radius: 8px;
}
```

**Password toggle JS:**

```js
$('#togglePassword').on('click', function() {
  const $input = $('#password');
  const $icon  = $(this).find('i');
  if ($input.attr('type') === 'password') {
    $input.attr('type', 'text');
    $icon.removeClass('bi-eye').addClass('bi-eye-slash');
  } else {
    $input.attr('type', 'password');
    $icon.removeClass('bi-eye-slash').addClass('bi-eye');
  }
});
```

---

## Animations

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-fade-in   { animation: fadeInUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
.animate-delay-1   { animation-delay: .1s; }
.animate-delay-2   { animation-delay: .2s; }
.animate-delay-3   { animation-delay: .3s; }
.animate-delay-4   { animation-delay: .4s; }

.loading-spinner {
  display: inline-block; width: 2rem; height: 2rem;
  border: 3px solid rgba(79,140,255,.15);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
```

---

## Timeline Component

Used in audit logs / activity views.

```html
<ul class="notebook-timeline">
  <li class="timeline-item">
    <div class="timeline-item-icon">
      <i class="bi bi-pencil"></i>
    </div>
    <div class="timeline-item-card">
      <div class="timeline-item-header">
        <span class="timeline-item-title">Sale Created</span>
        <span class="timeline-item-date">13 Jun 2026, 10:30 AM</span>
      </div>
      <div class="timeline-item-desc">Bill #INV-001 created for Customer XYZ</div>
    </div>
  </li>
</ul>
```

```css
.notebook-timeline { list-style:none; padding:1.5rem 0; margin:0; position:relative; }
.notebook-timeline::before {
  content:''; position:absolute; top:0; bottom:0; left:24px;
  width:2px; background:var(--border-color);
}
.timeline-item { position:relative; margin-bottom:1.5rem; padding-left:55px; }
.timeline-item-icon {
  position:absolute; left:12px; top:4px;
  width:26px; height:26px; border-radius:50%;
  background:var(--card-bg); border:2px solid var(--primary);
  display:flex; align-items:center; justify-content:center;
  font-size:.8rem; color:var(--primary); z-index:2;
  box-shadow:0 0 0 4px var(--body-bg);
}
.timeline-item-card {
  background:var(--card-bg); border:1px solid var(--border-color);
  border-radius:var(--border-radius); padding:1.25rem;
  box-shadow:var(--card-shadow);
}
.timeline-item-card:hover { border-color:var(--primary); box-shadow:var(--card-hover-shadow); }
```

---

## Empty State

```html
<div class="empty-state">
  <div class="empty-state-icon"><i class="bi bi-inbox"></i></div>
  <h4>No records found</h4>
  <p>Get started by creating your first entry.</p>
  <a href="/new" class="btn btn-primary">
    <i class="bi bi-plus-circle"></i> Create New
  </a>
</div>
```

```css
.empty-state       { text-align:center; padding:3rem 1.5rem; }
.empty-state-icon  { font-size:3.5rem; color:#cbd5e1; margin-bottom:1rem; }
.empty-state h4    { font-size:1.1rem; font-weight:600; margin-bottom:.5rem; }
.empty-state p     { color:var(--secondary); font-size:.85rem; margin-bottom:1.5rem; }
```

---

## Utility Classes

```css
.text-primary      { color: var(--primary) !important; }
.text-success      { color: var(--success) !important; }
.text-warning      { color: var(--warning) !important; }
.text-danger       { color: var(--danger)  !important; }
.text-muted        { color: var(--secondary) !important; }

.bg-primary-light  { background: var(--primary-light) !important; }
.bg-success-light  { background: var(--success-light) !important; }
.bg-warning-light  { background: var(--warning-light) !important; }
.bg-danger-light   { background: var(--danger-light)  !important; }
.bg-info-light     { background: var(--info-light)    !important; }

.fw-semibold       { font-weight: 600; }
.fs-sm             { font-size: .8rem; }
.cursor-pointer    { cursor: pointer; }
.truncate          { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rounded-lg        { border-radius: 16px !important; }
```

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≥ 992px` | Sidebar always visible, `margin-left: 260px` |
| `< 992px` | Sidebar hidden (`translateX(-100%)`), toggle button appears |
| `< 768px` | Content padding reduced, page-header stacks vertically |
| `< 576px` | Font base reduced to `0.85rem`, card padding tightened |

**Mobile sidebar JS:**

```js
$('#sidebarToggle').on('click', function() {
  $('#sidebar').toggleClass('show');
  $('.sidebar-overlay').toggleClass('show');
});
$('.sidebar-overlay').on('click', function() {
  $('#sidebar').removeClass('show');
  $(this).removeClass('show');
});
```

---

## Print / Thermal Receipt

Import the thermal stylesheet separately for receipt pages:

```html
<link href="/assets/css/thermal.css" rel="stylesheet">
```

Wrap receipt HTML in:

```html
<div class="thermal-receipt">
  <div class="receipt-header">
    <div class="shop-name">Your Shop Name</div>
    <div class="shop-info">Address · Phone · GST Number</div>
  </div>
  <hr class="receipt-divider">
  <div class="receipt-info">
    <span class="receipt-info-label">Bill No:</span>
    <span>INV-001</span>
  </div>
  <table class="receipt-table">
    <thead>
      <tr><th>Item</th><th>Qty</th><th>Rate</th><th>Total</th></tr>
    </thead>
    <tbody>
      <tr><td class="item-name">Product A</td><td>2</td><td>50.00</td><td>100.00</td></tr>
    </tbody>
  </table>
  <hr class="receipt-divider">
  <table class="receipt-totals">
    <tr><td>Subtotal</td><td>₹100.00</td></tr>
    <tr class="grand-total"><td>TOTAL</td><td>₹100.00</td></tr>
  </table>
  <div class="receipt-footer">
    <div class="thank-you">Thank You! Visit Again.</div>
  </div>
</div>
```

Trigger with:

```js
window.print();
```

The CSS targets `80mm` paper width with monospace font for thermal printers.

---

## Chart.js Patterns

**Line chart (revenue trend):**

```js
new Chart(document.getElementById('salesChart'), {
  type: 'line',
  data: {
    labels: ['Jan','Feb','Mar'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 18000, 15000],
      borderColor: '#4f8cff',
      backgroundColor: 'rgba(79,140,255,.08)',
      borderWidth: 3,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointBackgroundColor: '#4f8cff'
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e2e8f0' },
           ticks: { callback: v => '₹' + v.toLocaleString('en-IN') } },
      x: { grid: { display: false } }
    }
  }
});
```

**Horizontal bar chart (top products):**

```js
new Chart(document.getElementById('productsChart'), {
  type: 'bar',
  data: {
    labels: ['Item A','Item B','Item C'],
    datasets: [{ data: [50, 40, 30], backgroundColor: '#10b981', borderRadius: 6, maxBarThickness: 20 }]
  },
  options: {
    indexAxis: 'y',
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: '#e2e8f0' } },
      y: { grid: { display: false } }
    }
  }
});
```

**Doughnut chart:**

```js
new Chart(document.getElementById('donutChart'), {
  type: 'doughnut',
  data: {
    labels: ['Active','Dormant','Inactive'],
    datasets: [{
      data: [60, 25, 15],
      backgroundColor: ['#10b981','#8b5cf6','#ef4444'],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, cutout: '70%',
    plugins: { legend: { display: false } }
  }
});
```

---

## Color Quick Reference

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#Fd0304` | Brand red, active states, CTAs |
| `--primary-dark` | `#cc0000` | Button hover |
| `--brand-gradient` | `#ffb25f → #ed1c24 → #ff0000` | Logo bg, auth background accents |
| `--success` | `#10b981` | Positive values, active badges |
| `--warning` | `#f59e0b` | Pending, partial states |
| `--danger` | `#ef4444` | Errors, delete, due amounts |
| `--info` | `#06b6d4` | UPI, informational |
| `--sidebar-bg` | `#0f172a` | Sidebar (dark navy) |
| `--body-bg` | `#f8fafc` | Page background (near-white) |
| `--border-color` | `#e2e8f0` | All borders and dividers |

---

*Generated from the BucketX Invoice project — June 2026*
