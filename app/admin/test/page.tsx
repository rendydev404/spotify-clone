export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Admin Test Page</h1>
        <p className="text-gray-400">Jika Anda melihat halaman ini, routing admin berfungsi!</p>
        <a 
          href="/admin/analytics" 
          className="mt-4 inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors"
        >
          Ke Analytics Dashboard
        </a>
      </div>
    </div>
  );
} 