import React, { useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
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
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><ChartNoAxesCombined size={22}/></span><span>Invest<span className="brand-green">Plus</span><small>Grow Today, Build Tomorrow</small></span></Link>
}
function Button({ children, variant = 'primary', className = '', ...props }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>
}
function Status({ children }) {
  const value = String(children).toLowerCase()
  const cls = value.includes('pending') ? 'pending' : value.includes('illustrative') ? 'neutral' : 'success'
  return <span className={`status ${cls}`}><span/> {children}</span>
}
function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>
}
function PackageIcon({ name, size = 20 }) {
  const icons = { sprout: Sprout, layers: Layers, settings: Settings, gem: Gem, crown: Crown, star: Star, globe: Globe }
  const Icon = icons[name] || Package
  return <Icon size={size}/>
}

function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return <div className="landing">
    <header className="site-header">
      <div className="container nav-wrap">
        <Brand light/>
        <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button>
        <nav className={mobileOpen ? 'main-nav open' : 'main-nav'}>
          <a href="#home" onClick={() => setMobileOpen(false)}>Home</a><a href="#about" onClick={() => setMobileOpen(false)}>About</a><a href="#packages" onClick={() => setMobileOpen(false)}>Packages</a><a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a><a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
        </nav>
        <div className="nav-actions"><Link className="login-link" to="/member">Log in</Link><Link className="btn btn-primary" to="/member">Explore dashboard <ArrowRight size={16}/></Link></div>
      </div>
    </header>
    <main>
      <section className="hero" id="home">
        <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="pill"><span className="pulse-dot"/> A more informed approach to investing</div>
            <h1>Build your future.<br/><span>Think long term.</span></h1>
            <p className="hero-lead">Explore investment opportunities, follow your portfolio, and keep your financial activity in one clear, secure place.</p>
            <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/member">Explore member area <ArrowRight size={18}/></Link><a className="btn btn-outline btn-large" href="#about">Discover the platform</a></div>
            <div className="hero-trust"><span><ShieldCheck size={17}/> Security-minded design</span><span><ChartNoAxesCombined size={17}/> Transparent reporting</span></div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-a"/><div className="visual-orbit orbit-b"/>
            <div className="hero-art-card">
              <div className="art-top"><span className="live-dot"/> INVESTMENT OVERVIEW <span className="art-period">DEMO</span></div>
              <div className="art-balance-label">Portfolio overview</div><div className="art-balance">KSh 125,400 <span className="art-change"><ArrowUpRight size={15}/> Sample</span></div>
              <div className="art-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={earningsData}><defs><linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#27d78b" stopOpacity={0.35}/><stop offset="95%" stopColor="#27d78b" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="value" stroke="#38e69c" strokeWidth={3} fill="url(#heroGradient)"/></AreaChart></ResponsiveContainer></div>
              <div className="art-footer"><div><span className="art-icon"><Wallet size={16}/></span><span><small>Portfolio activity</small><b>View transactions</b></span></div><ArrowRight size={18}/></div>
            </div>
            <div className="float-card float-top"><span className="float-icon green"><ShieldCheck size={18}/></span><span><b>Clear records</b><small>Transactions tracked</small></span><BadgeCheck className="float-check" size={17}/></div>
            <div className="float-card float-bottom"><span className="float-icon gold"><CircleDollarSign size={19}/></span><span><b>Member tools</b><small>Packages & referrals</small></span></div>
          </div>
        </div>
        <div className="container hero-bottom"><div className="hero-metric"><span className="metric-icon"><Package size={19}/></span><div><b>7 package tiers</b><small>Compare available options</small></div></div><div className="hero-metric"><span className="metric-icon"><ReceiptText size={19}/></span><div><b>Clear activity history</b><small>Keep track of transactions</small></div></div><div className="hero-metric"><span className="metric-icon"><Users size={19}/></span><div><b>Referral tools</b><small>See eligible referrals</small></div></div><div className="hero-metric"><span className="metric-icon"><LockKeyhole size={19}/></span><div><b>Security focused</b><small>Designed for account safety</small></div></div></div>
      </section>
      <section className="section packages-section" id="packages">
        <div className="container"><SectionHeading eyebrow="PACKAGE OPTIONS" title="Explore the package tiers" description="Compare the proposed package prices and terms. Payout figures below are illustrative proposals, not guaranteed returns." action={<span className="subtle-link">All amounts in KSh <ArrowRight size={15}/></span>}/>
          <div className="package-grid">{packages.map((p, i) => <article className={`package-card ${i === 4 ? 'featured' : ''}`} key={p.name}>
            {i === 4 && <div className="popular-tag">FEATURED TIER</div>}
            <div className={`package-icon ${p.tone}`}><PackageIcon name={p.icon} size={22}/></div><h3>{p.name}</h3><p>{p.description}</p>
            <div className="package-price">{money(p.price)}<small> proposed entry amount</small></div>
            <div className="package-details"><div><span>Proposed daily payout</span><b>{money(p.daily)}</b></div><div><span>Illustrative duration</span><b>{p.duration} days</b></div><div><span>Illustrative total</span><b>{money(p.daily*p.duration)}</b></div></div>
            <Link to="/member" className={`btn ${i === 4 ? 'btn-primary' : 'btn-package'}`}>View details <ArrowRight size={15}/></Link>
          </article>)}</div>
          <div className="disclosure"><AlertCircle size={18}/><p><b>Important:</b> These figures reflect proposed package terms supplied for this design prototype. They are not verified or guaranteed investment returns. Real-money purchases and payout claims should only be enabled after the investment model, cash flows, and applicable regulatory requirements have been validated.</p></div>
        </div>
      </section>
      <section className="section feature-section" id="about"><div className="container feature-grid">
        <div className="feature-visual"><div className="feature-visual-inner"><div className="feature-orb"><ChartNoAxesCombined size={56}/></div><div className="feature-caption"><span className="live-dot"/> A clearer view of your activity</div><div className="mini-stat"><small>Transactions</small><b><ReceiptText size={17}/> One organized history</b></div></div></div>
        <div className="feature-copy"><div className="eyebrow">DESIGNED AROUND CLARITY</div><h2>Your activity,<br/><span>all in one place.</span></h2><p>InvestPlus is designed to give members a simple way to review package details, monitor account activity, and understand how each transaction is recorded.</p><div className="feature-list"><div><span><Check size={16}/></span><div><b>Understand the details</b><small>Review package terms, durations, fees, and risk information before making decisions.</small></div></div><div><span><Check size={16}/></span><div><b>Follow every transaction</b><small>See deposits, withdrawals, commissions, and account adjustments in one history.</small></div></div><div><span><Check size={16}/></span><div><b>Referral activity at a glance</b><small>Access your referral link and review commissions that meet the programme terms.</small></div></div></div><Link className="btn btn-dark" to="/member">Preview member dashboard <ArrowRight size={16}/></Link></div>
      </div></section>
      <section className="section how-section" id="how-it-works"><div className="container"><SectionHeading eyebrow="GETTING STARTED" title="A simple path to get familiar" description="The intended member journey, shown for product planning."/><div className="steps-grid">{[{n:'01',icon:UserRound,title:'Create an account',desc:'Register and complete any required identity checks.'},{n:'02',icon:Search,title:'Review the details',desc:'Understand the investment model, terms, and risks.'},{n:'03',icon:CreditCard,title:'Make a verified payment',desc:'Use an approved payment channel after launch requirements are met.'},{n:'04',icon:Activity,title:'Track activity',desc:'Review confirmed transactions and real investment performance.'}].map(s=><div className="step-card" key={s.n}><div className="step-head"><span>{s.n}</span><s.icon size={22}/></div><h3>{s.title}</h3><p>{s.desc}</p></div>)}</div></div></section>
      <section className="referral-section"><div className="container referral-banner"><div className="referral-art"><div className="referral-circle"><Users size={45}/></div><span className="referral-spark spark-one">✦</span><span className="referral-spark spark-two">✧</span></div><div className="referral-copy"><div className="eyebrow">MEMBER REFERRALS</div><h2>Share the platform.<br/><span>Track eligible rewards.</span></h2><p>The proposed referral programme uses a 15% commission on eligible, verified purchases. Full rules and eligibility conditions should be published before the programme goes live.</p><Link className="btn btn-primary" to="/member">Preview referral tools <ArrowRight size={16}/></Link></div><div className="referral-percent"><span>PROPOSED RATE</span><b>15<small>%</small></b><p>Subject to programme terms</p></div></div></section>
      <section className="section faq-section" id="faq"><div className="container faq-grid"><div><div className="eyebrow">NEED TO KNOW</div><h2>Questions worth<br/>asking first.</h2><p>Financial decisions deserve clear information. Review the investment structure and terms before committing funds.</p><a href="mailto:support@investplus.example" className="text-link">Contact support <ArrowRight size={15}/></a></div><div className="faq-list">{[{q:'Are the displayed returns guaranteed?',a:'No. The numbers are proposed figures for this design prototype and are not verified or guaranteed returns. Actual investment performance can vary and capital may be at risk.'},{q:'How does the referral programme work?',a:'The proposed rate is 15% of an eligible referred purchase after payment verification. The final programme rules, reversals, and eligibility criteria must be documented.'},{q:'Can I withdraw funds at any time?',a:'Withdrawal rules, timing, fees, and eligibility must be established in the final product terms and displayed clearly before users deposit funds.'},{q:'Is this platform ready to accept money?',a:'No. This is a frontend prototype using sample data. Backend security, payment verification, investment validation, and legal compliance are required before launch.'}].map((f,i)=><details key={f.q} open={i===0}><summary>{f.q}<ChevronDown size={18}/></summary><p>{f.a}</p></details>)}</div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><Brand light/><p>A prototype for clearer investment activity and member tools.</p><div className="footer-links"><a href="#about">About</a><a href="#packages">Packages</a><a href="#faq">Risk information</a><a href="mailto:support@investplus.example">Contact</a></div></div><div className="container footer-bottom"><span>© 2026 InvestPlus concept. All rights reserved.</span><span>Prototype only · Not financial advice</span></div></footer>
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
          Back to website
        </Link>
      </div>
    </aside>
  )
}

