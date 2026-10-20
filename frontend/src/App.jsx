import React, { useEffect, useMemo, useState } from 'react'
import {
  Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams,
} from 'react-router-dom'
import {
  Activity, ArrowRight, BadgeCheck, Bell, CheckCircle2, CreditCard, Eye, EyeOff,
  FileText, Gift, HandCoins, LayoutDashboard, LogOut, Menu, Package, Settings,
  ShieldCheck, TrendingUp, Users, Wallet, X, CircleHelp,
} from 'lucide-react'

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const TOKEN_KEY = 'investmentplus_token'
const USER_KEY = 'investmentplus_user'

const ui = {
  page: { minHeight: '100vh', background: '#f5f7fb', color: '#172033', fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  wrap: { width: 'min(1120px, calc(100% - 36px))', margin: '0 auto' },
  button: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 0, borderRadius: 11, padding: '12px 16px', background: '#2457e6', color: '#fff', fontWeight: 750, textDecoration: 'none', cursor: 'pointer', fontSize: 14 },
  secondary: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid #dce3f0', borderRadius: 11, padding: '11px 15px', background: '#fff', color: '#26334b', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', fontSize: 14 },
  card: { background: '#fff', border: '1px solid #e8edf5', borderRadius: 17, padding: 21, boxShadow: '0 5px 20px rgba(28,46,86,.035)' },
  input: { display: 'block', boxSizing: 'border-box', width: '100%', border: '1px solid #dce3ee', borderRadius: 10, padding: '13px 14px', fontSize: 14, background: '#fff', color: '#172033' },
  muted: { color: '#6c7890' },
  label: { display: 'block', fontSize: 13, fontWeight: 750, marginBottom: 7, color: '#35415a' },
}

async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  } catch {
    throw new Error('Unable to reach the server. Check your connection and API deployment.')
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error || data.message || `Request failed (${response.status})`)
    error.status = response.status
    error.code = data.code
    throw error
  }
  return data
}

function getUser() {
  try { return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null') } catch { return null }
}
function saveSession(token, user) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user || {}))
}
function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

function Brand({ light = false }) {
  return <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, color: light ? '#fff' : '#172033', textDecoration: 'none', fontWeight: 850, letterSpacing: '-.5px', fontSize: 21 }}>
    <span style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg,#3478ff,#5938d8)' }}><TrendingUp size={21} /></span>
    Investment<span style={{ color: light ? '#91b7ff' : '#2457e6', marginLeft: -9 }}>Plus</span>
  </Link>
}

function PublicHeader() {
  return <header style={{ background: '#fff', borderBottom: '1px solid #e8edf5' }}>
    <div style={{ ...ui.wrap, minHeight: 74, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15 }}>
      <Brand />
      <nav style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <a className="ip-public-link" href="#features" style={{ color: '#56627a', textDecoration: 'none', fontSize: 14, fontWeight: 650 }}>Features</a>
        <Link to="/login" style={{ color: '#26334b', textDecoration: 'none', fontSize: 14, fontWeight: 750 }}>Log in</Link>
        <Link to="/register" style={ui.button}>Create account <ArrowRight size={16} /></Link>
      </nav>
    </div>
  </header>
}

function Feature({ icon: Icon, title, text }) {
  return <div style={ui.card}>
    <span style={{ display: 'grid', placeItems: 'center', width: 45, height: 45, borderRadius: 13, background: '#edf2ff', color: '#2457e6', marginBottom: 16 }}><Icon size={22} /></span>
    <h3 style={{ margin: '0 0 9px', fontSize: 17 }}>{title}</h3>
    <p style={{ color: '#6c7890', lineHeight: 1.7, margin: 0, fontSize: 14 }}>{text}</p>
  </div>
}

