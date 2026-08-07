import { PageHeader, Card, SectionHeading } from '../components/ui'

const CLAUSES = [
  {
    title: 'Intellectual Property',
    body:
      'All custom designs, drawings, fabrication plans, structural layouts, and manufacturing configurations created for portable kitchens, trailers, steel gates, handrails, balustrades, and related fabricated products remain the property of the business unless a separate written assignment of rights is agreed in advance.',
  },
  {
    title: 'Quotation Validity',
    body:
      'All quotations generated through this platform are valid for exactly 30 calendar days from the date issued. This period reflects material market volatility, especially raw steel, welding consumables, transport inputs, and other fabrication-related supply costs.',
  },
  {
    title: 'Payment Terms',
    body:
      'A standard 50% deposit is payable before workshop fabrication begins. The balance is due in full prior to transport collection or delivery, unless a separate written agreement states otherwise.',
  },
  {
    title: 'Manufacturing Scope',
    body:
      'The quotation is based on the specifications submitted by the client. Any material changes, revised measurements, additional finishes, or scope expansions requested after acceptance may result in a revised price and extended production timelines.',
  },
  {
    title: 'Delivery And Collection',
    body:
      'Lead times are estimates only and may change depending on stock availability, workshop workload, weather conditions, access requirements, and transport scheduling. Risk in the product passes in accordance with the final written delivery or collection arrangement.',
  },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-left">
      <PageHeader
        title="Terms & Conditions"
        subtitle="Standard manufacturing and fabrication terms for quoted work." 
      />

      <Card className="space-y-6">
        <div>
          <SectionHeading>South African fabrication terms</SectionHeading>
          <p className="text-steel-700 leading-relaxed">
            These terms apply to quotations and accepted work for welding, metal fabrication,
            structural steel, portable kitchens, trailers, gates, and related manufactured products.
            They are intended to provide clear commercial boundaries for both parties before any
            workshop work begins.
          </p>
        </div>

        <div className="space-y-5">
          {CLAUSES.map((clause) => (
            <section key={clause.title} className="space-y-2">
              <h2 className="text-lg font-bold text-steel-900 tracking-tight">{clause.title}</h2>
              <p className="text-steel-700 leading-relaxed">{clause.body}</p>
            </section>
          ))}
        </div>

        <div className="rounded-2xl border border-steel-200 bg-steel-50 p-4">
          <h2 className="text-lg font-bold text-steel-900 mb-2 tracking-tight">Acceptance</h2>
          <p className="text-steel-700 leading-relaxed">
            By requesting a quotation, accepting a quote, or proceeding with a deposit, the client
            confirms that they have read and understood these terms and agree to be bound by them,
            subject to any separate written agreement signed by both parties.
          </p>
        </div>
      </Card>
    </div>
  )
}
