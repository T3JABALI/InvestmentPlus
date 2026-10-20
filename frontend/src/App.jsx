import React, { useEffect, useState } from 'react'
import {
  Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom'
import {
  Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, ChartNoAxesCombined,
  CheckCircle2, CircleHelp, CreditCard, LayoutDashboard, LockKeyhole,
  LogOut, Menu, Package, ReceiptText, RefreshCw, ShieldCheck, Users, Wallet, X,
} from 'lucide-react'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')
const TOKEN_KEY = 'investmentplus_token'
const USER_KEY = 'investmentplus_user'

const money = (value) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 2,
  }).format(Number(value ?? 0))

function readUser() {
  try {
    const value = sessionStorage.getItem(USER_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

async function api(path, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status})`)
  return data
}

function Brand() {
  return <Link to="/" className="brand" aria-label="InvestPlus home">
    <span className="brand-mark"><ChartNoAxesCombined size={22} /></span>
    <span>Invest<span className="brand-green">Plus</span><small>Grow Today, Build Tomorrow</small></span>
  </Link>
}

function Button({ children, variant = 'primary', ...props }) {
  return <button className={`btn btn-${variant}`} {...props}>{children}</button>
}

function AuthLayout({ title, subtitle, children }) {
  return <main className="auth-page" style={{ maxWidth: 460, margin: '48px auto', padding: 24 }}>
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <Brand />
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
    {children}
    <p style={{ textAlign: 'center', marginTop: 24 }}><Link to="/">Back to home</Link></p>
  </main>
}

const fieldStyle = {
  display: 'block', width: '100%', boxSizing: 'border-box', padding: 13,
  marginTop: 7, marginBottom: 17, border: '1px solid #d8dee7',
  borderRadius: 8, fontSize: 16,
}

function LoginPage({ onAuthenticated }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (!data.token || !data.user) throw new Error('The server returned an incomplete login response.')
      sessionStorage.setItem(TOKEN_KEY, data.token)
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user))
      onAuthenticated(data.user)
      navigate(data.user.role === 'admin' ? '/admin' : '/member', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthLayout title="Welcome back" subtitle="Log in to your InvestPlus account.">
    <form onSubmit={submit}>
      <label htmlFor="login-email">Email address</label>
      <input id="login-email" type="email" autoComplete="email" required value={email}
        onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
      <label htmlFor="login-password">Password</label>
      <input id="login-password" type="password" autoComplete="current-password" required value={password}
        onChange={(e) => setPassword(e.target.value)} style={fieldStyle} />
      {error && <p role="alert" className="form-error" style={{ color: '#b42318' }}>{error}</p>}
      <Button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</Button>
    </form>
    <p style={{ textAlign: 'center', marginTop: 22 }}>New to InvestPlus? <Link to="/register">Create an account</Link></p>
  </AuthLayout>
}

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const data = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), password }),
      })
      setMessage(data.message || 'Account created. Check your email for a verification link.')
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return <AuthLayout title="Create your account" subtitle="Register with your details to get started.">
    <form onSubmit={submit}>
      <label htmlFor="register-name">Full name</label>
      <input id="register-name" autoComplete="name" maxLength={120} required value={fullName}
        onChange={(e) => setFullName(e.target.value)} style={fieldStyle} />
      <label htmlFor="register-email">Email address</label>
      <input id="register-email" type="email" autoComplete="email" required value={email}
        onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
      <label htmlFor="register-password">Password</label>
      <input id="register-password" type="password" autoComplete="new-password" minLength={8}
        maxLength={72} required value={password} onChange={(e) => setPassword(e.target.value)} style={fieldStyle} />
      <small style={{ display: 'block', marginTop: -10, marginBottom: 18 }}>
        Use at least 8 characters and follow any password rules shown by the server.
      </small>
      {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
      {message && <div role="status" className="notice-strip"><CheckCircle2 size={18} /><p>{message} <Link to="/login">Continue to login</Link></p></div>}
      {!message && <Button type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>}
    </form>
    <p style={{ textAlign: 'center', marginTop: 22 }}>Already registered? <Link to="/login">Log in</Link></p>
  </AuthLayout>
}

function VerifyEmailPage() {
  const [message, setMessage] = useState('Verifying your email address…')
  const [error, setError] = useState(false)

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) {
      setError(true)
      setMessage('This verification link is missing its token. Open the complete link from your email.')
      return
    }
    let cancelled = false
    api('/api/auth/verify-email', {
      method: 'POST', body: JSON.stringify({ token }),
    }).then((data) => {
      if (!cancelled) setMessage(data.message || 'Your email address has been verified.')
    }).catch((err) => {
      if (!cancelled) { setError(true); setMessage(err.message || 'Email verification failed.') }
    })
    return () => { cancelled = true }
  }, [])

  return <AuthLayout title="Email verification" subtitle={message}>
    {error ? <p role="alert" style={{ color: '#b42318' }}>{message}</p> : <CheckCircle2 size={32} />}
    <p style={{ textAlign: 'center' }}><Link to="/login">Go to login</Link></p>
  </AuthLayout>
}

function ProtectedRoute({ children, adminOnly = false }) {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const user = readUser()
  if (!token || !user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/member" replace />
  if (!adminOnly && user.role === 'admin') return <Navigate to="/admin" replace />
  return children
}

const memberNav = [
  { to: '/member', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/member/packages', label: 'My packages', icon: Package },
  { to: '/member/earnings', label: 'Earnings', icon: Activity },
  { to: '/member/referrals', label: 'Referrals', icon: Users },
  { to: '/member/withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
  { to: '/member/transactions', label: 'Transactions', icon: ReceiptText },
]
const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Members', icon: Users },
  { to: '/admin/packages', label: 'Packages', icon: Package },
  { to: '/admin/deposits', label: 'Deposits', icon: ArrowDownLeft },
  { to: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
  { to: '/admin/referrals', label: 'Commissions', icon: CreditCard },
  { to: '/admin/transactions', label: 'Transactions', icon: ReceiptText },
]

function DashboardShell({ type, user, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isAdmin = type === 'admin'
  const nav = isAdmin ? adminNav : memberNav
  return <div className="dashboard-shell">
    {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <div className={`sidebar-wrap ${menuOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand"><Brand /><button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {nav.map((item) => <NavLink key={item.to} to={item.to} end={item.end}
            onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
            <item.icon size={18} /><span>{item.label}</span>
          </NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="support-card"><span><CircleHelp size={18} /></span><b>Need help?</b><p>Contact the support team for account assistance.</p><a href="mailto:support@investplus.example">Get support <ArrowRight size={14} /></a></div>
          <button className="sidebar-logout" onClick={onLogout}><LogOut size={17} /> Log out</button>
        </div>
      </aside>
    </div>
    <div className="dashboard-main">
      <header className="dash-header">
        <div className="dash-header-left">
          <button className="icon-button mobile-sidebar-trigger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <div className="breadcrumb">Workspace <span>/</span> <b>{isAdmin ? 'Administration' : 'Member area'}</b></div>
        </div>
        <div className="dash-header-actions">
          <div className="profile-chip"><div className="avatar">{(user?.fullName || user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}</div>
            <div><b>{user?.fullName || user?.name || user?.email || 'Account'}</b><small>{isAdmin ? 'Administrator' : 'Member account'}</small></div>
          </div>
          <button className="icon-button" onClick={onLogout} aria-label="Log out"><LogOut size={18} /></button>
        </div>
      </header>
      <main className="dashboard-content">{children}<footer className="dash-footer"><span>© {new Date().getFullYear()} InvestPlus</span><span><ShieldCheck size={14} /> Account data is loaded from the server</span></footer></main>
    </div>
  </div>
}

function PageTitle({ title, subtitle, action }) {
  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}

function LoadingState({ onRetry }) {
  return <div className="panel" style={{ padding: 28, textAlign: 'center' }}>
    <RefreshCw size={22} /><p>Loading account information…</p>
    {onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}
  </div>
}

function ApiState({ error, onRetry }) {
  return <div className="panel" style={{ padding: 28 }}>
    <h2>We couldn’t load this information</h2>
    <p role="alert">{error}</p>
    <p>Check that the API server is running and that this account has permission to view the requested information.</p>
    <Button variant="outline" onClick={onRetry}><RefreshCw size={15} /> Retry</Button>
  </div>
}

function StatCard({ icon: Icon, label, value }) {
  return <div className="stat-card"><div className="stat-icon green"><Icon size={20} /></div>
    <div className="stat-label">{label}</div><div className="stat-value">{value ?? '—'}</div></div>
}

function RecordsTable({ records, columns, emptyText = 'No records found.' }) {
  if (!records?.length) return <p style={{ padding: 20 }}>{emptyText}</p>
  return <div className="table-wrap"><table><thead><tr>{columns.map((c) => <th key={c.label}>{c.label}</th>)}</tr></thead>
    <tbody>{records.map((record, i) => <tr key={record.id ?? record._id ?? i}>
      {columns.map((c) => <td key={c.label}>{c.render ? c.render(record) : (record[c.key] ?? '—')}</td>)}
    </tr>)}</tbody></table></div>
}

function MemberDashboard({ user, onLogout }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api('/api/member/dashboard')
      .then((result) => { if (active) setData(result) })
      .catch((err) => { if (active) setError(err.message || 'Unable to load your account.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  const transactions = data?.transactions ?? []
  return <DashboardShell type="member" user={user} onLogout={onLogout}>
    <PageTitle title={`Welcome${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}`}
      subtitle="Review your account balance and latest account activity."
      action={<Button variant="outline" onClick={() => setRefreshKey((n) => n + 1)}><RefreshCw size={15} /> Refresh</Button>} />
    {loading ? <LoadingState /> : error ? <ApiState error={error} onRetry={() => setRefreshKey((n) => n + 1)} /> : <>
      <div className="stats-grid member-stats">
        <StatCard icon={Wallet} label="Account balance" value={money(data?.accountBalance)} />
        <StatCard icon={TrendingIcon} label="Invested amount" value={money(data?.investedAmount)} />
        <StatCard icon={Users} label="Referral commissions" value={money(data?.referralCommissions)} />
        <StatCard icon={CreditCard} label="Available to withdraw" value={money(data?.withdrawableBalance)} />
      </div>
      <div className="dashboard-two-col lower-grid">
        <section className="panel"><div className="panel-header"><div><h2>Account summary</h2><p>Current records associated with your account</p></div></div>
          <div className="referral-stats">
            <div><span>Active packages</span><b>{data?.activePackagesCount ?? data?.packages?.length ?? 0}</b></div>
            <div><span>Total referrals</span><b>{data?.referralCount ?? 0}</b></div>
          </div>
        </section>
        <section className="panel"><div className="panel-header"><div><h2>Recent transactions</h2><p>Your latest recorded account activity</p></div><Link to="/member/transactions">View all <ArrowRight size={14} /></Link></div>
          <RecordsTable records={transactions.slice(0, 5)} columns={[
            { label: 'Date', key: 'date' }, { label: 'Type', key: 'type' },
            { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
          ]} />
        </section>
      </div>
    </>}
  </DashboardShell>
}

function TrendingIcon(props) { return <Activity {...props} /> }

const memberPages = {
  packages: { title: 'My packages', endpoint: '/api/member/packages', key: 'packages', columns: [
    { label: 'Package', key: 'name' }, { label: 'Amount', render: (r) => money(r.amount ?? r.price) },
    { label: 'Status', key: 'status' }, { label: 'Start date', key: 'startDate' }, { label: 'End date', key: 'endDate' },
  ] },
  earnings: { title: 'Earnings', endpoint: '/api/member/earnings', key: 'earnings', columns: [
    { label: 'Date', key: 'date' }, { label: 'Description', key: 'description' },
    { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
  ] },
  referrals: { title: 'Referrals', endpoint: '/api/member/referrals', key: 'referrals', columns: [
    { label: 'Member', key: 'name' }, { label: 'Joined', key: 'createdAt' }, { label: 'Status', key: 'status' },
    { label: 'Commission', render: (r) => money(r.commission) },
  ] },
  withdrawals: { title: 'Withdrawals', endpoint: '/api/member/withdrawals', key: 'withdrawals', columns: [
    { label: 'Requested', key: 'createdAt' }, { label: 'Amount', render: (r) => money(r.amount) },
    { label: 'Status', key: 'status' }, { label: 'Reference', key: 'reference' },
  ] },
  transactions: { title: 'Transactions', endpoint: '/api/member/transactions', key: 'transactions', columns: [
    { label: 'Date', key: 'date' }, { label: 'Type', key: 'type' }, { label: 'Details', key: 'description' },
    { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
  ] },
}

function MemberRecordsPage({ user, onLogout }) {
  const location = useLocation()
  const pageKey = location.pathname.split('/').filter(Boolean).at(-1)
  const config = memberPages[pageKey]
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    if (!config) return
    setLoading(true)
    setError('')
    api(config.endpoint).then((result) => {
      const rows = Array.isArray(result) ? result : (result[config.key] ?? result.data ?? [])
      if (active) setRecords(rows)
    }).catch((err) => { if (active) setError(err.message || 'Unable to load records.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [config, refreshKey])

  if (!config) return <Navigate to="/member" replace />
  return <DashboardShell type="member" user={user} onLogout={onLogout}>
    <PageTitle title={config.title} subtitle={`Review the ${config.title.toLowerCase()} recorded for your account.`}
      action={<Button variant="outline" onClick={() => setRefreshKey((n) => n + 1)}><RefreshCw size={15} /> Refresh</Button>} />
    {loading ? <LoadingState /> : error ? <ApiState error={error} onRetry={() => setRefreshKey((n) => n + 1)} /> :
      <section className="panel"><RecordsTable records={records} columns={config.columns} /></section>}
  </DashboardShell>
}

function AdminDashboard({ user, onLogout }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    api('/api/admin/dashboard').then((result) => { if (active) setData(result) })
      .catch((err) => { if (active) setError(err.message || 'Unable to load admin data.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [refreshKey])

  return <DashboardShell type="admin" user={user} onLogout={onLogout}>
    <PageTitle title="Administration" subtitle="Review verified platform activity and account operations."
      action={<Button variant="outline" onClick={() => setRefreshKey((n) => n + 1)}><RefreshCw size={15} /> Refresh</Button>} />
    {loading ? <LoadingState /> : error ? <ApiState error={error} onRetry={() => setRefreshKey((n) => n + 1)} /> : <>
      <div className="stats-grid admin-stats">
        <StatCard icon={Users} label="Registered members" value={data?.registeredMembers ?? '—'} />
        <StatCard icon={ArrowDownLeft} label="Confirmed deposits" value={money(data?.confirmedDeposits)} />
        <StatCard icon={ArrowUpRight} label="Pending withdrawals" value={data?.pendingWithdrawals ?? '—'} />
        <StatCard icon={CreditCard} label="Recorded commissions" value={money(data?.recordedCommissions)} />
      </div>
      <section className="panel admin-table-panel"><div className="panel-header"><div><h2>Recent transactions</h2><p>Latest transactions recorded by the backend</p></div></div>
        <RecordsTable records={data?.recentTransactions ?? []} columns={[
          { label: 'Date', key: 'date' }, { label: 'Member', key: 'memberName' }, { label: 'Type', key: 'type' },
          { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
        ]} />
      </section>
    </>}
  </DashboardShell>
}

function AdminRecordsPage({ user, onLogout }) {
  const location = useLocation()
  const key = location.pathname.split('/').filter(Boolean).at(-1)
  const config = {
    users: { title: 'Members', endpoint: '/api/admin/users', dataKey: 'users', columns: [
      { label: 'Name', key: 'fullName' }, { label: 'Email', key: 'email' }, { label: 'Role', key: 'role' }, { label: 'Status', key: 'status' },
    ] },
    packages: { title: 'Packages', endpoint: '/api/admin/packages', dataKey: 'packages', columns: [
      { label: 'Name', key: 'name' }, { label: 'Price', render: (r) => money(r.price) }, { label: 'Status', key: 'status' },
    ] },
    deposits: { title: 'Deposits', endpoint: '/api/admin/deposits', dataKey: 'deposits', columns: [
      { label: 'Date', key: 'createdAt' }, { label: 'Member', key: 'memberName' }, { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
    ] },
    withdrawals: { title: 'Withdrawals', endpoint: '/api/admin/withdrawals', dataKey: 'withdrawals', columns: [
      { label: 'Date', key: 'createdAt' }, { label: 'Member', key: 'memberName' }, { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
    ] },
    referrals: { title: 'Commissions', endpoint: '/api/admin/referrals', dataKey: 'referrals', columns: [
      { label: 'Date', key: 'createdAt' }, { label: 'Referrer', key: 'referrerName' }, { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
    ] },
    transactions: { title: 'Transactions', endpoint: '/api/admin/transactions', dataKey: 'transactions', columns: [
      { label: 'Date', key: 'createdAt' }, { label: 'Member', key: 'memberName' }, { label: 'Type', key: 'type' }, { label: 'Amount', render: (r) => money(r.amount) }, { label: 'Status', key: 'status' },
    ] },
  }[key]
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    if (!config) return
    setLoading(true)
    setError('')
    api(config.endpoint).then((result) => {
      const records = Array.isArray(result) ? result : (result[config.dataKey] ?? result.data ?? [])
      if (active) setRows(records)
    }).catch((err) => { if (active) setError(err.message || 'Unable to load records.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [key, refreshKey])

  if (!config) return <Navigate to="/admin" replace />
  return <DashboardShell type="admin" user={user} onLogout={onLogout}>
    <PageTitle title={config.title} subtitle={`Review ${config.title.toLowerCase()} records from the server.`}
      action={<Button variant="outline" onClick={() => setRefreshKey((n) => n + 1)}><RefreshCw size={15} /> Refresh</Button>} />
    {loading ? <LoadingState /> : error ? <ApiState error={error} onRetry={() => setRefreshKey((n) => n + 1)} /> :
      <section className="panel"><RecordsTable records={rows} columns={config.columns} /></section>}
  </DashboardShell>
}

function LandingPage() {
  return <div className="landing">
    <header className="site-header"><div className="container nav-wrap"><Brand />
      <nav className="main-nav"><a href="#about">About</a><a href="#features">Features</a><a href="#security">Security</a></nav>
      <div className="nav-actions"><Link className="login-link" to="/login">Log in</Link><Link className="btn btn-primary" to="/register">Create account <ArrowRight size={16} /></Link></div>
    </div></header>
    <main>
      <section className="hero" id="about"><div className="container hero-grid">
        <div className="hero-copy"><div className="pill">A clearer view of your financial activity</div>
          <h1>Build your future.<br /><span>Make informed decisions.</span></h1>
          <p className="hero-lead">Access your account, review recorded activity, and keep your investment-related records organized in one place.</p>
          <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/register">Get started <ArrowRight size={18} /></Link><Link className="btn btn-outline btn-large" to="/login">Log in to your account</Link></div>
          <div className="hero-trust"><span><ShieldCheck size={17} /> Account access controls</span><span><ReceiptText size={17} /> Recorded activity history</span></div>
        </div>
        <div className="hero-visual"><div className="hero-art-card"><div className="art-top"><span className="live-dot" /> ACCOUNT OVERVIEW</div>
          <div className="art-balance-label">Your account</div><div className="art-balance">Private & secure</div>
          <div className="art-footer"><div><span className="art-icon"><LockKeyhole size={16} /></span><span><small>Member access</small><b>Sign in to view your records</b></span></div><ArrowRight size={18} /></div>
        </div></div>
      </div></section>
      <section className="section feature-section" id="features"><div className="container feature-grid">
        <div className="feature-visual"><div className="feature-visual-inner"><div className="feature-orb"><ChartNoAxesCombined size={56} /></div><div className="feature-caption"><span className="live-dot" /> Your account, in one place</div></div></div>
        <div className="feature-copy"><div className="eyebrow">BUILT AROUND CLARITY</div><h2>Your account activity,<br /><span>clearly organized.</span></h2>
          <p>Review information associated with your account, including recorded transactions, package details, and referral activity where available.</p>
          <div className="feature-list"><div><span><CheckCircle2 size={16} /></span><div><b>Account-specific information</b><small>Sign in to access records linked to your account.</small></div></div>
            <div><span><CheckCircle2 size={16} /></span><div><b>Clear transaction history</b><small>Review recorded activity and its current status.</small></div></div>
            <div><span><CheckCircle2 size={16} /></span><div><b>Protected member area</b><small>Member and administration pages require authentication.</small></div></div></div>
        </div>
      </div></section>
      <section className="section" id="security"><div className="container"><div className="section-heading"><div className="eyebrow">SECURITY</div><h2>Access your account securely</h2><p>Register with your email, verify your address, and log in to access account features enabled by the service.</p></div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><Brand /><p>Account tools for clear and organized financial activity.</p><div className="footer-links"><Link to="/register">Create account</Link><Link to="/login">Log in</Link><a href="mailto:support@investplus.example">Contact</a></div></div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} InvestPlus</span><span>Review product terms before making financial decisions.</span></div></footer>
  </div>
}

function NotFound() {
  return <main className="not-found"><Brand /><h1>Page not found</h1><p>The page you requested could not be found.</p><Link className="btn btn-primary" to="/">Return home</Link></main>
}

export default function App() {
  const [user, setUser] = useState(readUser)
  const location = useLocation()

  useEffect(() => { setUser(readUser()) }, [location.pathname])

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/member'} replace /> : <LoginPage onAuthenticated={setUser} />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/member" element={<ProtectedRoute><MemberDashboard user={user} onLogout={logout} /></ProtectedRoute>} />
    <Route path="/member/:section" element={<ProtectedRoute><MemberRecordsPage user={user} onLogout={logout} /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard user={user} onLogout={logout} /></ProtectedRoute>} />
    <Route path="/admin/:section" element={<ProtectedRoute adminOnly><AdminRecordsPage user={user} onLogout={logout} /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
}
