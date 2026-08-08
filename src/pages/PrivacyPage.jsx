import { Link } from 'react-router-dom'
import { PageHeader, Card, SectionHeading } from '../components/ui'

const RIGHTS = [
  'Request confirmation of whether personal information is held by the business.',
  'Request correction of inaccurate or incomplete contact details and project records.',
  'Request the deletion of personal contact profiles where retention is no longer required by law or legitimate business purpose.',
  'Withdraw consent to direct marketing at any time, where applicable.',
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-left">
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline mb-4"
      >
        Back to contact form
      </Link>
      <PageHeader
        title="Privacy Policy"
        subtitle="POPIA-aligned privacy notice for quote requests and project administration."
      />

      <Card className="space-y-6">
        <div>
          <SectionHeading>Responsible Party</SectionHeading>
          <p className="text-steel-700 leading-relaxed">
            KP Enterprise is the responsible party for processing personal information collected
            through this platform. We process names, email addresses, telephone numbers, and physical
            project locations solely for the purpose of generating manufacturing quotations,
            managing project communication, scheduling fabrication work, and supporting related
            customer service activity.
          </p>
        </div>

        <div>
          <SectionHeading>Data Security</SectionHeading>
          <p className="text-steel-700 leading-relaxed">
            Personal identifiers are stored securely inside an isolated cloud data layer using
            MongoDB Atlas and the associated application controls in this platform. The business does
            not sell personal information and does not share quote-request data with third-party
            marketing brokers.
          </p>
        </div>

        <div>
          <SectionHeading>Use Of Information</SectionHeading>
          <p className="text-steel-700 leading-relaxed">
            Information collected through the quote request process is limited to what is reasonably
            necessary to assess the requested fabrication work, issue a quotation, follow up on the
            enquiry, and complete any accepted project in line with the agreed scope.
          </p>
        </div>

        <div>
          <SectionHeading>Your Rights Under POPIA</SectionHeading>
          <div className="space-y-3 text-steel-700 leading-relaxed">
            {RIGHTS.map((right) => (
              <p key={right} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-brand-blue flex-shrink-0" aria-hidden="true" />
                <span>{right}</span>
              </p>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading>Retention</SectionHeading>
          <p className="text-steel-700 leading-relaxed">
            Records may be retained for legitimate accounting, operational, warranty, or dispute-
            resolution purposes. When information is no longer required, it will be deleted or
            anonymised in a reasonable and secure manner.
          </p>
        </div>

        <div className="rounded-2xl border border-steel-200 bg-steel-50 p-4">
          <h2 className="text-lg font-bold text-steel-900 mb-2 tracking-tight">Contact For Privacy Requests</h2>
          <p className="text-steel-700 leading-relaxed">
            Clients may request access, correction, or deletion of their personal contact profile by
            emailing{' '}
            <a href="mailto:info@kpenterprise.co.za" className="font-semibold text-brand-blue hover:underline">
              info@kpenterprise.co.za
            </a>{' '}
            or submitting a request through the customer portal once registered.
          </p>
        </div>
      </Card>
    </div>
  )
}
