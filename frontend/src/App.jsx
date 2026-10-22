import React, { useState, useEffect } from 'react'

import { Link, NavLink, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom'

import {

  ArrowDownLeft, ArrowRight, ArrowUpRight, BadgeCheck, Bell, Bitcoin, ChartNoAxesCombined,

  Check, ChevronDown, CircleHelp, Clock3, Copy, CreditCard, Gem, Globe, HandCoins, Home,

  LayoutDashboard, LockKeyhole, LogOut, Menu, MessageCircle, Search, Settings, ShieldCheck,

  Sprout, Star, Users, Wallet, X, Zap, Crown, Layers, CircleDollarSign, Activity,

  Package, ReceiptText, TrendingUp, UserRound, FileText, Download, Filter, CalendarDays,

  CircleCheck, AlertCircle, PieChart as PieIcon

} from 'lucide-react'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

import { packages, transactions, adminTransactions } from './data'


const formatMoney = (amount, currency = 'KES') => {
  if (amount === null || amount === undefined || amount === '') {
    return 'Not available';
  }

  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return 'Not available';
  }

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const EMPTY_FINANCIAL_STATE = {
  balance: null,
  invested: null,
  earnings: null,
  withdrawable: null,
};

const money = n => `KSh ${Number(n).toLocaleString('en-KE')}`

const earningsData = [

  { day: 'Oct 9', value: 350 }, { day: 'Oct 10', value: 520 }, { day: 'Oct 11', value: 490 },

  { day: 'Oct 12', value: 680 }, { day: 'Oct 13', value: 740 }, { day: 'Oct 14', value: 820 }, { day: 'Oct 15', value: 1000 },

]

const activityData = [

  { day: 'Oct 9', deposits: 160, withdrawals: 70 }, { day: 'Oct 10', deposits: 210, withdrawals: 90 },

  { day: 'Oct 11', deposits: 180, withdrawals: 110 }, { day: 'Oct 12', deposits: 270, withdrawals: 140 },

  { day: 'Oct 13', deposits: 230, withdrawals: 120 }, { day: 'Oct 14', deposits: 300, withdrawals: 170 },

]

const pieData = [

  { name: 'Basic', value: 18, color: '#12a66a' }, { name: 'Beginner', value: 16, color: '#2987e5' },

  { name: 'Semi Pro', value: 14, color: '#8763e8' }, { name: 'Pro', value: 12, color: '#e8ad31' },

  { name: 'Premium', value: 11, color: '#e77b39' }, { name: 'Star', value: 10, color: '#d85c9c' },

  { name: 'World Class', value: 19, color: '#22a9a0' },

]

function Brand({ light = false }) {

  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><ChartNoAxesCombined size={22} /></span><span>Invest<span className="brand-green">Plus</span><small>Grow Today, Build Tomorrow</small></span></Link>

}

function Button({ children, variant = 'primary', className = '', ...props }) {

  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>

}

function Status({ children }) {

  const value = String(children).toLowerCase()

  const cls = value.includes('pending') ? 'pending' : value.includes('illustrative') ? 'neutral' : 'success'

  return <span className={`status ${cls}`}><span /> {children}</span>

}

function SectionHeading({ eyebrow, title, description, action }) {

  return <div className="section-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>

}

function PackageIcon({ name, size = 20 }) {

  const icons = { sprout: Sprout, layers: Layers, settings: Settings, gem: Gem, crown: Crown, star: Star, globe: Globe }

  const Icon = icons[name] || Package

  return <Icon size={size} />

}

function LandingPage() {

  const [mobileOpen, setMobileOpen] = useState(false)

  return <div className="landing">

    <header className="site-header">

      <div className="container nav-wrap">

        <Brand light />

        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>

        <nav className={mobileOpen ? 'main-nav open' : 'main-nav'}>

          <a href="#home" onClick={() => setMobileOpen(false)}>Home</a><a href="#about" onClick={() => setMobileOpen(false)}>About</a><a href="#packages" onClick={() => setMobileOpen(false)}>Packages</a><a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a><a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>

        </nav>

        <div className="nav-actions"><Link className="login-link" to="/login">Log in</Link><Link className="btn btn-primary" to="/register">Create account <ArrowRight size={16} /></Link></div>

      </div>

    </header>

    <main>

      <section className="hero" id="home">

        <div className="hero-glow glow-one" /><div className="hero-glow glow-two" />

        <div className="container hero-grid">

          <div className="hero-copy">

            <div className="pill"><span className="pulse-dot" /> A more informed approach to investing</div>

            <h1>Build your future.<br /><span>Think long term.</span></h1>

            <p className="hero-lead">Explore investment opportunities, follow your portfolio, and keep your financial activity in one clear, secure place.</p>

            <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/register">Get started <ArrowRight size={18} /></Link><a className="btn btn-outline btn-large" href="#about">Discover the platform</a></div>

            <div className="hero-trust"><span><ShieldCheck size={17} /> Security-minded design</span><span><ChartNoAxesCombined size={17} /> Transparent reporting</span></div>

          </div>

          <div className="hero-visual">

            <div className="visual-orbit orbit-a" /><div className="visual-orbit orbit-b" />

            <div className="hero-art-card">

              <div className="art-top"><span className="live-dot" /> INVESTMENT OVERVIEW <span className="art-period">DEMO</span></div>

              <div className="art-balance-label">Portfolio overview</div><div className="art-balance">KSh 125,400 <span className="art-change"><ArrowUpRight size={15} /> Sample</span></div>

              <div className="art-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={earningsData}><defs><linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#27d78b" stopOpacity={0.35} /><stop offset="95%" stopColor="#27d78b" stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="value" stroke="#38e69c" strokeWidth={3} fill="url(#heroGradient)" /></AreaChart></ResponsiveContainer></div>

              <div className="art-footer"><div><span className="art-icon"><Wallet size={16} /></span><span><small>Portfolio activity</small><b>View transactions</b></span></div><ArrowRight size={18} /></div>

            </div>

            <div className="float-card float-top"><span className="float-icon green"><ShieldCheck size={18} /></span><span><b>Clear records</b><small>Transactions tracked</small></span><BadgeCheck className="float-check" size={17} /></div>

            <div className="float-card float-bottom"><span className="float-icon gold"><CircleDollarSign size={19} /></span><span><b>Member tools</b><small>Packages & referrals</small></span></div>

          </div>

        </div>

        <div className="container hero-bottom"><div className="hero-metric"><span className="metric-icon"><Package size={19} /></span><div><b>7 package tiers</b><small>Compare available options</small></div></div><div className="hero-metric"><span className="metric-icon"><ReceiptText size={19} /></span><div><b>Clear activity history</b><small>Keep track of transactions</small></div></div><div className="hero-metric"><span className="metric-icon"><Users size={19} /></span><div><b>Referral tools</b><small>See eligible referrals</small></div></div><div className="hero-metric"><span className="metric-icon"><LockKeyhole size={19} /></span><div><b>Security focused</b><small>Designed for account safety</small></div></div></div>

      </section>

      <section className="section packages-section" id="packages">

        <div className="container"><SectionHeading eyebrow="PACKAGE OPTIONS" title="Explore the package tiers" description="Compare the proposed package prices and terms. Payout figures below are illustrative proposals, not guaranteed returns." action={<span className="subtle-link">All amounts in KSh <ArrowRight size={15} /></span>} />

          <div className="package-grid">{packages.map((p, i) => <article className={`package-card ${i === 4 ? 'featured' : ''}`} key={p.name}>

            {i === 4 && <div className="popular-tag">FEATURED TIER</div>}

            <div className={`package-icon ${p.tone}`}><PackageIcon name={p.icon} size={22} /></div><h3>{p.name}</h3><p>{p.description}</p>

            <div className="package-price">{money(p.price)}<small> proposed entry amount</small></div>

            <div className="package-details"><div><span>Proposed daily payout</span><b>{money(p.daily)}</b></div><div><span>Illustrative duration</span><b>{p.duration} days</b></div><div><span>Illustrative total</span><b>{money(p.daily * p.duration)}</b></div></div>

           <Link to={`/member?package=${encodeURIComponent(p.name)}`}
                className={`btn ${i === 4 ? 'btn-primary' : 'btn-package'}`}
           > 
                View details <ArrowRight size={15} />
           </Link>

          </article>)}</div>


        </div>

      </section>

      <section className="section feature-section" id="about"><div className="container feature-grid">

        <div className="feature-visual"><div className="feature-visual-inner"><div className="feature-orb"><ChartNoAxesCombined size={56} /></div><div className="feature-caption"><span className="live-dot" /> A clearer view of your activity</div><div className="mini-stat"><small>Transactions</small><b><ReceiptText size={17} /> One organized history</b></div></div></div>

        <div className="feature-copy"><div className="eyebrow">DESIGNED AROUND CLARITY</div><h2>Your activity,<br /><span>all in one place.</span></h2><p>InvestPlus is designed to give members a simple way to review package details, monitor account activity, and understand how each transaction is recorded.</p><div className="feature-list"><div><span><Check size={16} /></span><div><b>Understand the details</b><small>Review package terms, durations, fees, and risk information before making decisions.</small></div></div><div><span><Check size={16} /></span><div><b>Follow every transaction</b><small>See deposits, withdrawals, commissions, and account adjustments in one history.</small></div></div><div><span><Check size={16} /></span><div><b>Referral activity at a glance</b><small>Access your referral link and review commissions that meet the programme terms.</small></div></div></div><Link className="btn btn-dark" to="/register">Preview member dashboard <ArrowRight size={16} /></Link></div>

      </div></section>

      <section className="section how-section" id="how-it-works"><div className="container"><SectionHeading eyebrow="GETTING STARTED" title="A simple path to get familiar" description="The intended member journey, shown for product planning." /><div className="steps-grid">{[{ n: '01', icon: UserRound, title: 'Create an account', desc: 'Register and complete any required identity checks.' }, { n: '02', icon: Search, title: 'Review the details', desc: 'Understand the investment model, terms, and risks.' }, { n: '03', icon: CreditCard, title: 'Make a verified payment', desc: 'Use an approved payment channel after launch requirements are met.' }, { n: '04', icon: Activity, title: 'Track activity', desc: 'Review confirmed transactions and real investment performance.' }].map(s => <div className="step-card" key={s.n}><div className="step-head"><span>{s.n}</span><s.icon size={22} /></div><h3>{s.title}</h3><p>{s.desc}</p></div>)}</div></div></section>

      <section className="referral-section"><div className="container referral-banner"><div className="referral-art"><div className="referral-circle"><Users size={45} /></div><span className="referral-spark spark-one">✦</span><span className="referral-spark spark-two">✧</span></div><div className="referral-copy"><div className="eyebrow">MEMBER REFERRALS</div><h2>Share the platform.<br /><span>Track eligible rewards.</span></h2><p>The proposed referral programme uses a 15% commission on eligible, verified purchases. Full rules and eligibility conditions should be published before the programme goes live.</p><Link className="btn btn-primary" to="/register">Preview referral tools <ArrowRight size={16} /></Link></div><div className="referral-percent"><span>PROPOSED RATE</span><b>15<small>%</small></b><p>Subject to programme terms</p></div></div></section>

      <section className="section faq-section" id="faq"><div className="container faq-grid"><div><div className="eyebrow">NEED TO KNOW</div><h2>Questions worth<br />asking first.</h2><p>Financial decisions deserve clear information. Review the investment structure and terms before committing funds.</p><a href="mailto:support@investplus.example" className="text-link">Contact support <ArrowRight size={15} /></a></div><div className="faq-list">{[{ q: 'Are the displayed returns guaranteed?', a: 'No. The numbers are proposed figures for this design prototype and are not verified or guaranteed returns. Actual investment performance can vary and capital may be at risk.' }, { q: 'How does the referral programme work?', a: 'The proposed rate is 15% of an eligible referred purchase after payment verification. The final programme rules, reversals, and eligibility criteria must be documented.' }, { q: 'Can I withdraw funds at any time?', a: 'Withdrawal rules, timing, fees, and eligibility must be established in the final product terms and displayed clearly before users deposit funds.' }, { q: 'Is this platform ready to accept money?', a: 'No. This is a frontend prototype using sample data. Backend security, payment verification, investment validation, and legal compliance are required before launch.' }].map((f, i) => <details key={f.q} open={i === 0}><summary>{f.q}<ChevronDown size={18} /></summary><p>{f.a}</p></details>)}</div></div></section>

    </main>

    <footer className="site-footer"><div className="container footer-top"><Brand light /><p>A prototype for clearer investment activity and member tools.</p><div className="footer-links"><a href="#about">About</a><a href="#packages">Packages</a><a href="#faq">Risk information</a><a href="mailto:support@investplus.example">Contact</a></div></div><div className="container footer-bottom"><span>© 2026 InvestPlus concept. All rights reserved.</span><span>Prototype only · Not financial advice</span></div></footer>

  </div>

}

const memberNav = [

  { to: '/member', label: 'Overview', icon: LayoutDashboard, end: true },

  { to: '/member/packages', label: 'My packages', icon: Package },

  { to: '/member/earnings', label: 'Earnings activity', icon: TrendingUp },

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

  { to: '/admin/referrals', label: 'Commissions', icon: HandCoins },

  { to: '/admin/investments', label: 'Investment activity', icon: ChartNoAxesCombined },

  { to: '/admin/transactions', label: 'Transactions', icon: ReceiptText },

  { to: '/admin/reports', label: 'Reports', icon: FileText },

  { to: '/admin/settings', label: 'Settings', icon: Settings },

]

function Sidebar({ type, onClose }) {

  const isAdmin = type === 'admin'

  const nav = isAdmin ? adminNav : memberNav

  return (

    <aside className="sidebar">

      <div className="sidebar-brand">

        <Brand light />

        <button

          className="sidebar-close"

          onClick={onClose}

          aria-label="Close sidebar"

        >

          <X size={18} />

        </button>

      </div>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-nav">

        {nav.map((item) => (

          <NavLink

            key={item.to}

            to={item.to}

            end={item.end}

            onClick={onClose}

            className={({ isActive }) => isActive ? 'active' : ''}

          >

            <item.icon size={18} />

            <span>{item.label}</span>

            {item.label === 'Withdrawals' && isAdmin && (

              <i className="nav-count">2</i>

            )}

          </NavLink>

        ))}

      </nav>

      <div className="sidebar-bottom">

        <div className="support-card">

          <span><CircleHelp size={18} /></span>

          <b>Need some help?</b>

          <p>Visit the help centre or contact support.</p>

          <a href="mailto:support@investplus.example">

            Get support <ArrowRight size={14} />

          </a>

        </div>

        <Link to="/" className="sidebar-logout" onClick={onClose}>

          <LogOut size={17} />

          Back to Home Page

        </Link>

      </div>

    </aside>

  )

}

function DashboardShell({ type, children }) {
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('investplus_user') || 'null'); } catch { return null; } })();
  const displayName = String(currentUser?.fullName || '').trim();
  const userInitials = displayName
    ? displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('')
    : 'ME';

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = type === 'admin'

  return <div className="dashboard-shell">

    {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

    <div className={`sidebar-wrap ${sidebarOpen ? 'sidebar-open' : ''}`}><Sidebar type={type} onClose={() => setSidebarOpen(false)} /></div>

    <div className="dashboard-main"><header className="dash-header"><div className="dash-header-left"><button className="icon-button mobile-sidebar-trigger" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumb">Workspace <span>/</span> <b>{isAdmin ? 'Administration' : 'Member area'}</b></div></div><div className="dash-header-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="profile-chip"><div className="avatar">{isAdmin ? (userInitials || 'AD') : userInitials}</div><div><b>{displayName || (isAdmin ? 'Administrator' : 'Member')}</b><small>{isAdmin ? 'Administrator' : 'Member account'}</small></div><ChevronDown size={15} /></div></div></header><main className="dashboard-content">{children}<footer className="dash-footer"><span>© 2026 InvestPlus · </span><span><ShieldCheck size={14} /> Account activity</span></footer></main></div>

  </div>

}

