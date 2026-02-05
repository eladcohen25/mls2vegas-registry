'use client'

import { useEffect, useMemo, useState } from 'react'

type Registration = {
  id: string
  created_at: string
  full_name: string
  email: string
  zip_code: string
  role: string
  business_name: string | null
  youth_club: string | null
  interested_in_tickets: string | null
  interested_in_partnership: string | null
  submission_type: string
  support_reason: string | null
}

type ApiResponse = {
  data: Registration[]
  total: number
  page: number
  pageSize: number
}

const ROLES = [
  { value: '', label: 'All roles' },
  { value: 'parent', label: 'Parent' },
  { value: 'player', label: 'Player' },
  { value: 'coach', label: 'Coach' },
  { value: 'fan', label: 'Fan' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'other', label: 'Other' },
]

export default function AdminSubmissions() {
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(25)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Registration[]>([])
  const [total, setTotal] = useState(0)
  const [appliedFilters, setAppliedFilters] = useState({
    role: '',
    search: '',
    start: '',
    end: '',
  })

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        role: appliedFilters.role,
        search: appliedFilters.search,
        start: appliedFilters.start,
        end: appliedFilters.end,
        page: String(page),
        pageSize: String(pageSize),
      })

      const res = await fetch(`/api/admin/registrations?${params.toString()}`, {
        cache: 'no-store',
      })

      const json = (await res.json()) as ApiResponse & { error?: string }
      if (!res.ok) {
        throw new Error(json.error || 'Failed to load registrations')
      }

      setData(json.data || [])
      setTotal(json.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, page])

  const applyFilters = () => {
    setPage(1)
    setAppliedFilters({ role, search, start, end })
  }

  const exportCsv = () => {
    const params = new URLSearchParams({
      role: appliedFilters.role,
      search: appliedFilters.search,
      start: appliedFilters.start,
      end: appliedFilters.end,
      format: 'csv',
    })
    window.open(`/api/admin/registrations?${params.toString()}`, '_blank')
  }

  return (
    <div>
      {/* Filters */}
      <div className="rounded-sm border border-primary-100 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="label">Role</label>
            <select className="select-field" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Start date</label>
            <input
              type="date"
              className="input-field"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div>
            <label className="label">End date</label>
            <input
              type="date"
              className="input-field"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Search</label>
            <input
              type="text"
              className="input-field"
              placeholder="Name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button className="btn-primary px-6 py-2 text-sm" onClick={applyFilters}>
            Apply filters
          </button>
          <button className="btn-secondary px-6 py-2 text-sm" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-sm border border-primary-100 bg-white">
        <table className="min-w-full divide-y divide-primary-100 text-sm">
          <thead className="bg-primary-50">
            <tr className="text-left text-primary-600">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Zip</th>
              <th className="px-4 py-3 font-medium">Support Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100 text-primary-800">
            {loading && (
              <tr>
                <td className="px-4 py-6 text-center text-primary-500" colSpan={7}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && data.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-primary-500" colSpan={7}>
                  No submissions found.
                </td>
              </tr>
            )}
            {!loading &&
              data.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.full_name || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.email || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.role || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.business_name || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{row.zip_code || '—'}</td>
                  <td className="px-4 py-3 max-w-[360px] truncate">
                    {row.support_reason || '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-sm text-primary-600">
        <div>
          Page {page} of {totalPages} • {total} total
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary px-3 py-1.5 text-xs"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="btn-secondary px-3 py-1.5 text-xs"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

