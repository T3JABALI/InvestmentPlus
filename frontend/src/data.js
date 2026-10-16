export const packages = [
  { name: 'Basic', price: 1000, daily: 70, duration: 20, tone: 'mint', icon: 'sprout', description: 'A simple starting point' },
  { name: 'Beginner', price: 3000, daily: 200, duration: 20, tone: 'blue', icon: 'layers', description: 'Build your portfolio' },
  { name: 'Semi Pro', price: 6000, daily: 400, duration: 20, tone: 'violet', icon: 'settings', description: 'For growing investors' },
  { name: 'Pro', price: 9000, daily: 600, duration: 20, tone: 'gold', icon: 'gem', description: 'A larger allocation' },
  { name: 'Premium', price: 15000, daily: 1000, duration: 20, tone: 'orange', icon: 'crown', description: 'Premium package tier' },
  { name: 'Star', price: 30000, daily: 2000, duration: 20, tone: 'pink', icon: 'star', description: 'For experienced members' },
  { name: 'World Class', price: 45000, daily: 2750, duration: 20, tone: 'teal', icon: 'globe', description: 'Our highest package tier' },
]

export const transactions = [
  { date: '15 Oct 2026', type: 'Deposit', detail: 'M-Pesa deposit', amount: 15000, status: 'Completed' },
  { date: '14 Oct 2026', type: 'Package', detail: 'Premium package purchase', amount: -15000, status: 'Completed' },
  { date: '13 Oct 2026', type: 'Referral', detail: 'Referral commission — sample', amount: 450, status: 'Pending review' },
  { date: '12 Oct 2026', type: 'Payout', detail: 'Daily allocation — demo', amount: 1000, status: 'Illustrative' },
]

export const adminTransactions = [
  { date: '15 Oct 2026', user: 'Brian O.', type: 'Deposit', amount: 15000, status: 'Completed' },
  { date: '15 Oct 2026', user: 'Amina W.', type: 'Withdrawal', amount: 2500, status: 'Pending review' },
  { date: '14 Oct 2026', user: 'Peter N.', type: 'Package purchase', amount: 6000, status: 'Completed' },
  { date: '14 Oct 2026', user: 'Faith K.', type: 'Withdrawal', amount: 1200, status: 'Pending review' },
]