function LandingPage() {
  return <div style={ui.page}>
    <PublicHeader />
    <main>
      <section style={{ background: 'radial-gradient(circle at 80% 20%, #e3eaff 0, transparent 32%), linear-gradient(135deg,#fff,#f6f8ff)', padding: '76px 0 80px' }}>
        <div className="ip-hero" style={{ ...ui.wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(280px,.8fr)', alignItems: 'center', gap: 46 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #dbe5ff', background: '#eef3ff', color: '#2457e6', padding: '8px 12px', borderRadius: 30, fontWeight: 750, fontSize: 12, marginBottom: 22 }}><ShieldCheck size={15} /> Your financial journey, in one place</div>
            <h1 style={{ fontSize: 'clamp(40px,5vw,64px)', lineHeight: 1.04, letterSpacing: '-2.8px', margin: '0 0 22px', maxWidth: 680 }}>Make your money goals <span style={{ color: '#2457e6' }}>more achievable.</span></h1>
            <p style={{ color: '#66728a', fontSize: 18, lineHeight: 1.75, maxWidth: 590, margin: '0 0 30px' }}>Manage your InvestmentPlus account, follow your activity, and keep your financial information organised from one account dashboard.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link to="/register" style={ui.button}>Get started <ArrowRight size={17} /></Link>
              <Link to="/login" style={ui.secondary}>Sign in to your account</Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 27, color: '#66728a', fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><CheckCircle2 size={16} color="#16845b" /> Account-based access</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><CheckCircle2 size={16} color="#16845b" /> Email verification</span>
            </div>
          </div>
          <div style={{ ...ui.card, padding: 25, maxWidth: 430, width: '100%', justifySelf: 'end', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div><div style={{ color: '#6c7890', fontSize: 13 }}>Account overview</div><strong style={{ display: 'block', marginTop: 5, fontSize: 20 }}>Your dashboard</strong></div>
              <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 14, background: '#edf2ff', color: '#2457e6' }}><LayoutDashboard size={22} /></span>
            </div>
            <div style={{ background: '#172d66', color: '#fff', borderRadius: 15, padding: 21, marginBottom: 13 }}>
              <div style={{ color: '#c6d4ff', fontSize: 13 }}>Account summary</div>
              <div style={{ fontSize: 25, fontWeight: 800, marginTop: 12 }}>All in one place</div>
              <div style={{ color: '#d5defb', fontSize: 13, marginTop: 8 }}>Sign in to view information linked to your account.</div>
            </div>
            {[[Wallet, 'Account activity'], [Activity, 'Transactions'], [Users, 'Referral activity']].map(([Icon, title]) => <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid #eef1f6' }}>
              <span style={{ width: 39, height: 39, display: 'grid', placeItems: 'center', borderRadius: 11, background: '#f2f5fb', color: '#4263b8' }}><Icon size={19} /></span><strong style={{ fontSize: 14 }}>{title}</strong>
            </div>)}
          </div>
        </div>
      </section>
      <section id="features" style={{ padding: '66px 0' }}>
        <div style={ui.wrap}>
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 32px' }}><h2 style={{ fontSize: 33, letterSpacing: '-1px', margin: '0 0 12px' }}>Tools to manage your account</h2><p style={{ color: '#6c7890', lineHeight: 1.7, margin: 0 }}>A straightforward space for account access and financial activity.</p></div>
          <div className="ip-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 18 }}>
            <Feature icon={Wallet} title="Account overview" text="Access the account information available to your signed-in profile." />
            <Feature icon={Activity} title="Activity tracking" text="Review recorded transaction and account activity." />
            <Feature icon={ShieldCheck} title="Account security" text="Verify your email and sign in to access your member area." />
          </div>
        </div>
      </section>
    </main>
    <footer style={{ padding: '23px 0', borderTop: '1px solid #e8edf5', background: '#fff' }}><div style={{ ...ui.wrap, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, color: '#78849a', fontSize: 13 }}><Brand /><span>© {new Date().getFullYear()} InvestmentPlus. All rights reserved.</span></div></footer>
    <style>{'@media(max-width:760px){.ip-hero{grid-template-columns:1fr!important}.ip-feature-grid{grid-template-columns:1fr!important}.ip-public-link{display:none}}'}</style>
  </div>
}

