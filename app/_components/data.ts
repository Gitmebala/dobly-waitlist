export const terminalPrompts = [
  'When a salon booking is created, send a WhatsApp confirmation instantly, remind the client 24 hours before, and fill cancelled slots from the waitlist.',
  'When a new lead fills a law firm intake form, assign the lead, send a reply in under 2 minutes, and schedule the consultation automatically.',
  'When a client invoice becomes overdue, send polite follow-ups on day 3, day 7, and day 14 until payment lands.',
  'When a real estate inquiry comes in, send the listing brochure, notify the right agent, and create the follow-up task automatically.',
  'When a clinic appointment is booked, send confirmation, prep instructions, and a same-day reminder without staff touching it.',
  'When a Shopify order is marked paid, update inventory, notify fulfilment, and message the customer with delivery status.',
  'When a freelancer proposal is accepted, create the project folder, send the contract, issue the invoice, and book kickoff.',
  'When a support ticket is tagged urgent, route it to the right teammate and alert the manager immediately.',
  'When a gym lead asks about membership, send pricing, answer common questions, and nudge them to book a tour.',
  'Every Monday at 8am, send each client their performance report without anyone building decks by hand.',
  'When a recruiter receives a candidate application, score it, shortlist it, and send the next-step email automatically.',
  'When a contractor submits an invoice, check the amount against the approved budget and flag exceptions before payment.',
  'When a marketing agency gets a new lead, enrich the company, assign an owner, and send a personalised intro fast.',
  'When a restaurant reservation is made, confirm it instantly and recover no-shows with reminder messages.',
  'When a client pays via M-PESA, send a receipt, thank them on WhatsApp, and log the payment to the tracker.',
  'When a design freelancer gets feedback, turn it into tasks, assign due dates, and notify the client of the new timeline.'
] as const;