function PageTitle({ title, subtitle, action }) {

  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>

}

function StatCard({ icon: Icon, label, value, change, tone = 'green', note }) {

  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot">{change ? <span className="stat-change"><ArrowUpRight size={14} />{change}</span> : <span className="stat-note">{note}</span>}</div></div>

}



function MemberDashboard() {
  const currentUser = (() => {
    try {
      return JSON.parse(
        localStorage.getItem('investplus_user') || 'null'
      );
    } catch {
      return null;
    }
  })();

  const [period, setPeriod] = useState('7 days');
  const [overview, setOverview] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingFinance, setLoadingFinance] = useState(true);
  const [financeError, setFinanceError] = useState('');
  const [availablePackages, setAvailablePackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();

    async function loadFinance() {
      const token = localStorage.getItem('investplus_token');

      if (!token) {
        setFinanceError('Please log in again to view your account.');
        setLoadingFinance(false);
        return;
      }

      try {
        setLoadingFinance(true);
        setFinanceError('');

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [overviewResponse, transactionsResponse] =
          await Promise.all([
            fetch(`${API_BASE}/api/finance/overview`, {
              headers,
              signal: controller.signal,
            }),
            fetch(`${API_BASE}/api/finance/transactions`, {
              headers,
              signal: controller.signal,
            }),
          ]);

        const overviewData = await overviewResponse.json();
        const transactionsData = await transactionsResponse.json();

        if (
          overviewResponse.status === 401 ||
          transactionsResponse.status === 401
        ) {
          throw new Error(
            'Your session has expired. Please log in again.'
          );
        }

        if (!overviewResponse.ok) {
          throw new Error(
            overviewData.error || 'Could not load your account overview.'
          );
        }

        if (!transactionsResponse.ok) {
          throw new Error(
            transactionsData.error || 'Could not load your transactions.'
          );
        }

        setOverview(overviewData.overview || overviewData);

        const rows =
          transactionsData.transactions ||
          transactionsData.rows ||
          [];

        setRecentTransactions(Array.isArray(rows) ? rows : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setFinanceError(
            error.message || 'Unable to load financial information.'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingFinance(false);
        }
      }
    }

    loadFinance();

    return () => controller.abort();
  }, []);
  useEffect(() => {
  const controller = new AbortController();

  async function loadAvailablePackages() {
    const token = localStorage.getItem('investplus_token');

    if (!token) {
      setPackagesError('Please log in again to view available packages.');
      setPackagesLoading(false);
      return;
    }

    try {
      setPackagesLoading(true);
      setPackagesError('');

      const response = await fetch(
        `${API_BASE}/api/finance/packages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load available packages.');
      }

      setAvailablePackages(
        Array.isArray(data.packages) ? data.packages : []
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        setPackagesError(error.message || 'Unable to load packages.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setPackagesLoading(false);
      }
    }
  }

  loadAvailablePackages();

  return () => controller.abort();
}, []);

  const balance = overview?.balance ?? null;

  const confirmedDeposits =
    overview?.confirmed_deposits ??
    overview?.confirmedDeposits ??
    null;

  const selectedPackageName =
  new URLSearchParams(location.search).get('package');
    return (
  <DashboardShell type="member">
    <PageTitle
      title="Member Dashboard"
      subtitle="Your account overview and financial activity."
      action={
        <div className="demo-label">
          <span />
          {loadingFinance ? 'LOADING ACCOUNT' : 'LIVE ACCOUNT DATA'}
        </div>
      }
    />

    <div className="stats-grid member-stats">
      <StatCard
        icon={Wallet}
        label="Account balance"
        value={loadingFinance ? 'Loading…' : formatMoney(balance)}
        note="Calculated from the financial ledger"
        tone="green"
      />

      <StatCard
        icon={ArrowDownLeft}
        label="Confirmed deposits"
        value={
          loadingFinance
            ? 'Loading…'
            : formatMoney(confirmedDeposits)
        }
        note="Verified deposit credits only"
        tone="blue"
      />

      <StatCard
        icon={ReceiptText}
        label="Recorded transactions"
        value={
          loadingFinance
            ? 'Loading…'
            : recentTransactions.length.toLocaleString('en-KE')
        }
        note="Records returned by the API"
        tone="purple"
      />

      <StatCard
        icon={CreditCard}
        label="Available to withdraw"
        value="Not available"
        note="Requires a verified withdrawal calculation"
        tone="gold"
      />
    </div>
    
<section className="panel">
  <div className="panel-header">
    <div>
      <h2>Available Packages</h2>
      <p>Review the package options configured in the database.</p>
    </div>
    <span className="small-icon">
      <Package size={17} />
    </span>
  </div>

  {packagesLoading && <p>Loading available packages…</p>}

  {packagesError && (
    <div className="notice-strip" role="alert">
      <AlertCircle size={19} />
      <div>
        <b>Unable to load available packages</b>
        <p>{packagesError}</p>
      </div>
    </div>
  )}

  {!packagesLoading && !packagesError &&
    availablePackages.length === 0 && (
      <p>No active packages are currently available.</p>
    )}

  {!packagesLoading && !packagesError &&
    availablePackages.length > 0 && (
      <div className="package-grid">
        {availablePackages.map((pkg) => {
          const appearance = {
            Basic: { tone: 'mint', icon: 'sprout' },
            Beginner: { tone: 'blue', icon: 'layers' },
            'Semi Pro': { tone: 'violet', icon: 'settings' },
            Pro: { tone: 'gold', icon: 'gem' },
            Premium: { tone: 'orange', icon: 'crown' },
            Star: { tone: 'pink', icon: 'star' },
            'World Class': { tone: 'teal', icon: 'globe' },
          }[pkg.name] || { tone: 'mint', icon: 'sprout' };

          const isSelected =
            selectedPackageName === pkg.name;

          return (
            <article
              key={pkg.subscription_id || pkg.id}
              className={`package-card ${isSelected ? 'featured' : ''}`}
              id={`package-${pkg.id}`}
              style={
                isSelected
                  ? { outline: '2px solid #12a66a', outlineOffset: '3px' }
                  : undefined
              }
            >
              {isSelected && (
                <div className="popular-tag">SELECTED PACKAGE</div>
              )}

              <div className={`package-icon ${appearance.tone}`}>
                <PackageIcon name={appearance.icon} size={22} />
              </div>

              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>

              <div className="package-price">
                {formatMoney(pkg.price)}
                <small>Package price</small>
              </div>

              <div className="package-details">
                <div>
                  <span>Configured daily figure</span>
                  <b>{formatMoney(pkg.daily)}</b>
                </div>
                <div>
                  <span>Duration</span>
                  <b>{pkg.duration} days</b>
                </div>
              </div>

              <p>
                {isSelected
                  ? 'This is the package you selected.'
                  : 'Review the terms before making any commitment.'}
              </p>
            </article>
          );
        })}
      </div>
    )}
</section>


    {financeError && (
      <div className="notice-strip" role="alert">
        <AlertCircle size={19} />
        <div>
          <b>Could not load your financial data</b>
          <p>{financeError}</p>
        </div>
       </div>
     )}

     {
<section className="panel">
  <div className="panel-header">
    <div>
      <h2>Recent Transactions</h2>
      <p>Your latest recorded financial activity.</p>
    </div>
    <span className="small-icon">
      <ReceiptText size={17} />
    </span>
  </div>

  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Transaction</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {loadingFinance ? (
          <tr>
            <td colSpan={3}>Loading transactions…</td>
          </tr>
        ) : recentTransactions.length === 0 ? (
          <tr>
            <td colSpan={3}>
              No transactions have been recorded yet.
            </td>
          </tr>
        ) : (
          recentTransactions.slice(0, 5).map((transaction, index) => (
            <tr key={transaction.id || index}>
              <td>
                {transaction.type ||
                  transaction.description ||
                  transaction.entry_type ||
                  'Account transaction'}

                <small style={{ display: 'block' }}>
                  {transaction.created_at
                    ? new Date(transaction.created_at).toLocaleDateString('en-KE')
                    : ''}
                </small>
              </td>

              <td>{formatMoney(transaction.amount)}</td>

              <td>
                <Status>
                  {transaction.status || 'Recorded'}
                </Status>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</section>
}
   </DashboardShell>
  );
}



function AdminDashboard() {

  const [range, setRange] = useState('Last 7 days')

  const [tab, setTab] = useState('All activity')

  return <DashboardShell type="admin">

    <PageTitle title="Admin overview" subtitle="Monitor platform activity, member transactions, and operational queues." action={<><select className="select-control date-select" value={range} onChange={e => setRange(e.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select><Button variant="outline" onClick={() => window.print()}><Download size={16} /> Export view</Button></>} />

    <div className="admin-warning"><AlertCircle size={17} /><span><b>Demo environment:</b> all figures and user records are illustrative. No real payments or investment balances are connected.</span></div>

    <div className="stats-grid admin-stats"><StatCard icon={Users} label="Registered members" value="1,248" change="+12% sample" tone="blue" /><StatCard icon={ArrowDownLeft} label="Recorded deposits" value="KSh 2.45M" change="+8% sample" tone="green" /><StatCard icon={ArrowUpRight} label="Withdrawal requests" value="KSh 780K" note="12 awaiting review" tone="purple" /><StatCard icon={HandCoins} label="Referral commissions" value="KSh 342K" note="Sample ledger total" tone="gold" /></div>

    <div className="dashboard-two-col admin-charts"><section className="panel"><div className="panel-header"><div><h2>Deposits & withdrawals</h2><p>Sample transaction volumes</p></div><span className="chart-badge">{range}</span></div><div className="chart-legend"><span><i className="legend-dot green-dot" /> Deposits</span><span><i className="legend-dot blue-dot" /> Withdrawals</span></div><div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={activityData} barGap={5}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5" /><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8a96a8' }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#8a96a8' }} width={35} /><Tooltip /><Bar dataKey="deposits" name="Deposits" fill="#12a66a" radius={[4, 4, 0, 0]} /><Bar dataKey="withdrawals" name="Withdrawals" fill="#3988e5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></section>

      <section className="panel"><div className="panel-header"><div><h2>Package distribution</h2><p>Sample active package mix</p></div><span className="small-icon"><PieIcon size={17} /></span></div><div className="pie-layout"><div className="pie-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={2} stroke="none">{pieData.map(p => <Cell key={p.name} fill={p.color} />)}</Pie><Tooltip formatter={v => `${v}%`} /></PieChart></ResponsiveContainer><div className="pie-center"><b>100%</b><small>Sample mix</small></div></div><div className="pie-legend">{pieData.map(p => <div key={p.name}><span><i style={{ background: p.color }} />{p.name}</span><b>{p.value}%</b></div>)}</div></div></section></div>

    <section className="panel admin-table-panel"><div className="panel-header admin-table-header"><div><h2>Recent activity</h2><p>Review transactions and operational statuses</p></div><Button variant="outline" onClick={() => setTab(tab === 'All activity' ? 'Needs review' : 'All activity')}><Filter size={15} />{tab === 'All activity' ? 'Show items to review' : 'Show all activity'}</Button></div><div className="table-tabs"><button className={tab === 'All activity' ? 'selected' : ''} onClick={() => setTab('All activity')}>All activity</button><button className={tab === 'Needs review' ? 'selected' : ''} onClick={() => setTab('Needs review')}>Needs review <span>2</span></button></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Member</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{adminTransactions.filter(t => tab === 'All activity' || t.status === 'Pending review').map((t, i) => <tr key={i}><td>{t.date}</td><td><div className="user-cell"><span className="avatar small-avatar">{t.user.split(' ').map(x => x[0]).join('')}</span><b>{t.user}</b></div></td><td>{t.type}</td><td><b>{money(t.amount)}</b></td><td><Status>{t.status}</Status></td><td><button className="table-action" onClick={() => alert('Demo only: connect this action to an authenticated backend endpoint before production.')}>Review</button></td></tr>)}</tbody></table></div><div className="table-foot"><span>Showing {adminTransactions.filter(t => tab === 'All activity' || t.status === 'Pending review').length} sample records</span><button className="subtle-link" onClick={() => alert('Connect the backend to export verified records.')}>View transaction register <ArrowRight size={14} /></button></div></section>

    <div className="admin-bottom-grid"><div className="admin-shortcut"><span className="shortcut-icon blue"><Users size={19} /></span><div><b>Member management</b><p>Review accounts and verification status.</p><Link to="/admin/users">Manage members <ArrowRight size={14} /></Link></div></div><div className="admin-shortcut"><span className="shortcut-icon gold"><Clock3 size={19} /></span><div><b>Withdrawal review</b><p>Pending requests require controlled review.</p><Link to="/admin/withdrawals">Review queue <ArrowRight size={14} /></Link></div><span className="queue-count">2 pending</span></div><div className="admin-shortcut"><span className="shortcut-icon green"><ChartNoAxesCombined size={19} /></span><div><b>Investment reporting</b><p>Reconcile activity with real statements.</p><Link to="/admin/reports">Open reports <ArrowRight size={14} /></Link></div></div></div>

  </DashboardShell>

}


function PlaceholderPage({ type }) {
  const isAdmin = type === 'admin';
  const { pathname } = useLocation();
  const last = pathname.replace(/\/$/, '').split('/').pop();

  const pageConfig = {
    packages: {
    title: 'My Packages',
    subtitle: 'View the packages you have actually subscribed to.',
  },
    earnings: {
      title: 'Earnings Activity',
      subtitle: 'Review recorded referral commissions.',
    },
    referrals: {
      title: 'Referrals',
      subtitle: 'Review your referral activity.',
    },
    withdrawals: {
      title: 'Withdrawals',
      subtitle: 'Review your actual withdrawal requests.',
    },
    transactions: {
      title: 'Transactions',
      subtitle: 'Review recorded deposits and withdrawals.',
    },
  };

  const config = pageConfig[last];

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referralInfo, setReferralInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalPhone, setWithdrawalPhone] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  
const handleWithdrawalSubmit = (event) => {
  event.preventDefault();

  setError('');

  const amount = Number(withdrawalAmount);
  const phone = withdrawalPhone.trim();

  if (!Number.isFinite(amount) || amount <= 0) {
    setError('Please enter a valid withdrawal amount.');
    return;
  }

  if (!/^(?:0[17]\d{8}|\+254[17]\d{8}|254[17]\d{8})$/.test(phone)) {
    setError('Please enter a valid Kenyan mobile number, such as 0712345678 or +254712345678.');
    return;
  }

  if (walletBalance === null) {
    setError('Your wallet balance is unavailable. Please try again later.');
    return;
  }

  if (amount > Number(walletBalance)) {
    setError('Your withdrawal amount exceeds your displayed wallet balance.');
    return;
  }

  setError(
    'Your details are valid, but withdrawal submission is not enabled yet. Your balance and withdrawal eligibility must first be verified securely.'
  );
};


  useEffect(() => {
    if (isAdmin || !config) return;

    const controller = new AbortController();

    async function loadPage() {
      const token = localStorage.getItem('investplus_token');

      if (!token) {
        setError('Please log in again to view your account.');
        return;
      }

      const endpoint = {
        packages: '/api/finance/my-packages',
        earnings: '/api/finance/earnings',
        withdrawals: '/api/finance/withdrawals',
        transactions: '/api/finance/transactions',
        referrals: '/api/finance/referrals',
      }[last];

      if (last === 'withdrawals') {
  const walletResponse = await fetch(
    `${API_BASE}/api/finance/overview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    }
  );

  const walletData = await walletResponse.json().catch(() => ({}));

  if (!walletResponse.ok) {
    throw new Error(walletData.error || 'Unable to load wallet balance.');
  }

  setWalletBalance(walletData.balance);
}
      if (!endpoint) return;

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load this page.');
        }

        if (last === 'referrals') {
  setReferralInfo(data);
  setRows([]);
  return;
}

  let result = [];

  if (last === 'packages') {
    result = data.packages || [];
  } else if (last === 'earnings') {
    result = data.earnings || [];
    setTotal(data.total ?? '0.00');
  } else if (last === 'withdrawals') {
    result = data.withdrawals || [];
  } else if (last === 'transactions') {
    result = data.transactions || [];
  }

  setRows(Array.isArray(result) ? result : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load account data.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadPage();

    return () => controller.abort();
  }, [last, isAdmin]);

  if (isAdmin) {
    return (
      <DashboardShell type="admin">
        <PageTitle title="Administration" subtitle="Administration workspace." />
        <div className="panel placeholder-panel">
          <div className="placeholder-icon"><ConstructionIcon /></div>
          <h2>Administration workspace</h2>
          <p>This page needs its own authenticated administration API.</p>
          <Link to="/admin" className="btn btn-primary">
            Back to overview <ArrowRight size={16} />
          </Link>
        </div>
      </DashboardShell>
    );
  }

  if (!config) {
    return (
      <DashboardShell type="member">
        <PageTitle title="Page not found" subtitle="Member workspace." />
        <div className="panel placeholder-panel">
          <h2>Page not found</h2>
          <Link to="/member" className="btn btn-primary">
            Back to overview <ArrowRight size={16} />
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const packageAppearance = {
    Basic: { tone: 'mint', icon: 'sprout' },
    Beginner: { tone: 'blue', icon: 'layers' },
    'Semi Pro': { tone: 'violet', icon: 'settings' },
    Pro: { tone: 'gold', icon: 'gem' },
    Premium: { tone: 'orange', icon: 'crown' },
    Star: { tone: 'pink', icon: 'star' },
    'World Class': { tone: 'teal', icon: 'globe' },
  };

  const emptyMessage = {
    packages: 'No active packages are available.',
    earnings: 'No earnings have been recorded yet.',
    referrals: 'No referral records are available yet.',
    withdrawals: 'You have no withdrawal requests yet.',
    transactions: 'No transactions have been recorded yet.',
  }[last];

  function dateLabel(value) {
    return value
      ? new Date(value).toLocaleDateString('en-KE')
      : '—';
  }

  function statusLabel(value) {
    return value || 'Recorded';
  }

  return (
    <DashboardShell type="member">
      <PageTitle
        title={config.title}
        subtitle={config.subtitle}
        action={
          <div className="demo-label">
            <span />
            {loading ? 'LOADING ACCOUNT' : 'ACCOUNT DATA'}
          </div>
        }
      />

      {error && (
        <div className="notice-strip" role="alert">
          <AlertCircle size={19} />
          <div>
            <b>Unable to load your data</b>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="panel">
          <p>Loading your account data…</p>
        </div>
      )}

      {!loading && !error && last === 'packages' && (
        <div className="package-grid">
          {rows.length === 0 ? (
            <div className="panel">
              <p>{emptyMessage}</p>
            </div>
          ) : rows.map((pkg) => {
            const appearance = packageAppearance[pkg.name] || {
              tone: 'mint',
              icon: 'sprout',
            };

            return (
              <section className="panel" key={pkg.subscription_id || pkg.id}>
                <div className={`package-icon ${appearance.tone}`}>
                  <PackageIcon name={appearance.icon} />
                </div>
                <h3>{pkg.name}</h3>
                <p>{pkg.description}</p>
                <div className="package-price">
                  {formatMoney(pkg.price)}
                  <small>Package price</small>
                </div>
                <div className="package-details">
                  <div>
                    <span>Configured daily figure</span>
                    <b>{formatMoney(pkg.daily)}</b>
                  </div>
                  <div>
                    <span>Duration</span>
                    <b>{pkg.duration} days</b>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {!loading && !error && last === 'earnings' && (
        <>
          <div className="stats-grid member-stats">
            <StatCard
              icon={TrendingUp}
              label="Recorded commissions"
              value={formatMoney(total)}
              note="Confirmed ledger credits"
              tone="green"
            />
            <StatCard
              icon={ReceiptText}
              label="Earning records"
              value={rows.length.toLocaleString('en-KE')}
              note="Records returned by the API"
              tone="blue"
            />
          </div>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Earnings ledger</h2>
                <p>Recorded referral commission credits.</p>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan={3}>{emptyMessage}</td></tr>
                  ) : rows.map((item) => (
                    <tr key={item.id}>
                      <td>{dateLabel(item.created_at)}</td>
                      <td>{item.description || 'Referral commission'}</td>
                      <td>{formatMoney(item.amount, item.currency || 'KES')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      
{!loading && !error && last === 'withdrawals' && (
  <section className="panel ip-wallet-panel">

    {/* Wallet Card */}
    <div className="ip-wallet-card">
      <div className="ip-wallet-top">
        <div>
          <span className="ip-wallet-eyebrow">
            INVESTPLUS WALLET
          </span>
          <h2>My Wallet</h2>
          <p>Your available balance for withdrawals.</p>
        </div>

        <div className="ip-wallet-icon">↗</div>
      </div>

      <div className="ip-wallet-balance">
        <span>Available balance</span>
        <h3>
          {walletBalance === null
            ? 'Balance unavailable'
            : formatMoney(walletBalance, 'KES')}
        </h3>
        <span className="ip-wallet-currency">
          KES · Withdrawable funds
        </span>
      </div>

      <div className="ip-wallet-divider" />

      <p className="ip-wallet-note">
        Your package purchase amount is not part of your
        withdrawable balance.
      </p>

      <button
        type="button"
        className="btn btn-primary ip-wallet-button"
        onClick={() => {
          setError('');
          setShowWithdrawalForm((current) => !current);
        }}
        disabled={walletBalance === null}
      >
        {showWithdrawalForm
          ? 'Close Withdrawal Form'
          : 'Request Withdrawal'}
        <span>
          {showWithdrawalForm ? '−' : '→'}
        </span>
      </button>

      {/* Withdrawal Form */}
      {showWithdrawalForm && (
        <div className="ip-withdraw-form">
          <div className="ip-withdraw-title">
            <div className="ip-withdraw-icon">↗</div>
            <div>
              <h3>Request a withdrawal</h3>
              <p>
                Withdraw your available funds to your M-Pesa account.
              </p>
            </div>
          </div>

          <div className="ip-withdraw-balance">
            <span>Available wallet balance</span>
            <strong>
              {walletBalance === null
                ? 'Balance unavailable'
                : formatMoney(walletBalance, 'KES')}
            </strong>
            <small>InvestPlus wallet · KES</small>
          </div>

          <form
            className="ip-withdraw-fields"
            onSubmit={handleWithdrawalSubmit}
          >
            <div className="ip-withdraw-field">
              <label htmlFor="withdrawal-amount">
                Amount to withdraw
              </label>

              <div className="ip-withdraw-input">
                <span>KES</span>
                <input
                  id="withdrawal-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={withdrawalAmount}
                  onChange={(event) =>
                    setWithdrawalAmount(event.target.value)
                  }
                  placeholder="Enter amount"
                  required
                />
              </div>

              <small>
                Enter an amount within your available balance.
              </small>
            </div>

            <div className="ip-withdraw-field">
              <label htmlFor="withdrawal-phone">
                M-Pesa phone number
              </label>

              <div className="ip-withdraw-input">
                <span className="ip-phone-prefix">☎</span>
                <input
                  id="withdrawal-phone"
                  type="tel"
                  value={withdrawalPhone}
                  onChange={(event) =>
                    setWithdrawalPhone(event.target.value)
                  }
                  placeholder="0712345678"
                  autoComplete="tel"
                  required
                />
              </div>

              <small>
                Use a Kenyan mobile number that can receive M-Pesa
                payments.
              </small>
            </div>

            <div className="ip-withdraw-summary">
              <div>
                <span>Withdrawal amount</span>
                <strong>
                  {withdrawalAmount !== '' &&
                  Number.isFinite(Number(withdrawalAmount)) &&
                  Number(withdrawalAmount) > 0
                    ? formatMoney(
                        Number(withdrawalAmount),
                        'KES'
                      )
                    : 'KES 0.00'}
                </strong>
              </div>

              <div>
                <span>Transaction fee</span>
                <strong>To be confirmed</strong>
              </div>

              <div className="ip-withdraw-net">
                <span>Estimated amount received</span>
                <strong>
                  Confirmed after fee calculation
                </strong>
              </div>
            </div>

            {error && (
              <div
                className="ip-withdraw-message"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary ip-withdraw-submit"
              disabled={
                walletBalance === null ||
                !withdrawalAmount ||
                !Number.isFinite(Number(withdrawalAmount)) ||
                Number(withdrawalAmount) <= 0 ||
                Number(withdrawalAmount) > Number(walletBalance) ||
                !withdrawalPhone.trim()
              }
            >
              Continue withdrawal <span>→</span>
            </button>

            <p className="ip-withdraw-note">
              Please verify your details before continuing.
              Withdrawal requests are not submitted until secure
              processing is enabled.
            </p>
          </form>
        </div>
      )}
    </div>

    {/* Withdrawal History */}
    <div className="panel-header">
      <div>
        <h2>Withdrawal history</h2>
        <p>
          Your submitted withdrawal requests and their statuses.
        </p>
      </div>
    </div>

    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Fee</th>
            <th>Destination</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{dateLabel(item.created_at)}</td>
                <td>
                  {formatMoney(item.amount, item.currency || 'KES')}
                </td>
                <td>
                  {formatMoney(item.fee, item.currency || 'KES')}
                </td>
                <td>{item.destination_phone}</td>
                <td>
                  <Status>{statusLabel(item.status)}</Status>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

  </section>
)}
```


      {!loading && !error && last === 'transactions' && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Transaction history</h2>
              <p>Deposits and withdrawals recorded for your account.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={5}>{emptyMessage}</td></tr>
                ) : rows.map((item, index) => (
                  <tr key={`${item.type}-${item.id || index}`}>
                    <td>{dateLabel(item.created_at)}</td>
                    <td>{item.type || 'Transaction'}</td>
                    <td>{item.reference || '—'}</td>
                    <td>{formatMoney(item.amount, item.currency || 'KES')}</td>
                    <td><Status>{statusLabel(item.status)}</Status></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!loading && !error && last === 'referrals' && (
  <>
    <div className="stats-grid member-stats">
      <StatCard
        icon={Users}
        label="Total referrals"
        value={referralInfo?.totalReferrals ?? '—'}
        note="Members linked to your referral code"
        tone="green"
      />

      <StatCard
        icon={BadgeCheck}
        label="Verified referrals"
        value={referralInfo?.verifiedReferrals ?? '—'}
        note="Members with verified email addresses"
        tone="blue"
      />

      <StatCard
        icon={HandCoins}
        label="Referral commissions"
        value={
          referralInfo?.commissionStatus === 'not_implemented'
            ? 'Not available'
            : '—'
        }
        note="Commission tracking is not implemented"
        tone="gold"
      />
    </div>

    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Your referral link</h2>
          <p>Share your personal link to track new registrations.</p>
        </div>
        <span className="small-icon">
          <Users size={17} />
        </span>
      </div>

      {!referralInfo?.referralCode ? (
        <p>
          Your referral code is not available yet. Please contact
          support if this continues.
        </p>
      ) : (
        <>
          <p>
            <b>Referral code:</b>{' '}
            {referralInfo.referralCode}
          </p>

          <div style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <input
              aria-label="Your referral link"
              readOnly
              value={referralInfo.referralLink || ''}
              style={{
                flex: '1 1 280px',
                minWidth: 0,
                padding: '12px',
                border: '1px solid #d7e0e9',
                borderRadius: 10,
                font: 'inherit'
              }}
            />

            <button
              type="button"
              className="btn btn-primary"
              disabled={!referralInfo.referralLink}
              onClick={() => {
                navigator.clipboard.writeText(
                  referralInfo.referralLink
                ).catch(() => {
                  window.prompt(
                    'Copy your referral link:',
                    referralInfo.referralLink
                  );
                });
              }}
            >
              <Copy size={16} /> Copy link
            </button>
          </div>
        </>
      )}

      <p style={{ marginTop: 16 }}>
        Commission amounts will only be shown once eligible purchases
        and payments can be verified by the backend.
      </p>
    </section>
    
<section className="panel">
  <div className="panel-header">
    <div>
      <h2>Referral history</h2>
      <p>People who registered using your referral link.</p>
    </div>
  </div>

  {!referralInfo?.referrals?.length ? (
    <div className="notice-strip">
      <Users size={19} />
      <div>
        <b>No referrals yet</b>
        <p>
          When someone registers using your referral link,
          their details will appear here.
        </p>
      </div>
    </div>
  ) : (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          minWidth: 720,
        }}
      >
        <thead>
          <tr>
            {[
              'Member',
              'Date joined',
              'Email verification',
              'Package',
              'Package status',
            ].map((heading) => (
              <th
                key={heading}
                style={{
                  padding: '14px 12px',
                  borderBottom: '1px solid #e5eaf0',
                  color: '#718096',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {referralInfo.referrals.map((person) => (
            <tr key={person.id}>
              <td
                style={{
                  padding: '15px 12px',
                  borderBottom: '1px solid #edf0f4',
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {person.fullName || 'Unnamed member'}
                </div>
                <div style={{ color: '#718096', fontSize: 13 }}>
                  {person.email}
                </div>
              </td>

              <td
                style={{
                  padding: '15px 12px',
                  borderBottom: '1px solid #edf0f4',
                  whiteSpace: 'nowrap',
                }}
              >
                {person.joinedAt
                  ? new Date(person.joinedAt).toLocaleDateString()
                  : '—'}
              </td>

              <td
                style={{
                  padding: '15px 12px',
                  borderBottom: '1px solid #edf0f4',
                }}
              >
                {person.emailVerified ? 'Verified' : 'Not verified'}
              </td>

              <td
                style={{
                  padding: '15px 12px',
                  borderBottom: '1px solid #edf0f4',
                }}
              >
                {person.packageName || 'No package yet'}
              </td>

              <td
                style={{
                  padding: '15px 12px',
                  borderBottom: '1px solid #edf0f4',
                }}
              >
                {person.packageStatus || 'No package'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
</>
)}

  
    </DashboardShell>
  );
}


function ConstructionIcon() { return <Settings size={28} /> }

function NotFound() { return <div className="not-found"><Brand /><h1>Page not found</h1><p>The page you're looking for doesn't exist in this prototype.</p><Link to="/" className="btn btn-primary">Return home</Link></div> }

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get('ref')?.trim().toUpperCase() || '';

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isRegister && password !== confirmPassword) {
     setError('Passwords do not match. Please check both fields.');
     return;
   }

setBusy(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
         isRegister
          ? {
             fullName,
             email,
             password,
             ...(referralCode ? { referralCode } : {}),
           }
          : { email, password }
     )
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to complete your request.');
      if (isRegister) {
        setMessage(data.message || 'Account created. Check your email to verify your account before logging in.');
      } else {
        if (!data.token || !data.user) throw new Error('The server response did not include a valid login session.');
        localStorage.setItem('investplus_token', data.token);
        localStorage.setItem('investplus_user', JSON.stringify(data.user));
        const requested = location.state?.from;
        const home = data.user.role === 'admin' ? '/admin' : '/member';

        const requestedPath = requested
           ? `${requested.pathname || ''}${requested.search || ''}${requested.hash || ''}`
           : '';

        const allowedDestination =
            data.user.role === 'admin'
            ? requested?.pathname?.startsWith('/admin')
            : requested?.pathname?.startsWith('/member');

        navigate(
            allowedDestination && requestedPath ? requestedPath : home,
            { replace: true }
        );
      }
    } catch (err) {
      setError(err.message || 'Could not connect to the server. Please try again.');
    } finally { setBusy(false); }
  }

  return <div className="not-found auth-page" style={{ minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '32px 16px', background: '#f5f8fa' }}>
    <Brand />
    <section className="panel auth-panel" style={{ width: 'min(100%, 620px)', boxSizing: 'border-box', padding: '32px 40px', borderRadius: 16, background: '#fff', textAlign: 'center' }}>
      <div className="eyebrow">{isRegister ? 'JOIN INVESTPLUS' : 'MEMBER ACCESS'}</div>
      <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
      <p>{isRegister ? 'Register with your details to get started.' : 'Log in to view your account and recorded activity.'}</p>
      <form onSubmit={submit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 16, width: '100%', maxWidth: 560, margin: '24px auto' }}>
        {isRegister && <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%', textAlign: 'left' }}>Full name<input style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: 52, padding: '12px 14px', border: '1px solid #d7e0e9', borderRadius: 10, font: 'inherit' }} autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} required minLength={2} maxLength={120} /></label>}
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%', textAlign: 'left' }}>Email address<input style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: 52, padding: '12px 14px', border: '1px solid #d7e0e9', borderRadius: 10, font: 'inherit' }} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} /></label>
        
<label style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%', textAlign: 'left' }}>
  Password
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
    <input
      style={{ display: 'block', flex: 1, minWidth: 0, boxSizing: 'border-box', minHeight: 52, padding: '12px 14px', border: '1px solid #d7e0e9', borderRadius: 10, font: 'inherit' }}
      type={showPassword ? 'text' : 'password'}
      autoComplete={isRegister ? 'new-password' : 'current-password'}
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
      minLength={isRegister ? 8 : 1}
      maxLength={72}
    />
    <button
      type="button"
      onClick={() => setShowPassword(current => !current)}
      style={{ minHeight: 44, padding: '8px 12px', border: '1px solid #d7e0e9', borderRadius: 10, background: '#fff', cursor: 'pointer', font: 'inherit' }}
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
</label>
       
{isRegister && (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8, width: '100%', textAlign: 'left' }}>
    <label htmlFor="auth-confirm-password">Confirm password</label>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <input
        id="auth-confirm-password"
        style={{ display: 'block', flex: 1, minWidth: 0, boxSizing: 'border-box', minHeight: 52, padding: '12px 14px', border: '1px solid #d7e0e9', borderRadius: 10, font: 'inherit' }}
        type={showConfirmPassword ? 'text' : 'password'}
        autoComplete="new-password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        maxLength={72}
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(current => !current)}
        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
        style={{ minHeight: 44, padding: '8px 12px', border: '1px solid #d7e0e9', borderRadius: 10, background: '#fff', cursor: 'pointer', font: 'inherit', whiteSpace: 'nowrap' }}
      >
        {showConfirmPassword ? 'Hide' : 'Show'}
      </button>
    </div>
    {confirmPassword && password !== confirmPassword && (
      <small style={{ color: '#c62828' }} role="alert">
        Passwords do not match.
      </small>
    )}
  </div>
)}


        {isRegister && <small style={{ display: 'block', textAlign: 'left', lineHeight: 1.5 }}>Use at least 8 characters, including uppercase, lowercase, and a special character.</small>}
        {error && <p role="alert" className="auth-error">{error}</p>}
        {message && <p role="status" className="auth-message">{message}</p>}
        <button className="btn btn-primary btn-large" style={{ alignSelf: 'flex-start' }} type="submit" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'} <ArrowRight size={17} /></button>
      </form>
      {!isRegister && (
        <p style={{ textAlign: 'right', marginTop: -8 }}>
          <Link className="auth-switch-link" to="/forgot-password">
           Forgot password?
          </Link>
        </p>
    )}
    <p className="auth-switch">
       {isRegister ? 'Already have an account?' : 'New to InvestPlus?'}{' '}
       <Link className="auth-switch-link" to={isRegister ? '/login' : '/register'}>
        {isRegister ? 'Log in' : 'Create an account'}
       </Link>
    </p>
      <Link to="/" className="text-link">Back to home</Link>
    </section>
  </div>;
}


function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to request a reset link.');
      }

      setMessage(data.message || 'If an account exists for that email, a reset link will be sent.');
    } catch (err) {
      setError(err.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="not-found auth-page" style={{ minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '32px 16px', background: '#f5f8fa' }}>
      <Brand />
      <section className="panel auth-panel" style={{ width: 'min(100%, 620px)', boxSizing: 'border-box', padding: '32px 40px', borderRadius: 16, background: '#fff', textAlign: 'center' }}>
        <div className="eyebrow">ACCOUNT RECOVERY</div>
        <h1>Forgot your password?</h1>
        <p>Enter your account email and we'll send you a password-reset link if an account exists.</p>
        <form onSubmit={submit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 16, width: '100%', maxWidth: 560, margin: '24px auto' }}>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8, textAlign: 'left' }}>
            Email address
            <input style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: 52, padding: '12px 14px', border: '1px solid #d7e0e9', borderRadius: 10, font: 'inherit' }} type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} />
          </label>
          {error && <p role="alert" className="auth-error">{error}</p>}
          {message && <p role="status" className="auth-message">{message}</p>}
          <button className="btn btn-primary btn-large" type="submit" disabled={busy}>
            {busy ? 'Please wait...' : 'Send reset link'} <ArrowRight size={17} />
          </button>
        </form>
        <Link className="auth-switch-link" to="/login">Back to login</Link>
      </section>
    </div>
  );
}

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Unable to reset your password.');
      }

      setMessage('Your password has been reset. Redirecting to login...');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="not-found auth-page" style={{ minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '32px 16px', background: '#f5f8fa' }}>
      <Brand />
      <section className="panel auth-panel" style={{ width: 'min(100%, 620px)', boxSizing: 'border-box', padding: '32px 40px', borderRadius: 16, background: '#fff', textAlign: 'center' }}>
        <div className="eyebrow">ACCOUNT SECURITY</div>
        <h1>Reset your password</h1>
        {!token ? (
          <>
            <p>This reset link is missing its token. Request a new one to continue.</p>
            <Link className="btn btn-primary" to="/forgot-password">Request reset link</Link>
          </>
        ) : (
          <>
            <p>Choose a new password with at least 8 characters, including uppercase, lowercase, and a special character.</p>
            <form onSubmit={submit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 16, width: '100%', maxWidth: 560, margin: '24px auto' }}>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8, textAlign: 'left' }}>
                New password
                <input style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: 52, padding: '12px 14px', border: '1px solid #d7e0e9', borderRadius: 10, font: 'inherit' }} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} maxLength={72} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8, textAlign: 'left' }}>
                Confirm new password
                <input style={{ display: 'block', width: '100%', boxSizing: 'border-box', minHeight: 52, padding: '12px 14px', border: '1px solid #d7e0e9', borderRadius: 10, font: 'inherit' }} type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} maxLength={72} />
              </label>
              {error && <p role="alert" className="auth-error">{error}</p>}
              {message && <p role="status" className="auth-message">{message}</p>}
              <button className="btn btn-primary btn-large" type="submit" disabled={busy}>
                {busy ? 'Please wait...' : 'Reset password'} <ArrowRight size={17} />
              </button>
            </form>
          </>
        )}
        <p><Link className="auth-switch-link" to="/login">Back to login</Link></p>
      </section>
    </div>
  );
}

function RequireAuth({ children, admin = false }) {
  const location = useLocation();
  const token = localStorage.getItem('investplus_token');

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem('investplus_user') || 'null'
    );
  } catch {}

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (admin && user.role !== 'admin') {
    return <Navigate to="/member" replace />;
  }

  if (!admin && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function App() {

  return <Routes>

    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/member" element={<RequireAuth><MemberDashboard /></RequireAuth>} />

    <Route path="/member/*" element={<RequireAuth><PlaceholderPage type="member" /></RequireAuth>} />

    <Route path="/admin" element={<RequireAuth admin><AdminDashboard /></RequireAuth>} />

    <Route path="/admin/*" element={<RequireAuth admin><PlaceholderPage type="admin" /></RequireAuth>} />

    <Route path="*" element={<NotFound />} />

  </Routes>

}
