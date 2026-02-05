import AdminSubmissions from '@/components/admin/AdminSubmissions'

export default function AdminSubmissionsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container-wide py-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-primary-900">Submissions</h1>
            <p className="mt-2 text-sm text-primary-500">
              View and filter MLS to Vegas registrations.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <AdminSubmissions />
        </div>
      </div>
    </main>
  )
}

