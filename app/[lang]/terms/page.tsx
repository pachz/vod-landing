'use client'

import { SiteFooter } from '@/components/layout'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-bg">
      <main className="pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-text-primary mb-8">Terms and Conditions</h1>
          <p className="text-sm text-text-secondary mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none text-text-primary space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-text-secondary leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-text-secondary leading-relaxed">
                Permission is granted to temporarily access the materials on this website for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-text-secondary space-y-2 ml-4 mt-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Subscription and Payment</h2>
              <p className="text-text-secondary leading-relaxed">
                When you subscribe to our services, you agree to pay the subscription fees as specified. 
                All fees are non-refundable except as required by law or as explicitly stated in our refund policy. 
                We reserve the right to change our pricing at any time, but we will notify you in advance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Account</h2>
              <p className="text-text-secondary leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to accept responsibility for all activities that occur under your account or password.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Content and Intellectual Property</h2>
              <p className="text-text-secondary leading-relaxed">
                All content on this website, including but not limited to text, graphics, logos, images, audio clips, 
                and software, is the property of Reham Diva or its content suppliers and is protected by copyright laws. 
                You may not reproduce, distribute, or create derivative works from any content without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-text-secondary leading-relaxed">
                In no event shall Reham Diva or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on this website, even if Reham Diva or an authorized representative has been notified 
                orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Revisions and Errata</h2>
              <p className="text-text-secondary leading-relaxed">
                The materials appearing on this website could include technical, typographical, or photographic errors. 
                Reham Diva does not warrant that any of the materials on its website are accurate, complete, or current. 
                We may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p className="text-text-secondary leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at hello@reham.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

