export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing or using Resumate (the "Service"), you agree to be bound by these Terms. If you disagree with any part, you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of the Service</h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>You must provide accurate information and comply with all applicable laws.</li>
                <li>You retain ownership of your content; you grant us a license to process it to generate your resume.</li>
                <li>You will not misuse the Service or attempt to access data without authorization.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data and Privacy</h2>
              <p className="text-gray-700">
                We process your data as described in our Privacy Policy. By using the Service, you consent to such processing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700">
                The Service, including the software and content provided by us, is protected by intellectual property laws. You may not copy, modify, or distribute any part without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Disclaimer</h2>
              <p className="text-gray-700">
                The Service is provided "as is" without warranties of any kind. We do not guarantee that the generated resumes will lead to employment.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, we shall not be liable for any indirect or consequential damages arising from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700">
                We may suspend or terminate your access to the Service if you violate these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-700">
                Questions about these Terms? Contact us at +91 8149576445.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}