export const useCaseCategories = [
  {
    id: 'service-businesses',
    label: 'Service businesses',
    emoji: '🏪',
    items: [
      { problem: 'Missed bookings and no-shows keep punching holes in the week.', solution: '→ Confirm bookings instantly, remind clients, and refill cancelled slots automatically' },
      { problem: 'Staff spend mornings answering the same appointment questions again and again.', solution: '→ Auto-reply with pricing, availability, and booking links the moment someone asks' },
      { problem: 'You only realise a client forgot their appointment when the hour is already lost.', solution: '→ Trigger reminder sequences before every booking so fewer slots go empty' },
      { problem: 'Every payment still needs a manual thank-you, receipt, and spreadsheet update.', solution: '→ Send the message, issue the receipt, and log the payment on every transaction' },
      { problem: 'Follow-ups after quotes go cold because nobody remembers at the right moment.', solution: '→ Chase every quote automatically until the prospect books or says no' },
      { problem: 'Referrals are happening, but nobody captures them properly or follows up fast.', solution: '→ Route every referral to the right person and trigger a same-day response' }
    ]
  },
  {
    id: 'agencies-consultants',
    label: 'Agencies & consultants',
    emoji: '📈',
    items: [
      { problem: 'Weekly client updates still rely on someone remembering to build them.', solution: '→ Compile each report and send it every week without a manual checklist' },
      { problem: 'New leads sit too long before someone replies, and good deals die quietly.', solution: '→ Reply within minutes, assign an owner, and create the next action automatically' },
      { problem: 'Client onboarding takes the same setup work every single time.', solution: '→ Generate folders, forms, tasks, and kickoff emails the instant a deal closes' },
      { problem: 'Invoices go out, but collections still depend on awkward manual chasing.', solution: '→ Send overdue reminders on schedule until payment clears' },
      { problem: 'Campaign launches involve five tools and too many human handoffs.', solution: '→ Trigger launch notifications, logs, and approvals from one event' },
      { problem: 'Account managers are updating CRMs after meetings long after details are forgotten.', solution: '→ Turn meeting notes into CRM updates and follow-up tasks automatically' }
    ]
  },
  {
    id: 'shops-ecommerce',
    label: 'Shops & ecommerce',
    emoji: '🛍️',
    items: [
      { problem: 'Orders are coming in, but inventory and fulfilment still need manual updates.', solution: '→ Update stock, notify fulfilment, and message the buyer instantly' },
      { problem: 'Abandoned carts are just lost money because nobody follows them up on time.', solution: '→ Trigger email and WhatsApp recovery flows automatically after cart abandonment' },
      { problem: 'Customers ask for delivery updates and the team answers one by one.', solution: '→ Push shipping updates automatically whenever order status changes' },
      { problem: 'You find out a product is out of stock after customers already try to buy it.', solution: '→ Send low-stock alerts before you run out and pause ads if needed' },
      { problem: 'Five-star buyers leave happy, but nobody asks for reviews or repeat orders fast enough.', solution: '→ Trigger review requests and repeat-purchase offers after delivery' },
      { problem: 'Refunds and exceptions slip through the cracks because nobody logs them consistently.', solution: '→ Record every refund, notify the right person, and flag unusual patterns' }
    ]
  },
  {
    id: 'freelancers',
    label: 'Freelancers',
    emoji: '🧑‍💻',
    items: [
      { problem: 'A project gets approved and then you still manually create folders, contracts, and invoices.', solution: '→ Spin up the project workspace and send paperwork the second approval happens' },
      { problem: 'Leads come from three places and the follow-up process is different every time.', solution: '→ Capture every lead in one place and send the right reply instantly' },
      { problem: 'Client feedback arrives in fragments and task lists get rebuilt by hand.', solution: '→ Turn feedback into tasks with due dates the moment it lands' },
      { problem: 'You lose time every week reminding clients about unpaid invoices.', solution: '→ Chase overdue invoices automatically while you stay focused on delivery' },
      { problem: 'Discovery calls happen, but the proposal and recap still depend on end-of-day energy.', solution: '→ Send the recap, proposal, and next-step reminder automatically after the call' },
      { problem: 'You are doing admin work at night because your client ops only live in your head.', solution: '→ Let Dobly run your onboarding, follow-up, and payment admin for you' }
    ]
  },
  {
    id: 'health-education',
    label: 'Clinics & schools',
    emoji: '🏥',
    items: [
      { problem: 'Parents and patients ask the same scheduling questions every day.', solution: '→ Auto-answer booking, timing, and prep questions as soon as they come in' },
      { problem: 'Missed appointments create costly gaps that staff only notice too late.', solution: '→ Trigger reminder sequences that reduce no-shows before they happen' },
      { problem: 'Enrollment and intake forms arrive, but processing them is still manual.', solution: '→ Move every form into the right system and trigger the next communication step' },
      { problem: 'Staff keep sending the same admin reminders by hand every week.', solution: '→ Automate the reminders for payments, documents, and upcoming visits' },
      { problem: 'Follow-up after visits or consultations is inconsistent because it depends on memory.', solution: '→ Send every follow-up message and task on a reliable schedule' },
      { problem: 'Urgent issues can sit too long before the right person sees them.', solution: '→ Escalate priority cases instantly to the right staff member' }
    ]
  },
  {
    id: 'property-finance',
    label: 'Property & finance',
    emoji: '🏢',
    items: [
      { problem: 'Property inquiries come in fast, but response speed still depends on who is free.', solution: '→ Route every inquiry to the right agent and send details immediately' },
      { problem: 'Viewings, inspections, and reminder calls are still stitched together manually.', solution: '→ Confirm appointments, remind clients, and update calendars from one trigger' },
      { problem: 'Document collection slows down deals because follow-up is inconsistent.', solution: '→ Chase missing documents automatically until the file is complete' },
      { problem: 'Leads from ads and referrals are getting lost between WhatsApp, email, and forms.', solution: '→ Capture every lead into one workflow with ownership and next actions assigned' },
      { problem: 'Payment reminders are too manual, too late, and too awkward.', solution: '→ Trigger payment reminder sequences before and after due dates automatically' },
      { problem: 'Managers only get the numbers when someone has time to compile them.', solution: '→ Send daily or weekly pipeline summaries without manual reporting' }
    ]
  }
] as const;

export const comparisonRows = [
  ['Setup time', 'Hours', 'Hours', '10 seconds'],
  ['Technical skill', 'Required', 'Required', 'None'],
  ['AI designs', '✗', '✗', '✓'],
  ['Plain-English', '✗', '✗', '✓'],
  ['M-PESA native', '✗', '✗', '✓'],
  ['WhatsApp alerts', '✗', '✗', '✓'],
  ['For your business', 'Limited', 'Limited', '✓'],
  ['Time to first', '~2 hrs', '~3 hrs', '~2 minutes']
] as const;
