// Document types for the game
export const DOCUMENT_TYPES = {
  LETTER: 'letter',
  FINANCIAL: 'financial',
  DIARY: 'diary',
  NOTE: 'note',
  TELEGRAM: 'telegram'
}

// Letter templates - {from}, {to}, {content}
export const LETTER_TEMPLATES = [
  {
    type: DOCUMENT_TYPES.LETTER,
    title: 'Sealed Letter',
    template: `My Dearest {to},

I write this in utmost secrecy. {content}

We must act before it is too late. Meet me at the usual place.

Forever yours,
{from}`,
    contentOptions: [
      'The situation has become untenable. Our arrangement cannot continue under these circumstances.',
      'I have discovered what you truly intended. Do not think I will remain silent about this.',
      'The plan must proceed as discussed. There is no turning back now.',
      'I know what you did last summer. The evidence is in my possession.'
    ]
  },
  {
    type: DOCUMENT_TYPES.LETTER,
    title: 'Threatening Correspondence',
    template: `{to},

Consider this your final warning. {content}

You know what happens if you refuse.

- {from}`,
    contentOptions: [
      'Pay what you owe or face the consequences.',
      'Your secrets are not as safe as you believe.',
      'I have contacts in the press who would find your story most interesting.',
      'The authorities would be very interested in certain documents I possess.'
    ]
  }
]

// Financial document templates
export const FINANCIAL_TEMPLATES = [
  {
    type: DOCUMENT_TYPES.FINANCIAL,
    title: 'Bank Statement',
    template: `BARCLAYS BANK - CONFIDENTIAL

Account Holder: {suspect}
Date: November 1887

Recent Transactions:
- Withdrawal: £{amount} (marked URGENT)
- Transfer to: {recipient}
- Balance: OVERDRAWN

Note: Account flagged for suspicious activity.`,
    amounts: [5000, 10000, 25000, 50000]
  },
  {
    type: DOCUMENT_TYPES.FINANCIAL,
    title: 'Debt Notice',
    template: `NOTICE OF DEBT COLLECTION

To: {suspect}

This serves as formal notice that your outstanding debt of £{amount} to {creditor} is now due in full.

Failure to pay will result in legal action and seizure of assets.

FINAL WARNING`,
    amounts: [15000, 30000, 75000]
  }
]

// Diary entry templates
export const DIARY_TEMPLATES = [
  {
    type: DOCUMENT_TYPES.DIARY,
    title: 'Personal Diary Entry',
    template: `November 12th, 1887

{content}

I fear what tomorrow may bring. The victim suspects nothing, but for how long?

Must destroy this entry after reading.`,
    contentOptions: [
      'The arrangement is in place. By this time tomorrow, my problems will be solved permanently.',
      'Overheard a conversation today that changes everything. I now know the truth about the victim.',
      'The guilt weighs heavily, but what choice do I have? It is them or me.',
      'Met with my partner in this affair. We have agreed upon the method and the time.'
    ]
  }
]

// Quick note templates
export const NOTE_TEMPLATES = [
  {
    type: DOCUMENT_TYPES.NOTE,
    title: 'Hastily Scribbled Note',
    template: `{content}

9:15 - {location}

DESTROY AFTER READING`,
    contentOptions: [
      'It must be tonight. No more delays.',
      'The key is under the mat. You know what to do.',
      'Payment will be delivered after the deed is done.',
      'If you are reading this, it means I have succeeded.'
    ]
  }
]

// Telegram templates
export const TELEGRAM_TEMPLATES = [
  {
    type: DOCUMENT_TYPES.TELEGRAM,
    title: 'Urgent Telegram',
    template: `TELEGRAM - PRIORITY DELIVERY

TO: {to}
FROM: {from}

{content} STOP

DESTROY UPON RECEIPT STOP`,
    contentOptions: [
      'PLANS DISCOVERED STOP PROCEED IMMEDIATELY STOP',
      'PAYMENT RECEIVED STOP OBLIGATION FULFILLED STOP',
      'WITNESS ELIMINATED STOP PROCEED AS PLANNED STOP',
      'EVIDENCE SECURED STOP AWAIT FURTHER INSTRUCTIONS STOP'
    ]
  }
]

// All templates combined
export const ALL_DOCUMENT_TEMPLATES = [
  ...LETTER_TEMPLATES,
  ...FINANCIAL_TEMPLATES,
  ...DIARY_TEMPLATES,
  ...NOTE_TEMPLATES,
  ...TELEGRAM_TEMPLATES
]
