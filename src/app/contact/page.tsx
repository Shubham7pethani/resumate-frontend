export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
          <div className="space-y-6 text-gray-700">
            <p>We’re here to help with any questions about Resumate.</p>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Phone</h2>
              <p>+91 8149576445</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Support Hours</h2>
              <p>Mon–Fri, 9:00–18:00 IST</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
              <p>Resumate helps you generate professional resumes using your developer profile data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}