function DashboardShell({ type, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isAdmin = type === 'admin'
  return <div className="dashboard-shell">
    {sidebarOpen && <button className="sidebar-scrim" onClick={()=>setSidebarOpen(false)} aria-label="Close menu"/>}
    <div className={`sidebar-wrap ${sidebarOpen?'sidebar-open':''}`}><Sidebar type={type} onClose={()=>setSidebarOpen(false)}/></div>
    <div className="dashboard-main"><header className="dash-header"><div className="dash-header-left"><button className="icon-button mobile-sidebar-trigger" onClick={()=>setSidebarOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{isAdmin?'Administration':'Member area'}</b></div></div><div className="dash-header-actions"><button className="icon-button" aria-label="Search"><Search size={18}/></button><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18}/><i/></button><div className="profile-chip"><div className="avatar">{isAdmin?'AD':'JM'}</div><div><b>{isAdmin?'Admin User':'John Mwangi'}</b><small>{isAdmin?'Administrator':'Member account'}</small></div><ChevronDown size={15}/></div></div></header><main className="dashboard-content">{children}<footer className="dash-footer"><span>© 2026 InvestPlus · Prototype interface</span><span><ShieldCheck size={14}/> Sample data only</span></footer></main></div>
  </div>
}
function PageTitle({ title, subtitle, action }) {
  return <div className="page-title"><div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}
function StatCard({ icon: Icon, label, value, change, tone = 'green', note }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot">{change ? <span className="stat-change"><ArrowUpRight size={14}/>{change}</span> : <span className="stat-note">{note}</span>}</div></div>
}
function MemberDashboard() {
  const [period, setPeriod] = useState('7 days')
  const [toast, setToast] = useState('')
  const referralLink = 'https://investplus.example/ref/JOHN123'
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(referralLink); setToast('Referral link copied') }
    catch { setToast(referralLink) }
    window.setTimeout(()=>setToast(''), 2600)
  }
  return <DashboardShell type="member">
    <PageTitle title="Welcome back, John" subtitle="Here is a summary of your account activity." action={<div className="demo-label"><span/> DEMO DATA</div>}/>
    <div className="stats-grid member-stats"><StatCard icon={Wallet} label="Account balance" value="KSh 16,450" note="Sample balance" tone="green"/><StatCard icon={TrendingUp} label="Recorded activity" value="KSh 1,000" note="Illustrative only" tone="blue"/><StatCard icon={Users} label="Referral commissions" value="KSh 450" note="Pending review" tone="purple"/><StatCard icon={CreditCard} label="Available to request" value="KSh 1,450" note="Sample only" tone="gold"/></div>
    <div className="dashboard-two-col member-main-grid">
      <section className="panel chart-panel"><div className="panel-header"><div><h2>Account activity</h2><p>Illustrative activity history, not investment performance</p></div><select className="select-control" value={period} onChange={e=>setPeriod(e.target.value)}><option>7 days</option><option>30 days</option><option>90 days</option></select></div><div className="chart-legend"><span><i className="legend-dot green-dot"/> Recorded activity</span></div><div className="member-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={earningsData}><defs><linearGradient id="memberGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#13a66a" stopOpacity={0.2}/><stop offset="95%" stopColor="#13a66a" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8a96a8'}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8a96a8'}} tickFormatter={v=>`${v}`} width={40}/><Tooltip formatter={v=>money(v)}/><Area type="monotone" dataKey="value" stroke="#12a66a" strokeWidth={2.5} fill="url(#memberGradient)"/></AreaChart></ResponsiveContainer></div><div className="chart-note"><AlertCircle size={15}/> Sample chart data for layout preview. Live values will come from the backend.</div></section>
      <section className="panel"><div className="panel-header"><div><h2>Referral link</h2><p>Share your unique member link</p></div><span className="small-icon"><Users size={17}/></span></div><div className="referral-link-box"><span>{referralLink}</span><button onClick={copyLink} aria-label="Copy referral link"><Copy size={16}/></button></div>{toast&&<div className="toast-message"><Check size={14}/>{toast}</div>}<div className="referral-stats"><div><span>Total referrals</span><b>12</b><small>Sample count</small></div><div><span>Eligible commissions</span><b>KSh 1,800</b><small>Illustrative</small></div></div><div className="panel-divider"/><div className="referral-callout"><span><Users size={18}/></span><p><b>Invite with transparency</b><small>Make sure anyone you invite understands the product terms and risks.</small></p></div></section>
    </div>
    <div className="dashboard-two-col lower-grid"><section className="panel"><div className="panel-header"><div><h2>Active packages</h2><p>Your current package overview</p></div><Link to="/member/packages" className="subtle-link">View all <ArrowRight size={14}/></Link></div><div className="active-packages">{[{name:'Basic',price:1000,daily:70,progress:70,days:6,tone:'mint'},{name:'Beginner',price:3000,daily:200,progress:42,days:12,tone:'blue'},{name:'Premium',price:15000,daily:1000,progress:20,days:16,tone:'orange'}].map(p=><div className="active-package" key={p.name}><div className={`package-icon ${p.tone}`}><PackageIcon name={packages.find(x=>x.name===p.name)?.icon}/></div><div className="active-package-info"><div className="active-package-title"><b>{p.name}</b><span className="package-demo-tag">Sample</span></div><div className="active-package-meta">{money(p.price)} <span>·</span> Proposed daily figure {money(p.daily)}</div><div className="progress-track"><span style={{width:`${p.progress}%`}}/></div></div><div className="package-time"><b>{p.days} days</b><small>sample progress</small></div></div>)}</div><div className="panel-bottom-link"><Link to="/member/packages">Explore package details <ArrowRight size={15}/></Link></div></section>
      <section className="panel"><div className="panel-header"><div><h2>Recent transactions</h2><p>Your latest account activity</p></div><Link to="/member/transactions" className="subtle-link">View all <ArrowRight size={14}/></Link></div><div className="table-wrap"><table><thead><tr><th>Transaction</th><th>Amount</th><th>Status</th></tr></thead><tbody>{transactions.slice(0,4).map((t,i)=><tr key={i}><td><div className="transaction-cell"><span className={`transaction-icon tx-${i}`}><ReceiptText size={15}/></span><div><b>{t.type}</b><small>{t.date}</small></div></div></td><td className={t.amount>0?'amount-positive':''}>{t.amount>0?'+':''}{money(t.amount)}</td><td><Status>{t.status}</Status></td></tr>)}</tbody></table></div></section></div>
    <div className="notice-strip"><ShieldCheck size={19}/><div><b>Prototype notice</b><p>All balances, packages, commissions, and transactions shown here are sample interface data. They are not connected to a payment provider or investment account.</p></div></div>
  </DashboardShell>
}
function AdminDashboard() {
  const [range, setRange] = useState('Last 7 days')
  const [tab, setTab] = useState('All activity')
  return <DashboardShell type="admin">
    <PageTitle title="Admin overview" subtitle="Monitor platform activity, member transactions, and operational queues." action={<><select className="select-control date-select" value={range} onChange={e=>setRange(e.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select><Button variant="outline" onClick={()=>window.print()}><Download size={16}/> Export view</Button></>}/>
    <div className="admin-warning"><AlertCircle size={17}/><span><b>Demo environment:</b> all figures and user records are illustrative. No real payments or investment balances are connected.</span></div>
    <div className="stats-grid admin-stats"><StatCard icon={Users} label="Registered members" value="1,248" change="+12% sample" tone="blue"/><StatCard icon={ArrowDownLeft} label="Recorded deposits" value="KSh 2.45M" change="+8% sample" tone="green"/><StatCard icon={ArrowUpRight} label="Withdrawal requests" value="KSh 780K" note="12 awaiting review" tone="purple"/><StatCard icon={HandCoins} label="Referral commissions" value="KSh 342K" note="Sample ledger total" tone="gold"/></div>
    <div className="dashboard-two-col admin-charts"><section className="panel"><div className="panel-header"><div><h2>Deposits & withdrawals</h2><p>Sample transaction volumes</p></div><span className="chart-badge">{range}</span></div><div className="chart-legend"><span><i className="legend-dot green-dot"/> Deposits</span><span><i className="legend-dot blue-dot"/> Withdrawals</span></div><div className="admin-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={activityData} barGap={5}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1f5"/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8a96a8'}}/><YAxis tickLine={false} axisLine={false} tick={{fontSize:11,fill:'#8a96a8'}} width={35}/><Tooltip/><Bar dataKey="deposits" name="Deposits" fill="#12a66a" radius={[4,4,0,0]}/><Bar dataKey="withdrawals" name="Withdrawals" fill="#3988e5" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></section>
      <section className="panel"><div className="panel-header"><div><h2>Package distribution</h2><p>Sample active package mix</p></div><span className="small-icon"><PieIcon size={17}/></span></div><div className="pie-layout"><div className="pie-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={2} stroke="none">{pieData.map(p=><Cell key={p.name} fill={p.color}/>)}</Pie><Tooltip formatter={v=>`${v}%`}/></PieChart></ResponsiveContainer><div className="pie-center"><b>100%</b><small>Sample mix</small></div></div><div className="pie-legend">{pieData.map(p=><div key={p.name}><span><i style={{background:p.color}}/>{p.name}</span><b>{p.value}%</b></div>)}</div></div></section></div>
    <section className="panel admin-table-panel"><div className="panel-header admin-table-header"><div><h2>Recent activity</h2><p>Review transactions and operational statuses</p></div><Button variant="outline" onClick={()=>setTab(tab==='All activity'?'Needs review':'All activity')}><Filter size={15}/>{tab==='All activity'?'Show items to review':'Show all activity'}</Button></div><div className="table-tabs"><button className={tab==='All activity'?'selected':''} onClick={()=>setTab('All activity')}>All activity</button><button className={tab==='Needs review'?'selected':''} onClick={()=>setTab('Needs review')}>Needs review <span>2</span></button></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Member</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{adminTransactions.filter(t=>tab==='All activity'||t.status==='Pending review').map((t,i)=><tr key={i}><td>{t.date}</td><td><div className="user-cell"><span className="avatar small-avatar">{t.user.split(' ').map(x=>x[0]).join('')}</span><b>{t.user}</b></div></td><td>{t.type}</td><td><b>{money(t.amount)}</b></td><td><Status>{t.status}</Status></td><td><button className="table-action" onClick={()=>alert('Demo only: connect this action to an authenticated backend endpoint before production.')}>Review</button></td></tr>)}</tbody></table></div><div className="table-foot"><span>Showing {adminTransactions.filter(t=>tab==='All activity'||t.status==='Pending review').length} sample records</span><button className="subtle-link" onClick={()=>alert('Connect the backend to export verified records.')}>View transaction register <ArrowRight size={14}/></button></div></section>
    <div className="admin-bottom-grid"><div className="admin-shortcut"><span className="shortcut-icon blue"><Users size={19}/></span><div><b>Member management</b><p>Review accounts and verification status.</p><Link to="/admin/users">Manage members <ArrowRight size={14}/></Link></div></div><div className="admin-shortcut"><span className="shortcut-icon gold"><Clock3 size={19}/></span><div><b>Withdrawal review</b><p>Pending requests require controlled review.</p><Link to="/admin/withdrawals">Review queue <ArrowRight size={14}/></Link></div><span className="queue-count">2 pending</span></div><div className="admin-shortcut"><span className="shortcut-icon green"><ChartNoAxesCombined size={19}/></span><div><b>Investment reporting</b><p>Reconcile activity with real statements.</p><Link to="/admin/reports">Open reports <ArrowRight size={14}/></Link></div></div></div>
  </DashboardShell>
}

function PlaceholderPage({ type }) {
  const isAdmin = type === 'admin'
  const { pathname } = useLocation()
  const path = pathname.replace(/\/+$/, '')
  const last = path.split('/').pop()
  const title = last.replace(/-/g, ' ')
  const proper = title ? title[0].toUpperCase() + title.slice(1) : 'Overview'

  if (isAdmin) {
    return (
      <DashboardShell type="admin">
        <PageTitle title={proper} subtitle="Administration workspace." />
        <div className="panel placeholder-panel">
          <div className="placeholder-icon">
            <ConstructionIcon />
          </div>
          <h2>{proper} workspace</h2>
          <p>
            This administration page still needs authenticated backend
            endpoints, database records, and role-based permissions before it
            can manage real activity.
          </p>
          <Link to="/admin" className="btn btn-primary">
            Back to overview <ArrowRight size={16} />
          </Link>
        </div>
      </DashboardShell>
    )
  }

  const pageConfig = {
    packages: {
      title: 'My Packages',
      subtitle: 'Review package tiers and illustrative activity.',
    },
    earnings: {
      title: 'Earnings Activity',
      subtitle: 'Review sample earning records and their statuses.',
    },
    referrals: {
      title: 'Referrals',
      subtitle: 'View the sample referral link and commission records.',
    },
    withdrawals: {
      title: 'Withdrawals',
      subtitle: 'Review the sample withdrawal workflow.',
    },
    transactions: {
      title: 'Transactions',
      subtitle: 'Review sample account transaction records.',
    },
  }

  const config = pageConfig[last]

  if (!config) {
    return (
      <DashboardShell type="member">
        <PageTitle title={proper} subtitle="Member workspace." />
        <div className="panel placeholder-panel">
          <h2>Page not found</h2>
          <Link to="/member" className="btn btn-primary">
            Back to overview <ArrowRight size={16} />
          </Link>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell type="member">
      <PageTitle
        title={config.title}
        subtitle={config.subtitle}
        action={<div className="demo-label"><span /> DEMO DATA</div>}
      />

      <div className="notice-strip">
        <ShieldCheck size={19} />
        <div>
          <b>Demonstration records only</b>
          <p>
            This page displays frontend sample data. It does not confirm actual
            investments, earnings, payments, commissions, or withdrawable funds.
          </p>
        </div>
      </div>

      {last === 'packages' && (
        <div className="package-grid">
          {packages.map((pkg) => (
            <section className="panel" key={pkg.name}>
              <div className={`package-icon ${pkg.tone}`}>
                <PackageIcon name={pkg.icon} />
              </div>
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <div className="package-price">
                {money(pkg.price)}
                <small>Illustrative package price</small>
              </div>
              <div className="package-details">
                <div>
                  <span>Proposed daily figure</span>
                  <b>{money(pkg.daily)}</b>
                </div>
                <div>
                  <span>Proposed duration</span>
                  <b>{pkg.duration} days</b>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {last === 'earnings' && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Earnings ledger</h2>
              <p>Illustrative records from the existing sample data.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Activity</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter((t) => ['Referral', 'Payout'].includes(t.type))
                  .map((t, i) => (
                    <tr key={`${t.type}-${i}`}>
                      <td>{t.date}</td>
                      <td>{t.detail}</td>
                      <td>{money(t.amount)}</td>
                      <td><Status>{t.status}</Status></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {last === 'referrals' && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Your referral tools</h2>
              <p>Example link only; no live referral tracking yet.</p>
            </div>
          </div>
          <div className="referral-link-box">
            <span>https://investplus.example/ref/JOHN123</span>
          </div>
          <div className="panel-divider" />
          <div className="referral-callout">
            <span><Users size={18} /></span>
            <p>
              <b>Proposed referral rate: 15%</b>
              <small>
                Subject to published terms, eligible verified purchases, and
                backend commission calculations. No commission is confirmed by
                this demonstration.
              </small>
            </p>
          </div>
        </section>
      )}

      {last === 'withdrawals' && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Withdrawal history</h2>
              <p>Example workflow; requests are not submitted.</p>
            </div>
          </div>
          <div className="notice-strip">
            <AlertCircle size={19} />
            <div>
              <b>Withdrawal requests are not enabled</b>
              <p>
                A secure backend must verify available funds, validate the
                recipient details, prevent duplicate requests, and record
                approval and payment status.
              </p>
            </div>
          </div>
        </section>
      )}

      {last === 'transactions' && (
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Transaction history</h2>
              <p>Illustrative records, not verified account activity.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={`${t.type}-${i}`}>
                    <td>{t.date}</td>
                    <td>{t.type}</td>
                    <td>{t.detail}</td>
                    <td className={t.amount > 0 ? 'amount-positive' : ''}>
                      {t.amount > 0 ? '+' : ''}{money(t.amount)}
                    </td>
                    <td><Status>{t.status}</Status></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </DashboardShell>
  )
}

function ConstructionIcon(){return <Settings size={28}/>}
function NotFound(){return <div className="not-found"><Brand/><h1>Page not found</h1><p>The page you're looking for doesn't exist in this prototype.</p><Link to="/" className="btn btn-primary">Return home</Link></div>}

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/member" element={<MemberDashboard/>}/>
    <Route path="/member/*" element={<PlaceholderPage type="member"/>}/>
    <Route path="/admin" element={<AdminDashboard/>}/>
    <Route path="/admin/*" element={<PlaceholderPage type="admin"/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes>
}
