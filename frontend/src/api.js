const BASE = '/api'
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try { const data = await res.json(); message = data.message || data.error || message } catch {}
    throw new Error(message)
  }
  if (res.status === 204) return null
  return res.json()
}
export const api = {
  dashboard: () => request('/dashboard'),
  books: (search = '') => request(`/books${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  saveBook: (book, id) => request(id ? `/books/${id}` : '/books', { method: id ? 'PUT' : 'POST', body: JSON.stringify(book) }),
  deleteBook: id => request(`/books/${id}`, { method: 'DELETE' }),
  members: () => request('/members'),
  saveMember: (member, id) => request(id ? `/members/${id}` : '/members', { method: id ? 'PUT' : 'POST', body: JSON.stringify(member) }),
  deleteMember: id => request(`/members/${id}`, { method: 'DELETE' }),
  loans: () => request('/loans'),
  issue: (bookId, memberId) => request('/loans', { method: 'POST', body: JSON.stringify({ bookId: Number(bookId), memberId: Number(memberId) }) }),
  returnLoan: id => request(`/loans/${id}/return`, { method: 'PUT' })
}
