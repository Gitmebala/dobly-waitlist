export const terminalPrompts = [
  'When a salon booking is created, send a WhatsApp confirmation instantly, remind the client 24 hours before, and refill cancelled slots from the waitlist.',
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
    id: 'salons-spas',
    label: 'Salons and spas',
    emoji: 'Scissors',
    items: [
      { problem: 'No-shows quietly destroy appointment revenue every week.', solution: '-> Confirm bookings, send reminders, and refill cancelled slots automatically' },
      { problem: 'Every payment still triggers a manual thank-you and follow-up.', solution: '-> Send receipts, WhatsApp thank-yous, and review requests after every visit' }
    ]
  },
  {
    id: 'clinics',
    label: 'Clinics',
    emoji: 'Cross',
    items: [
      { problem: 'Patients miss prep instructions because staff send them too late.', solution: '-> Send booking confirmations, prep details, and same-day reminders automatically' },
      { problem: 'Urgent inbound messages wait too long before the right person sees them.', solution: '-> Route urgent messages instantly to the correct clinician or front-desk lead' }
    ]
  },
  {
    id: 'law-firms',
    label: 'Law firms',
    emoji: 'Scale',
    items: [
      { problem: 'High-value leads go cold because reply speed depends on who is free.', solution: '-> Reply within minutes, assign the matter, and book consultations automatically' },
      { problem: 'Document collection drags because no one follows up consistently.', solution: '-> Chase missing documents until the case file is complete' }
    ]
  },
  {
    id: 'accounting',
    label: 'Accounting firms',
    emoji: 'Ledger',
    items: [
      { problem: 'Clients upload records late and month-end turns chaotic fast.', solution: '-> Send recurring document reminders and escalate the missing accounts automatically' },
      { problem: 'Invoice collection becomes awkward manual chasing every month.', solution: '-> Trigger polite reminder sequences until payment lands' }
    ]
  },
  {
    id: 'agencies',
    label: 'Marketing agencies',
    emoji: 'Megaphone',
    items: [
      { problem: 'Weekly client reports still depend on someone building them by hand.', solution: '-> Compile and send client-ready performance reports every Monday automatically' },
      { problem: 'New leads sit too long before someone follows up.', solution: '-> Enrich, assign, and reply to every inbound lead in minutes' }
    ]
  },
  {
    id: 'consultants',
    label: 'Consultants',
    emoji: 'Briefcase',
    items: [
      { problem: 'Proposal follow-up is inconsistent and promising deals go stale.', solution: '-> Follow up on every proposal until it closes or gets declined' },
      { problem: 'Client onboarding repeats the same manual setup every time.', solution: '-> Create workspaces, forms, kickoff emails, and task lists when a deal closes' }
    ]
  },
  {
    id: 'ecommerce',
    label: 'Ecommerce stores',
    emoji: 'Cart',
    items: [
      { problem: 'Abandoned carts are just lost revenue because no one chases them on time.', solution: '-> Trigger recovery emails and WhatsApp nudges at the right intervals automatically' },
      { problem: 'Operations still update fulfilment and inventory manually after each order.', solution: '-> Sync stock, notify fulfilment, and update buyers as order status changes' }
    ]
  },
  {
    id: 'retail',
    label: 'Retail shops',
    emoji: 'Store',
    items: [
      { problem: 'You only notice low stock when customers start asking for what is gone.', solution: '-> Trigger reorder alerts before stock-outs happen' },
      { problem: 'Repeat buyers never get followed up at the right time.', solution: '-> Send post-purchase check-ins and repeat-order prompts automatically' }
    ]
  },
  {
    id: 'restaurants',
    label: 'Restaurants',
    emoji: 'Plate',
    items: [
      { problem: 'Reservations are confirmed manually and no-shows still happen.', solution: '-> Confirm reservations instantly and send timed reminder messages automatically' },
      { problem: 'Customer feedback arrives across channels and no one closes the loop fast enough.', solution: '-> Capture reviews, alert the manager, and trigger the right follow-up automatically' }
    ]
  },
  {
    id: 'hotels',
    label: 'Hotels',
    emoji: 'Key',
    items: [
      { problem: 'Guests ask the same pre-arrival questions over and over.', solution: '-> Send check-in details, upsells, and arrival info before each stay automatically' },
      { problem: 'Post-stay review requests only go out when someone remembers.', solution: '-> Ask for feedback and reviews right after checkout without manual work' }
    ]
  },
  {
    id: 'real-estate',
    label: 'Real estate',
    emoji: 'House',
    items: [
      { problem: 'Property inquiries come in fast, but follow-up depends on who is online.', solution: '-> Route every inquiry to the right agent and send the listing pack immediately' },
      { problem: 'Viewing reminders still rely on manual messages and calendar cleanup.', solution: '-> Confirm viewings, send reminders, and update calendars from one trigger' }
    ]
  },
  {
    id: 'property-managers',
    label: 'Property managers',
    emoji: 'Building',
    items: [
      { problem: 'Maintenance requests get lost between calls, texts, and email threads.', solution: '-> Turn every maintenance request into an assigned task with tenant updates' },
      { problem: 'Rent follow-up is too manual and too late.', solution: '-> Trigger payment reminders before and after due dates automatically' }
    ]
  },
  {
    id: 'recruiters',
    label: 'Recruiters',
    emoji: 'Users',
    items: [
      { problem: 'Candidate applications sit untouched until someone opens the inbox.', solution: '-> Score, shortlist, and send the next-step message automatically' },
      { problem: 'Interview scheduling burns hours every week.', solution: '-> Coordinate interview slots, confirmations, and reminders without back-and-forth' }
    ]
  },
  {
    id: 'freelance-designers',
    label: 'Design freelancers',
    emoji: 'Palette',
    items: [
      { problem: 'A project gets approved and you still spend the next hour doing admin.', solution: '-> Create folders, send contracts, issue invoices, and schedule kickoff automatically' },
      { problem: 'Feedback comes in fragments and timeline updates become manual cleanup.', solution: '-> Turn feedback into tasks and notify the client of the updated timeline' }
    ]
  },
  {
    id: 'freelance-developers',
    label: 'Developer freelancers',
    emoji: 'Code',
    items: [
      { problem: 'Leads come from everywhere and follow-up quality changes each time.', solution: '-> Capture every lead in one place and send the right first reply instantly' },
      { problem: 'Invoices and payment reminders still happen at the end of a tiring day.', solution: '-> Send invoices and overdue follow-ups automatically when milestones are hit' }
    ]
  },
  {
    id: 'coaches',
    label: 'Coaches',
    emoji: 'Target',
    items: [
      { problem: 'Prospects ask about packages, but the reply speed is inconsistent.', solution: '-> Send pricing, booking links, and a follow-up sequence the moment someone inquires' },
      { problem: 'Client check-ins only happen when you remember to send them.', solution: '-> Trigger recurring progress check-ins and reminders for every client automatically' }
    ]
  },
  {
    id: 'creators',
    label: 'Creators',
    emoji: 'Camera',
    items: [
      { problem: 'Brand inquiries disappear across DMs, email, and forms.', solution: '-> Capture partnership leads, respond fast, and log them automatically' },
      { problem: 'Sponsorship deliverables get tracked manually and slip late.', solution: '-> Create tasks, reminders, and status updates for every campaign automatically' }
    ]
  },
  {
    id: 'schools',
    label: 'Schools',
    emoji: 'School',
    items: [
      { problem: 'Parents miss payment, event, or document reminders because outreach is inconsistent.', solution: '-> Send scheduled reminders and confirmations automatically' },
      { problem: 'Admissions follow-up slows because nobody keeps the sequence moving.', solution: '-> Follow up on every inquiry until the application is completed or closed' }
    ]
  },
  {
    id: 'gyms',
    label: 'Gyms',
    emoji: 'Dumbbell',
    items: [
      { problem: 'Membership leads ask for pricing and then disappear before anyone follows up.', solution: '-> Send pricing, FAQs, and booking nudges automatically after each inquiry' },
      { problem: 'Class reminders and payment follow-ups still take staff time every day.', solution: '-> Trigger class reminders and failed-payment follow-ups automatically' }
    ]
  },
  {
    id: 'logistics',
    label: 'Logistics',
    emoji: 'Truck',
    items: [
      { problem: 'Customers keep asking where their delivery is because updates are not proactive.', solution: '-> Push shipment updates automatically at every status change' },
      { problem: 'Exceptions and delays are noticed too late by the ops team.', solution: '-> Alert the right person the moment a route or delivery goes off-plan' }
    ]
  },
  {
    id: 'construction',
    label: 'Construction',
    emoji: 'Crane',
    items: [
      { problem: 'Site updates and approvals still move through messy chat threads.', solution: '-> Trigger approval requests, status updates, and reminder escalations automatically' },
      { problem: 'Subcontractor invoices need manual checking before anyone notices an issue.', solution: '-> Compare invoice values against budget and flag anomalies automatically' }
    ]
  },
  {
    id: 'events',
    label: 'Events',
    emoji: 'Calendar',
    items: [
      { problem: 'Vendor and guest communication still depends on frantic manual follow-up.', solution: '-> Send confirmations, reminders, and day-of updates automatically' },
      { problem: 'Leads from event inquiries cool off while the team is busy producing current work.', solution: '-> Reply instantly, qualify the lead, and schedule the next step automatically' }
    ]
  },
  {
    id: 'support',
    label: 'Support teams',
    emoji: 'Headset',
    items: [
      { problem: 'Urgent tickets only move fast if the right person sees them in time.', solution: '-> Route urgent cases instantly and alert the right owner automatically' },
      { problem: 'Customers ask for updates while the ticket is still sitting in the queue.', solution: '-> Send proactive status updates until the issue is resolved' }
    ]
  },
  {
    id: 'finance-ops',
    label: 'Finance teams',
    emoji: 'Coins',
    items: [
      { problem: 'Collections are inconsistent because reminder timing depends on memory.', solution: '-> Run invoice reminder sequences before and after due dates automatically' },
      { problem: 'Large transactions and exceptions only get noticed after the fact.', solution: '-> Alert the team immediately when high-risk transactions appear' }
    ]
  },
  {
    id: 'travel',
    label: 'Travel businesses',
    emoji: 'Plane',
    items: [
      { problem: 'Booking updates and itinerary reminders still get sent one by one.', solution: '-> Send confirmations, itineraries, and reminder messages automatically' },
      { problem: 'Lead response time drops whenever the team is handling current clients.', solution: '-> Reply to every inquiry fast and route it to the right travel advisor automatically' }
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
  ['For your life too', '✗', '✗', '✓'],
  ['Time to first', '~2 hrs', '~3 hrs', '~2 minutes']
] as const;
