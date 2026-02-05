import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export default function AdminLoginPage() {
  const authed = cookies().get('admin_auth')?.value === '1'
  if (authed) {
    redirect('/admin/submissions')
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container-narrow py-16">
        <h1 className="text-2xl font-semibold text-primary-900">Admin Login</h1>
        <p className="mt-2 text-sm text-primary-500">
          Enter the admin password to access submissions.
        </p>
        <div className="mt-8 max-w-md">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}