function AuthLayout({ title, subtitle, children }) {
  return <div className="ip-auth-layout" style={{ ...ui.page, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(320px,.85fr)' }}>
    <section style={{ padding: '30px clamp(22px,6vw,82px)', display: 'flex', flexDirection: 'column', minHeight: '100vh', boxSizing: 'border-box' }}>
      <Brand />
      <div style={{ width: 'min(430px,100%)', margin: 'auto', padding: '42px 0' }}>
        <h1 style={{ fontSize: 34, letterSpacing: '-1.2px', margin: '0 0 10px' }}>{title}</h1>
        <p style={{ color: '#6c7890', lineHeight: 1.7, margin: '0 0 27px' }}>{subtitle}</p>
        {children}
      </div>
      <div style={{ color: '#8791a5', fontSize: 12 }}>© {new Date().getFullYear()} InvestmentPlus</div>
    </section>
    <aside className="ip-auth-aside" style={{ background: 'linear-gradient(145deg,#172d66,#2457e6 62%,#6d57df)', padding: 48, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ maxWidth: 440, margin: 'auto' }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 58, height: 58, borderRadius: 18, background: 'rgba(255,255,255,.14)', marginBottom: 28 }}><TrendingUp size={29} /></span>
        <h2 style={{ fontSize: 38, lineHeight: 1.12, letterSpacing: '-1.5px', margin: '0 0 18px' }}>Your financial journey starts here.</h2>
        <p style={{ color: '#dce5ff', lineHeight: 1.8, margin: 0 }}>A single place to access your InvestmentPlus account and review information connected to your profile.</p>
        <div style={{ marginTop: 28, display: 'grid', gap: 14 }}>{['Secure account access', 'Email verification', 'Member-focused dashboard'].map(item => <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#edf2ff' }}><CheckCircle2 size={18} />{item}</div>)}</div>
      </div>
      <div style={{ color: '#dce5ff', fontSize: 12 }}>Keep your login details private.</div>
    </aside>
    <style>{'@media(max-width:760px){.ip-auth-layout{grid-template-columns:1fr!important}.ip-auth-aside{display:none!important}}'}</style>
  </div>
}

function Alert({ type = 'error', children }) {
  if (!children) return null
  const good = type === 'success'
  return <div role="status" style={{ padding: '12px 14px', borderRadius: 10, background: good ? '#e9f8f0' : '#fff0ef', color: good ? '#146c43' : '#a93226', fontSize: 13, lineHeight: 1.55, marginBottom: 16 }}>{children}</div>
}

function PasswordField({ value, onChange, autoComplete = 'current-password' }) {
  const [visible, setVisible] = useState(false)
  return <div style={{ position: 'relative' }}>
    <input style={{ ...ui.input, paddingRight: 44 }} type={visible ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} required />
    <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(v => !v)} style={{ position: 'absolute', right: 8, top: 7, border: 0, background: 'transparent', color: '#738099', padding: 7, cursor: 'pointer' }}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>
  </div>
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: email.trim(), password }) })
      if (!data.token || !data.user) throw new Error('The server did not return a valid login session.')
      saveSession(data.token, data.user)
      navigate(location.state?.from || '/member', { replace: true })
    } catch (err) {
      setError(err.code === 'EMAIL_NOT_VERIFIED' ? 'Please verify your email address before signing in. Open the verification link sent to your inbox.' : err.message)
    } finally { setLoading(false) }
  }

  return <AuthLayout title="Welcome back" subtitle="Sign in with the email address and password linked to your account.">
    <Alert>{error}</Alert>
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <div><label style={ui.label}>Email address</label><input style={ui.input} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></div>
      <div><label style={ui.label}>Password</label><PasswordField value={password} onChange={e => setPassword(e.target.value)} /></div>
      <button type="submit" disabled={loading} style={{ ...ui.button, width: '100%', padding: 14, opacity: loading ? .7 : 1 }}>{loading ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button>
    </form>
    <p style={{ textAlign: 'center', color: '#6c7890', fontSize: 14, marginTop: 23 }}>Don't have an account? <Link to="/register" style={{ color: '#2457e6', fontWeight: 750, textDecoration: 'none' }}>Create one</Link></p>
    <p style={{ textAlign: 'center', marginTop: 16 }}><Link to="/" style={{ color: '#6c7890', fontSize: 13, textDecoration: 'none' }}>← Back to home</Link></p>
  </AuthLayout>
}

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (password !== confirmation) { setError('Your passwords do not match.'); return }
    setLoading(true)
    try {
      await apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), password }) })
      setSuccess(true)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return <AuthLayout title={success ? 'Check your email' : 'Create your account'} subtitle={success ? 'Your registration request has been received.' : 'Enter your details to create your InvestmentPlus account.'}>
    {success ? <>
      <Alert type="success">If registration completed successfully, a verification email should be sent to {email}. Open the link in that email before signing in.</Alert>
      <Link to="/login" style={{ ...ui.button, width: '100%', boxSizing: 'border-box' }}>Continue to sign in <ArrowRight size={16} /></Link>
    </> : <>
      <Alert>{error}</Alert>
      <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
        <div><label style={ui.label}>Full name</label><input style={ui.input} value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" minLength={2} required /></div>
        <div><label style={ui.label}>Email address</label><input style={ui.input} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></div>
        <div><label style={ui.label}>Password</label><PasswordField value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" /></div>
        <div><label style={ui.label}>Confirm password</label><PasswordField value={confirmation} onChange={e => setConfirmation(e.target.value)} autoComplete="new-password" /></div>
        <p style={{ color: '#7a8498', fontSize: 12, lineHeight: 1.6, margin: 0 }}>Use at least 8 characters, including an uppercase letter, a lowercase letter, and a special character.</p>
        <button type="submit" disabled={loading} style={{ ...ui.button, width: '100%', padding: 14, opacity: loading ? .7 : 1 }}>{loading ? 'Creating account…' : 'Create account'} <ArrowRight size={16} /></button>
      </form>
    </>}
    <p style={{ textAlign: 'center', color: '#6c7890', fontSize: 14, marginTop: 22 }}>Already registered? <Link to="/login" style={{ color: '#2457e6', fontWeight: 750, textDecoration: 'none' }}>Sign in</Link></p>
  </AuthLayout>
}

