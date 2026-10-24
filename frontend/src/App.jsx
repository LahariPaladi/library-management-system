import { useEffect, useMemo, useState } from 'react'
import { api } from './api'

const emptyBook = { title: '', author: '', isbn: '', category: '', totalCopies: 1, availableCopies: 1 }
const emptyMember = { name: '', email: '', phone: '' }
function App() {
  const [tab, setTab] = useState('Dashboard')
  const [dashboard, setDashboard] = useState({})
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [loans, setLoans] = useState([])
  const [search, setSearch] = useState('')
  const [bookForm, setBookForm] = useState(emptyBook)
  const [memberForm, setMemberForm] = useState(emptyMember)
  const [editingBook, setEditingBook] = useState(null)
  const [editingMember, setEditingMember] = useState(null)
  const [issueForm, setIssueForm] = useState({ bookId: '', memberId: '' })
  const [notice, setNotice] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  async function loadAll() {
    setLoading(true)
    try {
      const [d, b, m, l] = await Promise.all([api.dashboard(), api.books(search), api.members(), api.loans()])
      setDashboard(d); setBooks(b); setMembers(m); setLoans(l)
    } catch (e) { setNotice({ type: 'error', text: `${e.message}. Check that Spring Boot and MySQL are running.` }) }
    finally { setLoading(false) }
  }
  useEffect(() => { loadAll() }, [search])
  const activeLoans = useMemo(() => loans.filter(l => l.status === 'ACTIVE'), [loans])
  function flash(text, type = 'success') { setNotice({ text, type }); window.setTimeout(() => setNotice({ text: '', type: '' }), 4000) }
  async function submitBook(e) {
    e.preventDefault()
    try {
      const total = Number(bookForm.totalCopies), available = Number(bookForm.availableCopies)
      if (available > total) return flash('Available copies cannot exceed total copies.', 'error')
      await api.saveBook({ ...bookForm, totalCopies: total, availableCopies: available }, editingBook)
      setBookForm(emptyBook); setEditingBook(null); await loadAll(); flash(editingBook ? 'Book updated.' : 'Book added.')
    } catch (e) { flash(e.message, 'error') }
  }
  function editBook(b) { setEditingBook(b.id); setBookForm({ title:b.title, author:b.author, isbn:b.isbn||'', category:b.category||'', totalCopies:b.totalCopies, availableCopies:b.availableCopies }); window.scrollTo({top:0,behavior:'smooth'}) }
  async function deleteBook(id) { if (!window.confirm('Delete this book?')) return; try { await api.deleteBook(id); await loadAll(); flash('Book deleted.') } catch(e) { flash(e.message, 'error') } }
  async function submitMember(e) {
    e.preventDefault()
    try { await api.saveMember(memberForm, editingMember); setMemberForm(emptyMember); setEditingMember(null); await loadAll(); flash(editingMember ? 'Member updated.' : 'Member registered.') }
    catch(e) { flash(e.message, 'error') }
  }
  function editMember(m) { setEditingMember(m.id); setMemberForm({name:m.name,email:m.email,phone:m.phone||''}); window.scrollTo({top:0,behavior:'smooth'}) }
  async function deleteMember(id) { if (!window.confirm('Delete this member?')) return; try { await api.deleteMember(id); await loadAll(); flash('Member deleted.') } catch(e) { flash(e.message, 'error') } }
  async function issueBook(e) { e.preventDefault(); try { await api.issue(issueForm.bookId, issueForm.memberId); setIssueForm({bookId:'',memberId:''}); await loadAll(); flash('Book issued. Due date is 14 days from today.') } catch(e) { flash(e.message, 'error') } }
  async function returnBook(id) { try { await api.returnLoan(id); await loadAll(); flash('Book returned successfully.') } catch(e) { flash(e.message, 'error') } }

  const nav = ['Dashboard', 'Books', 'Members', 'Issue / Return']
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><div className="brand-mark">L</div><div><strong>Leaf & Ledger</strong><small>LIBRARY SYSTEM</small></div></div>
      <div className="side-label">WORKSPACE</div>{nav.map(n => <button key={n} className={`nav-item ${tab===n?'active':''}`} onClick={()=>setTab(n)}><span>{({Dashboard:'▦',Books:'▤',Members:'♙','Issue / Return':'⇄'})[n]}</span>{n}</button>)}
      <div className="side-bottom"><div className="online-dot"></div><span>Library desk</span><small>Local environment</small></div>
    </aside>
    <main className="main"><header className="topbar"><div><span className="eyebrow">LIBRARY OPERATIONS</span><h1>{tab}</h1></div><div className="top-right"><span className="status-dot"></span><span>System workspace</span><button className="refresh" onClick={loadAll} title="Refresh data">↻</button></div></header>
      {notice.text && <div className={`notice ${notice.type}`}>{notice.text}<button onClick={()=>setNotice({text:'',type:''})}>×</button></div>}
      {loading && <div className="loading">Syncing with the server…</div>}
      {tab==='Dashboard' && <section className="content"><div className="welcome"><div><span className="eyebrow light">YOUR COLLECTION, IN ONE PLACE</span><h2>A calmer way to manage<br/>your library.</h2><p>Keep your collection organised and every lending record up to date.</p></div><div className="welcome-icon">▤</div></div>
        <div className="stats"><Stat label="Book titles" value={dashboard.bookTitles ?? '—'} icon="▤" /><Stat label="Total copies" value={dashboard.totalCopies ?? '—'} icon="▥" /><Stat label="Available copies" value={dashboard.availableCopies ?? '—'} icon="✓" /><Stat label="Registered members" value={dashboard.members ?? '—'} icon="♙" /><Stat label="Active loans" value={dashboard.activeLoans ?? '—'} icon="⇄" /></div>
        <div className="panel"><div className="panel-heading"><div><h3>Recent lending activity</h3><p>Latest issues and returns recorded in the system.</p></div><button className="text-button" onClick={()=>setTab('Issue / Return')}>Manage loans →</button></div>
        {loans.length ? <div className="table-wrap"><table><thead><tr><th>BOOK</th><th>MEMBER</th><th>ISSUED</th><th>DUE DATE</th><th>STATUS</th></tr></thead><tbody>{loans.slice(0,5).map(l=><tr key={l.id}><td className="primary-cell">{l.book?.title}</td><td>{l.member?.name}</td><td>{l.issueDate}</td><td>{l.dueDate}</td><td><span className={`pill ${l.status==='ACTIVE'?'amber':'green'}`}>{l.status}</span></td></tr>)}</tbody></table></div> : <Empty text="No lending activity yet. Issue a book to see it here."/>}</div>
      </section>}
      {tab==='Books' && <section className="content two-column"><div className="panel form-panel"><div className="panel-heading"><div><h3>{editingBook?'Edit book':'Add a book'}</h3><p>Maintain your catalogue details.</p></div><span className="panel-icon">＋</span></div><form onSubmit={submitBook} className="form-grid">
        <Field label="Book title" required><input required value={bookForm.title} onChange={e=>setBookForm({...bookForm,title:e.target.value})} placeholder="e.g. The Alchemist"/></Field>
        <Field label="Author" required><input required value={bookForm.author} onChange={e=>setBookForm({...bookForm,author:e.target.value})} placeholder="Author name"/></Field>
        <Field label="ISBN"><input value={bookForm.isbn} onChange={e=>setBookForm({...bookForm,isbn:e.target.value})} placeholder="ISBN / catalogue ID"/></Field>
        <Field label="Category"><input value={bookForm.category} onChange={e=>setBookForm({...bookForm,category:e.target.value})} placeholder="e.g. Fiction"/></Field>
        <Field label="Total copies" required><input type="number" min="0" required value={bookForm.totalCopies} onChange={e=>setBookForm({...bookForm,totalCopies:e.target.value})}/></Field>
        <Field label="Available copies" required><input type="number" min="0" required value={bookForm.availableCopies} onChange={e=>setBookForm({...bookForm,availableCopies:e.target.value})}/></Field>
        <div className="form-actions"><button className="primary-btn" type="submit">{editingBook?'Save changes':'Add book'}</button>{editingBook&&<button type="button" className="secondary-btn" onClick={()=>{setEditingBook(null);setBookForm(emptyBook)}}>Cancel</button>}</div>
      </form></div><div className="panel list-panel"><div className="panel-heading"><div><h3>Book catalogue</h3><p>{books.length} matching record(s)</p></div></div><div className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, author or ISBN…"/></div>
        {books.length ? <div className="table-wrap"><table><thead><tr><th>BOOK</th><th>CATEGORY</th><th>COPIES</th><th>ACTIONS</th></tr></thead><tbody>{books.map(b=><tr key={b.id}><td><div className="primary-cell">{b.title}</div><small>{b.author} · {b.isbn||'No ISBN'}</small></td><td>{b.category||'—'}</td><td><span className={`pill ${b.availableCopies>0?'green':'amber'}`}>{b.availableCopies}/{b.totalCopies}</span></td><td><div className="actions"><button onClick={()=>editBook(b)} className="small-btn">Edit</button><button onClick={()=>deleteBook(b.id)} className="small-btn danger">Delete</button></div></td></tr>)}</tbody></table></div>:<Empty text="No books found. Add your first book using the form."/>}
      </div></section>}
      {tab==='Members' && <section className="content two-column"><div className="panel form-panel"><div className="panel-heading"><div><h3>{editingMember?'Edit member':'Register a member'}</h3><p>Keep member contact details current.</p></div><span className="panel-icon">♙</span></div><form onSubmit={submitMember} className="form-grid"><Field label="Full name" required><input required value={memberForm.name} onChange={e=>setMemberForm({...memberForm,name:e.target.value})} placeholder="Member name"/></Field><Field label="Email address" required><input type="email" required value={memberForm.email} onChange={e=>setMemberForm({...memberForm,email:e.target.value})} placeholder="name@example.com"/></Field><Field label="Phone"><input value={memberForm.phone} onChange={e=>setMemberForm({...memberForm,phone:e.target.value})} placeholder="Optional phone number"/></Field><div className="form-actions"><button className="primary-btn">{editingMember?'Save changes':'Register member'}</button>{editingMember&&<button type="button" className="secondary-btn" onClick={()=>{setEditingMember(null);setMemberForm(emptyMember)}}>Cancel</button>}</div></form></div><div className="panel list-panel"><div className="panel-heading"><div><h3>Member directory</h3><p>{members.length} registered member(s)</p></div></div>{members.length?<div className="table-wrap"><table><thead><tr><th>MEMBER</th><th>PHONE</th><th>ACTIONS</th></tr></thead><tbody>{members.map(m=><tr key={m.id}><td><div className="primary-cell">{m.name}</div><small>{m.email}</small></td><td>{m.phone||'—'}</td><td><div className="actions"><button className="small-btn" onClick={()=>editMember(m)}>Edit</button><button className="small-btn danger" onClick={()=>deleteMember(m.id)}>Delete</button></div></td></tr>)}</tbody></table></div>:<Empty text="No members registered yet."/>}</div></section>}
      {tab==='Issue / Return' && <section className="content"><div className="panel issue-panel"><div className="panel-heading"><div><h3>Issue a book</h3><p>Select a member and a book with available copies. The default loan period is 14 days.</p></div><span className="panel-icon">⇄</span></div><form className="issue-form" onSubmit={issueBook}><Field label="Book" required><select required value={issueForm.bookId} onChange={e=>setIssueForm({...issueForm,bookId:e.target.value})}><option value="">Choose a book…</option>{books.filter(b=>b.availableCopies>0).map(b=><option key={b.id} value={b.id}>{b.title} — {b.availableCopies} available</option>)}</select></Field><Field label="Member" required><select required value={issueForm.memberId} onChange={e=>setIssueForm({...issueForm,memberId:e.target.value})}><option value="">Choose a member…</option>{members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></Field><button className="primary-btn">Issue book</button></form></div>
      <div className="panel"><div className="panel-heading"><div><h3>Loan register</h3><p>Track active loans and completed returns.</p></div><span className="pill amber">{activeLoans.length} active</span></div>{loans.length?<div className="table-wrap"><table><thead><tr><th>BOOK</th><th>MEMBER</th><th>ISSUE DATE</th><th>DUE DATE</th><th>RETURN DATE</th><th>STATUS / ACTION</th></tr></thead><tbody>{loans.map(l=><tr key={l.id}><td className="primary-cell">{l.book?.title}</td><td>{l.member?.name}</td><td>{l.issueDate}</td><td>{l.dueDate}</td><td>{l.returnDate||'—'}</td><td>{l.status==='ACTIVE'?<button className="small-btn" onClick={()=>returnBook(l.id)}>Mark returned</button>:<span className="pill green">RETURNED</span>}</td></tr>)}</tbody></table></div>:<Empty text="No loans yet. Issue a book to create the first loan record."/>}</div></section>}
      <footer>Leaf & Ledger · Library Management System <span>React + Spring Boot + MySQL</span></footer>
    </main>
  </div>
}
function Stat({label,value,icon}){return <div className="stat-card"><div className="stat-icon">{icon}</div><div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div></div>}
function Field({label,required,children}){return <label className="field"><span>{label}{required&&<b> *</b>}</span>{children}</label>}
function Empty({text}){return <div className="empty"><div className="empty-icon">▤</div><p>{text}</p></div>}
export default App