function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your email address…')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('The verification link is missing its token. Open the complete link from your email.')
      return
    }
    let cancelled = false
    apiRequest('/api/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) })
      .then(() => { if (!cancelled) { setStatus('success'); setMessage('Your email address has been verified. You can now sign in.') } })
      .catch(err => { if (!cancelled) { setStatus('error'); setMessage(err.message) } })
    return () => { cancelled = true }
  }, [params])

  return <AuthLayout title={status === 'success' ? 'Email verified' : 'Verify your email'} subtitle="Complete email verification to activate account access.">
    <div style={{ ...ui.card, textAlign: 'center' }}>
      <span style={{ display: 'inline-grid', placeItems: 'center', width: 54, height: 54, borderRadius: 16, background: status === 'error' ? '#fff0ef' : '#edf2ff', color: status === 'error' ? '#b9382d' : '#2457e6', marginBottom: 14 }}>{status === 'success' ? <BadgeCheck size={27} /> : status === 'error' ? <CircleHelp size={27} /> : <Activity size={27} />}</span>
      <p style={{ color: '#5f6c83', lineHeight: 1.7, margin: '0 0 20px' }}>{message}</p>
      <Link to="/login" style={{ ...ui.button, width: '100%', boxSizing: 'border-box' }}>Continue to sign in <ArrowRight size={16} /></Link>
    </div>
  </AuthLayout>
}

const navigation = [
  { label: 'Overview', path: '/member', icon: LayoutDashboard, end: true },
  { label: 'Packages', path: '/member/packages', icon: Package },
  { label: 'Investments', path: '/member/investments', icon: TrendingUp },
  { label: 'Transactions', path: '/member/transactions', icon: CreditCard },
  { label: 'Referrals', path: '/member/referrals', icon: Users },
  { label: 'Withdrawals', path: '/member/withdrawals', icon: HandCoins },
  { label: 'Settings', path: '/member/settings', icon: Settings },
]

function ProtectedRoute({ children }) {
  const location = useLocation()
  return sessionStorage.getItem(TOKEN_KEY)
    ? children
    : <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
}

function MemberShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = getUser()
  const name = user?.fullName || user?.full_name || user?.name || user?.email?.split('@')[0] || 'Member'

  useEffect(() => setMobileOpen(false), [location.pathname])

  function logout() {
    clearSession()
    navigate('/login', { replace: true })
  }

  const sidebar = <aside className="ip-sidebar" style={{ width: 248, background: '#fff', borderRight: '1px solid #e8edf5', minHeight: '100vh', padding: 19, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '4px 6px 25px' }}><Brand /></div>
    <div style={{ color: '#9aa4b6', fontSize: 10, fontWeight: 850, letterSpacing: '1.5px', padding: '8px 10px 12px' }}>MEMBER MENU</div>
    <nav style={{ display: 'grid', gap: 5 }}>
      {navigation.map(({ label, path, icon: Icon, end }) => <NavLink key={path} to={path} end={end} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px', borderRadius: 10, textDecoration: 'none', color: isActive ? '#2457e6' : '#647089', background: isActive ? '#edf2ff' : 'transparent', fontWeight: isActive ? 750 : 600, fontSize: 14 })}><Icon size={18} />{label}</NavLink>)}
    </nav>
    <div style={{ marginTop: 'auto', paddingTop: 22 }}>
      <div style={{ borderRadius: 13, background: '#f4f6fb', padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ width: 36, height: 36, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#dfe8ff', color: '#2457e6', fontWeight: 800 }}>{name.charAt(0).toUpperCase()}</span>
        <div style={{ minWidth: 0 }}><strong style={{ display: 'block', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</strong><span style={{ color: '#8490a5', fontSize: 11 }}>Member account</span></div>
      </div>
      <button onClick={logout} style={{ ...ui.secondary, width: '100%', justifyContent: 'flex-start' }}><LogOut size={17} /> Sign out</button>
    </div>
  </aside>

  return <div style={{ ...ui.page, display: 'flex', minHeight: '100vh' }}>
    <div className="ip-sidebar-desktop">{sidebar}</div>
    {mobileOpen && <div className="ip-sidebar-mobile" style={{ position: 'fixed', inset: 0, zIndex: 20, display: 'flex', background: 'rgba(14,24,48,.45)' }}><div style={{ overflowY: 'auto', background: '#fff' }}>{sidebar}</div><button aria-label="Close menu" onClick={() => setMobileOpen(false)} style={{ alignSelf: 'flex-start', margin: 14, border: 0, borderRadius: 10, padding: 9, background: '#fff' }}><X size={20} /></button></div>}
    <div style={{ minWidth: 0, flex: 1 }}>
      <header style={{ height: 70, background: '#fff', borderBottom: '1px solid #e8edf5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="ip-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ display: 'none', border: '1px solid #e1e7f0', background: '#fff', borderRadius: 10, padding: 8 }}><Menu size={19} /></button>
          <div><div style={{ fontWeight: 800, fontSize: 15 }}>Member area</div><div style={{ color: '#8993a6', fontSize: 12, marginTop: 3 }}>Manage your InvestmentPlus account</div></div>
        </div>
        <span title="Account notifications" style={{ display: 'grid', placeItems: 'center', width: 39, height: 39, border: '1px solid #e8edf5', color: '#66728a', borderRadius: 11 }}><Bell size={18} /></span>
      </header>
      <main style={{ padding: '27px clamp(15px,3vw,32px)', maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>{children}</main>
    </div>
    <style>{'@media(max-width:900px){.ip-sidebar-desktop{display:none}.ip-menu-button{display:grid!important}.ip-sidebar-mobile .ip-sidebar{min-height:100vh!important}} @media(min-width:901px){.ip-sidebar-mobile{display:none!important}}'}</style>
  </div>
}

function StatCard({ title, value, note, icon: Icon }) {
  return <div style={ui.card}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}><span style={{ color: '#6c7890', fontSize: 13, fontWeight: 650 }}>{title}</span><span style={{ width: 37, height: 37, borderRadius: 11, display: 'grid', placeItems: 'center', background: '#edf2ff', color: '#2457e6' }}><Icon size={19} /></span></div><div style={{ fontSize: 25, fontWeight: 850, letterSpacing: '-.7px', marginTop: 17 }}>{value}</div><div style={{ color: '#8791a5', fontSize: 12, marginTop: 8 }}>{note}</div></div>
}

function EmptyState({ text }) {
  return <div style={{ textAlign: 'center', padding: '28px 12px', color: '#8791a5' }}><FileText size={25} style={{ marginBottom: 8 }} /><div style={{ fontSize: 13, lineHeight: 1.6 }}>{text}</div></div>
}

function QuickLink({ to, icon: Icon, title }) {
  return <Link to={to} style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid #e9edf5', borderRadius: 11, padding: 12, textDecoration: 'none', color: '#34415b' }}><span style={{ display: 'grid', placeItems: 'center', width: 35, height: 35, borderRadius: 10, background: '#f0f4ff', color: '#2457e6' }}><Icon size={18} /></span><strong style={{ flex: 1, fontSize: 13 }}>{title}</strong><ArrowRight size={16} color="#8994a8" /></Link>
}

function MemberOverview() {
  const user = getUser()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const displayName = user?.fullName || user?.full_name || user?.name || user?.email?.split('@')[0] || 'Member'
  const money = value => value == null ? '—' : new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 2 }).format(Number(value))

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    apiRequest('/api/member/dashboard')
      .then(data => { if (!cancelled) setDashboard(data) })
      .catch(err => { if (!cancelled) { setDashboard(null); setError(err.status === 404 ? 'The member dashboard API has not been configured on the server yet.' : err.message) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [reloadKey])

  return <div>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
      <div><div style={{ color: '#2457e6', fontWeight: 800, fontSize: 12, letterSpacing: '.7px', textTransform: 'uppercase' }}>Overview</div><h1 style={{ margin: '8px 0', fontSize: 29, letterSpacing: '-.9px' }}>Welcome, {displayName}</h1><p style={{ color: '#6c7890', margin: 0, lineHeight: 1.6 }}>Here is the current information available for your account.</p></div>
      <button onClick={() => setReloadKey(k => k + 1)} style={ui.secondary}><Activity size={16} /> Refresh account</button>
    </div>
    {error && <div style={{ ...ui.card, borderColor: '#f0d5a9', background: '#fffaf0', marginBottom: 20 }}><strong style={{ color: '#7c5010', display: 'block', marginBottom: 7 }}>Account data is not available yet</strong><p style={{ color: '#7d6b4b', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{error} This screen requests account-specific information from the backend; it does not substitute sample balances or transactions.</p></div>}
    <div className="ip-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 15, marginBottom: 20 }}>
      <StatCard title="Available balance" value={loading ? 'Loading…' : money(dashboard?.availableBalance)} note="From your account records" icon={Wallet} />
      <StatCard title="Total investments" value={loading ? 'Loading…' : money(dashboard?.totalInvestments)} note="From investment records" icon={TrendingUp} />
      <StatCard title="Total earnings" value={loading ? 'Loading…' : money(dashboard?.totalEarnings)} note="From recorded earnings" icon={Activity} />
      <StatCard title="Referral earnings" value={loading ? 'Loading…' : money(dashboard?.referralEarnings)} note="From referral records" icon={Users} />
    </div>
    <div className="ip-overview-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(260px,1fr)', gap: 17 }}>
      <section style={ui.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 15 }}><div><h2 style={{ margin: 0, fontSize: 17 }}>Recent transactions</h2><p style={{ ...ui.muted, fontSize: 12, margin: '6px 0 0' }}>Latest activity recorded for your account</p></div><FileText size={21} color="#71809b" /></div>
        {loading ? <p style={ui.muted}>Loading transactions…</p> : dashboard?.recentTransactions?.length ? <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}><thead><tr>{['Description', 'Date', 'Status', 'Amount'].map(h => <th key={h} style={{ textAlign: 'left', padding: '10px 8px', color: '#8791a5', borderBottom: '1px solid #edf0f6', fontWeight: 650 }}>{h}</th>)}</tr></thead><tbody>{dashboard.recentTransactions.map((tx, i) => <tr key={tx.id || i}>{[tx.description || tx.type || 'Transaction', tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—', tx.status || '—', money(tx.amount)].map((value, j) => <td key={j} style={{ padding: '12px 8px', borderBottom: '1px solid #f0f2f7', color: '#47536b' }}>{value}</td>)}</tr>)}</tbody></table></div> : <EmptyState text="No transaction records are available for this account." />}
      </section>
      <section style={ui.card}>
        <h2 style={{ margin: '0 0 7px', fontSize: 17 }}>Quick actions</h2><p style={{ ...ui.muted, fontSize: 12, margin: '0 0 16px' }}>Navigate to a member service.</p>
        <div style={{ display: 'grid', gap: 9 }}><QuickLink to="/member/packages" icon={Package} title="Browse packages" /><QuickLink to="/member/transactions" icon={CreditCard} title="View transactions" /><QuickLink to="/member/referrals" icon={Gift} title="Referral activity" /><QuickLink to="/member/withdrawals" icon={HandCoins} title="Withdrawal requests" /></div>
      </section>
    </div>
    <style>{'@media(max-width:1050px){.ip-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ip-overview-grid{grid-template-columns:1fr!important}} @media(max-width:520px){.ip-stat-grid{grid-template-columns:1fr!important}}'}</style>
  </div>
}

const pageInfo = {
  packages: { title: 'Packages', description: 'Browse the packages available to your account.', icon: Package, endpoint: '/api/packages', keys: ['packages', 'data'] },
  investments: { title: 'Investments', description: 'Review investments linked to your account.', icon: TrendingUp, endpoint: '/api/member/investments', keys: ['investments', 'data'] },
  transactions: { title: 'Transactions', description: 'Review recorded account transactions.', icon: CreditCard, endpoint: '/api/member/transactions', keys: ['transactions', 'data'] },
  referrals: { title: 'Referrals', description: 'Review referral activity linked to your account.', icon: Users, endpoint: '/api/member/referrals', keys: ['referrals', 'data'] },
  withdrawals: { title: 'Withdrawals', description: 'Review withdrawal requests and their status.', icon: HandCoins, endpoint: '/api/member/withdrawals', keys: ['withdrawals', 'data'] },
  settings: { title: 'Settings', description: 'Account settings and profile details.', icon: Settings, endpoint: '/api/member/settings', keys: ['settings', 'data'] },
}

function DataPage({ pageKey }) {
  const info = pageInfo[pageKey]
  const Icon = info.icon
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    apiRequest(info.endpoint)
      .then(result => { if (!cancelled) setData(result) })
      .catch(err => { if (!cancelled) setError(err.status === 404 ? `The ${info.title.toLowerCase()} service has not been added to the backend yet.` : err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [info.endpoint, info.title])

  const rows = useMemo(() => {
    if (Array.isArray(data)) return data
    for (const key of info.keys) if (Array.isArray(data?.[key])) return data[key]
    return []
  }, [data, info.keys])

  return <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 23 }}><span style={{ width: 47, height: 47, display: 'grid', placeItems: 'center', borderRadius: 13, background: '#edf2ff', color: '#2457e6' }}><Icon size={22} /></span><div><h1 style={{ fontSize: 27, letterSpacing: '-.7px', margin: 0 }}>{info.title}</h1><p style={{ color: '#6c7890', margin: '6px 0 0', fontSize: 14 }}>{info.description}</p></div></div>
    <section style={ui.card}>
      {loading ? <p style={ui.muted}>Loading {info.title.toLowerCase()}…</p> : error ? <><Alert>{error}</Alert><p style={{ color: '#6c7890', fontSize: 13, lineHeight: 1.7, marginBottom: 0 }}>This page requests <code>{info.endpoint}</code>. The backend must implement this endpoint and return records belonging to the authenticated user.</p></> : rows.length ? <div style={{ overflowX: 'auto' }}><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12, color: '#47536b' }}>{JSON.stringify(rows, null, 2)}</pre></div> : <EmptyState text={`No ${info.title.toLowerCase()} records are available for this account.`} />}
    </section>
  </div>
}

function NotFound() {
  return <div style={{ ...ui.page, display: 'grid', placeItems: 'center', padding: 24, boxSizing: 'border-box' }}><div style={{ ...ui.card, maxWidth: 450, width: '100%', textAlign: 'center', boxSizing: 'border-box' }}><h1 style={{ fontSize: 44, margin: '0 0 8px' }}>404</h1><p style={{ ...ui.muted, lineHeight: 1.7 }}>The page you are looking for could not be found.</p><Link to="/" style={ui.button}>Back to home <ArrowRight size={16} /></Link></div></div>
}

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/member" element={<ProtectedRoute><MemberShell><MemberOverview /></MemberShell></ProtectedRoute>} />
    <Route path="/member/packages" element={<ProtectedRoute><MemberShell><DataPage pageKey="packages" /></MemberShell></ProtectedRoute>} />
    <Route path="/member/investments" element={<ProtectedRoute><MemberShell><DataPage pageKey="investments" /></MemberShell></ProtectedRoute>} />
    <Route path="/member/transactions" element={<ProtectedRoute><MemberShell><DataPage pageKey="transactions" /></MemberShell></ProtectedRoute>} />
    <Route path="/member/referrals" element={<ProtectedRoute><MemberShell><DataPage pageKey="referrals" /></MemberShell></ProtectedRoute>} />
    <Route path="/member/withdrawals" element={<ProtectedRoute><MemberShell><DataPage pageKey="withdrawals" /></MemberShell></ProtectedRoute>} />
    <Route path="/member/settings" element={<ProtectedRoute><MemberShell><DataPage pageKey="settings" /></MemberShell></ProtectedRoute>} />
    <Route path="/admin/*" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
}
