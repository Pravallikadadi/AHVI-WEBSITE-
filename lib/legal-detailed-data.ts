export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "sub"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDetailedDoc = {
  title: string;
  effectiveDate?: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
  contact: { heading: string; lines: string[] };
  closing: { heading: string; lines: string[] };
};

export const LEGAL_DETAILED: Record<string, LegalDetailedDoc> = {
  "payment-policy": {
    title: "AHVI — Payment & Subscription Policy",
    lastUpdated: "15/09/2026",
    intro: [
      "This Payment & Subscription Policy (“Payment Policy”) explains the terms that apply when you purchase an AHVI subscription or any other paid service offered by AHVI Technologies Pvt Ltd (“AHVI”, “we”, “us”, or “our”).",
      "By purchasing or using a paid AHVI service, you agree to this Payment Policy, our Terms of Use and Privacy Policy.",
    ],
    sections: [
      {
        heading: "1. Paid Services",
        blocks: [
          { type: "p", text: "AHVI may offer subscription plans and other paid services through its website, mobile applications, app stores, or other authorized platforms." },
          { type: "p", text: "Before completing a purchase, you will be shown:" },
          { type: "list", items: ["The applicable price", "Subscription period", "Features included", "Renewal terms", "Applicable taxes or charges", "Any promotional terms", "Any applicable cancellation or refund conditions"] },
          { type: "p", text: "You will have the opportunity to review the purchase before payment is processed." },
        ],
      },
      {
        heading: "2. Pricing",
        blocks: [
          { type: "p", text: "Prices may vary based on:" },
          { type: "list", items: ["Your country or region", "Currency", "Platform", "Subscription type", "Promotional offers", "Applicable taxes"] },
          { type: "p", text: "The price displayed to you at checkout is the price applicable to your purchase, subject to any taxes or charges that are required to be disclosed separately." },
          { type: "p", text: "AHVI may change its prices from time to time." },
          { type: "p", text: "Any price change affecting an existing recurring subscription will be communicated where required by applicable law." },
        ],
      },
      {
        heading: "3. Currencies",
        blocks: [
          { type: "p", text: "AHVI may offer pricing in different currencies depending on your location and the payment platform you use." },
          { type: "p", text: "Where currency conversion is required, your bank, card issuer or payment provider may apply its own exchange rate or currency-conversion fee." },
          { type: "p", text: "AHVI is not responsible for fees imposed independently by your financial institution or payment provider." },
        ],
      },
      {
        heading: "4. Subscriptions",
        blocks: [
          { type: "p", text: "Some AHVI services may be offered as recurring subscriptions." },
          { type: "p", text: "Depending on the plan you select, your subscription may renew:" },
          { type: "list", items: ["Monthly", "Annually"] },
          { type: "p", text: "The renewal frequency and applicable price will be displayed before you complete your purchase." },
          { type: "p", text: "Unless you cancel before the applicable renewal date, your subscription may automatically renew and the applicable payment method may be charged." },
        ],
      },
      {
        heading: "5. Automatic Renewal",
        blocks: [
          { type: "p", text: "By purchasing a recurring subscription, you authorize AHVI or its authorized payment provider to charge your selected payment method for each renewal period." },
          { type: "p", text: "Your subscription will continue to renew until you cancel it." },
          { type: "p", text: "You can cancel your subscription before the next renewal date to prevent future charges." },
          { type: "p", text: "Cancellation does not normally terminate access immediately. Unless otherwise stated, you will generally continue to have access to the paid service until the end of the period you have already paid for." },
        ],
      },
      {
        heading: "6. Cancellation",
        blocks: [
          { type: "p", text: "You may cancel your subscription at any time." },
          { type: "p", text: "The cancellation process may depend on where you purchased the subscription." },
          { type: "sub", text: "If you purchased directly from AHVI" },
          { type: "p", text: "You may cancel through your AHVI account or the subscription-management process provided by AHVI." },
          { type: "sub", text: "If you purchased through an app store" },
          { type: "p", text: "You may need to cancel through your Apple App Store or Google Play account." },
          { type: "sub", text: "Important" },
          { type: "p", text: "Deleting the AHVI application does not necessarily cancel your subscription." },
          { type: "p", text: "You must cancel the subscription through the applicable subscription-management process." },
        ],
      },
      {
        heading: "7. Refunds",
        blocks: [
          { type: "p", text: "AHVI provides refunds in accordance with applicable law and the terms presented at the time of purchase." },
          { type: "p", text: "Unless otherwise required by law, subscription payments are generally non-refundable once a billing period has started." },
          { type: "p", text: "However, refunds may be available in circumstances such as:" },
          { type: "list", items: ["Duplicate charges", "Unauthorized transactions", "Technical errors resulting in an incorrect charge", "AHVI charging you after a valid cancellation", "Material failure to provide a paid service", "Other circumstances where a refund is required by applicable law"] },
          { type: "p", text: "Nothing in this Payment Policy limits any mandatory refund, cancellation or consumer rights available to you under the laws of your country." },
        ],
      },
      {
        heading: "8. Digital Services & Change-of-Mind Rights",
        blocks: [
          { type: "p", text: "AHVI provides digital services." },
          { type: "p", text: "Depending on your country, you may have statutory rights relating to digital content or digital services, including rights concerning cancellation, refunds, conformity or defective digital services." },
          { type: "p", text: "Where applicable law gives you rights that are more favorable than this Payment Policy, those rights will apply." },
          { type: "p", text: "For example, certain jurisdictions may provide consumers with a statutory cancellation or cooling-off period for online purchases." },
          { type: "p", text: "Where you expressly request immediate access to digital services and applicable law requires specific consent or acknowledgment regarding the loss or limitation of a cancellation right, AHVI will obtain that consent where required." },
        ],
      },
      {
        heading: "9. Promotional & Introductory Pricing",
        blocks: [
          { type: "p", text: "AHVI may offer:" },
          { type: "list", items: ["Introductory pricing", "Promotional discounts", "Founding-member pricing", "Limited-time offers", "Promotional codes", "Special subscription offers"] },
          { type: "p", text: "Promotional offers may have additional terms." },
          { type: "p", text: "Unless expressly stated otherwise, a promotional price applies only for the promotional period." },
          { type: "p", text: "After the promotional period ends, your subscription may renew at the then-current standard price." },
          { type: "p", text: "The applicable renewal price will be disclosed where required." },
        ],
      },
      {
        heading: "10. Free Trials & Previews",
        blocks: [
          { type: "p", text: "AHVI may occasionally provide free trials, limited previews or promotional access." },
          { type: "p", text: "If a trial converts into a paid subscription, the applicable conversion date, price and renewal terms will be clearly disclosed before or when the trial begins." },
          { type: "p", text: "You may cancel before the end of the applicable trial period to prevent a charge, subject to the terms presented when you started the trial." },
          { type: "p", text: "AHVI reserves the right to limit or discontinue promotional access where permitted by law." },
        ],
      },
      {
        heading: "11. Payment Methods",
        blocks: [
          { type: "p", text: "AHVI may support payment methods including:" },
          { type: "list", items: ["Credit cards", "Debit cards", "Digital wallets", "Bank transfers", "Local payment methods", "App-store billing", "Other payment methods supported by our authorized payment providers"] },
          { type: "p", text: "Available payment methods may vary by country and platform." },
        ],
      },
      {
        heading: "12. Payment Processors",
        blocks: [
          { type: "p", text: "Payments may be processed by third-party payment providers." },
          { type: "p", text: "These providers may collect and process payment information according to their own terms and privacy policies." },
          { type: "p", text: "AHVI generally does not store complete payment credentials such as your full card number or CVV when those details are processed directly by a payment provider." },
          { type: "p", text: "Payment providers may also conduct fraud, security and regulatory checks." },
        ],
      },
      {
        heading: "13. Failed Payments",
        blocks: [
          { type: "p", text: "If a recurring payment fails, AHVI or its payment provider may attempt to process the payment again where permitted." },
          { type: "p", text: "If payment cannot be successfully completed:" },
          { type: "list", items: ["Your access to paid features may be restricted or suspended.", "Your subscription may be cancelled.", "You may be asked to update your payment method."] },
          { type: "p", text: "You will not be intentionally charged for an unsuccessful transaction unless the payment is subsequently successfully processed." },
        ],
      },
      {
        heading: "14. Taxes & Government Charges",
        blocks: [
          { type: "p", text: "Depending on your location, your purchase may be subject to:" },
          { type: "list", items: ["Sales tax", "VAT", "GST", "Digital services taxes", "Other applicable taxes or government charges"] },
          { type: "p", text: "Where required, these amounts will be displayed or included in the purchase price." },
          { type: "p", text: "You are responsible for providing accurate billing and location information where necessary to determine applicable taxes." },
        ],
      },
      {
        heading: "15. App Store Purchases",
        blocks: [
          { type: "p", text: "If you purchase AHVI through the Apple App Store, Google Play or another third-party marketplace, your payment may be processed by that marketplace." },
          { type: "p", text: "In such cases:" },
          { type: "list", items: ["The marketplace's payment terms may apply.", "Subscription management may need to be performed through your marketplace account.", "Cancellation procedures may differ.", "Refund requests may need to be submitted to the marketplace where required."] },
          { type: "p", text: "AHVI does not control the independent payment policies of third-party marketplaces." },
        ],
      },
      {
        heading: "16. Unauthorized Transactions",
        blocks: [
          { type: "p", text: "If you believe that your payment method has been used without your authorization, please contact AHVI as soon as possible:" },
          { type: "p", text: "ahvi.aisignup@gmail.com" },
          { type: "p", text: "You should also contact your bank, card issuer or payment provider where appropriate." },
          { type: "p", text: "We may request information necessary to investigate the transaction." },
        ],
      },
      {
        heading: "17. Chargebacks & Payment Disputes",
        blocks: [
          { type: "p", text: "If you believe you have been incorrectly charged, we encourage you to contact AHVI first so that we can investigate and resolve the issue." },
          { type: "p", text: "You retain any rights you have to dispute unauthorized or improper transactions with your financial institution." },
          { type: "p", text: "AHVI may suspend accounts involved in fraudulent or abusive payment activity where permitted by law." },
        ],
      },
      {
        heading: "18. Subscription Price Changes",
        blocks: [
          { type: "p", text: "AHVI may change subscription prices as its Services develop." },
          { type: "p", text: "Where a price change affects an existing recurring subscription, we will provide notice where required by applicable law." },
          { type: "p", text: "You may cancel your subscription before the new price takes effect if you do not wish to continue at the revised price." },
        ],
      },
      {
        heading: "19. Service Availability",
        blocks: [
          { type: "p", text: "AHVI continuously develops and improves its Services." },
          { type: "p", text: "Features may be added, modified, replaced or discontinued." },
          { type: "p", text: "We will make reasonable efforts to maintain the availability of paid Services, but we do not guarantee uninterrupted or error-free access." },
          { type: "p", text: "Temporary interruptions may occur because of:" },
          { type: "list", items: ["Maintenance", "Technical issues", "Security incidents", "Internet or infrastructure failures", "Third-party service interruptions", "Events outside our reasonable control"] },
          { type: "p", text: "Nothing in this section limits mandatory rights you may have under applicable consumer law." },
        ],
      },
      {
        heading: "20. Termination",
        blocks: [
          { type: "p", text: "AHVI may suspend or terminate access to a paid account where reasonably necessary, including in cases of:" },
          { type: "list", items: ["Fraud", "Unauthorized use", "Payment abuse", "Violation of our Terms of Use", "Security concerns", "Legal requirements"] },
          { type: "p", text: "Where AHVI terminates a paid subscription for reasons unrelated to your violation of our terms, we may provide an appropriate refund for any unused prepaid period where required by applicable law or otherwise appropriate." },
        ],
      },
      {
        heading: "21. Refund Requests",
        blocks: [
          { type: "p", text: "To request a refund or report a billing issue, contact:" },
          { type: "p", text: "ahvi.aisignup@gmail.com" },
          { type: "p", text: "Please provide:" },
          { type: "list", items: ["Name", "Account email", "Transaction ID", "Date of payment", "Amount charged", "Reason for your request"] },
          { type: "p", text: "We may need to verify your identity and transaction before processing the request." },
          { type: "p", text: "Approved refunds will generally be returned through the original payment method." },
          { type: "p", text: "The time required for a refund to appear may depend on your bank or payment provider." },
        ],
      },
      {
        heading: "22. Your Statutory Rights",
        blocks: [
          { type: "p", text: "This Payment Policy is intended to supplement, not replace, your rights under applicable law." },
          { type: "p", text: "Depending on where you live, you may have mandatory rights relating to:" },
          { type: "list", items: ["Cancellation", "Refunds", "Automatic renewals", "Digital services", "Defective or unavailable services", "Consumer protection", "Payment disputes"] },
          { type: "p", text: "Nothing in this policy is intended to exclude or restrict any right that cannot legally be excluded or restricted." },
        ],
      },
      {
        heading: "23. Privacy & Payment Information",
        blocks: [
          { type: "p", text: "Payment-related personal information is handled in accordance with our Privacy Policy." },
          { type: "p", text: "We may process payment-related information for purposes including:" },
          { type: "list", items: ["Processing transactions", "Managing subscriptions", "Preventing fraud", "Providing customer support", "Resolving payment disputes", "Meeting legal and regulatory obligations"] },
          { type: "p", text: "For more information about how AHVI handles personal information, please refer to our Privacy Policy." },
        ],
      },
      {
        heading: "24. Changes to This Policy",
        blocks: [
          { type: "p", text: "AHVI may update this Payment Policy from time to time." },
          { type: "p", text: "If material changes are made, we may provide notice through the AHVI website, application, email or another appropriate method." },
          { type: "p", text: "The Last Updated date at the top of this policy will indicate when it was most recently revised." },
        ],
      },
      {
        heading: "25. Contact",
        blocks: [
          { type: "p", text: "For questions about payments, subscriptions, cancellations or refunds, see the contact details below." },
        ],
      },
    ],
    contact: {
      heading: "AHVI",
      lines: [
        "Website: ahvi.ai",
        "Payment Support: ahvi.aisignup@gmail.com",
        "Grievance / Privacy: ahvi.aisignup@gmail.com",
        "Legal Entity: AHVI Technologies Pvt Ltd",
      ],
    },
    closing: {
      heading: "Our Payment Promise",
      lines: ["Clear pricing.", "Secure payments.", "Easy cancellation.", "No surprises."],
    },
  },

  cookies: {
    title: "AHVI — Cookie Policy",
    lastUpdated: "15/09/2026",
    intro: [
      "This Cookie Policy explains how AHVI Technologies Pvt Ltd (“AHVI”, “we”, “us” or “our”) uses cookies and similar technologies on ahvi.ai, our applications and other digital services (collectively, the “Services”).",
      "We use cookies to make AHVI work, understand how people use our website, improve our Services, protect our users and, where permitted, measure the effectiveness of our communications.",
      "We believe you should understand what is happening with your data and have meaningful choices about non-essential cookies.",
    ],
    sections: [
      {
        heading: "1. What Are Cookies?",
        blocks: [
          { type: "p", text: "Cookies are small text files placed on your device when you visit a website." },
          { type: "p", text: "They allow a website to remember information about your visit, recognize your device, maintain sessions and understand how the website is being used." },
          { type: "p", text: "We may also use similar technologies, including:" },
          { type: "list", items: ["Pixels", "Web beacons", "Local storage", "SDKs", "Device identifiers", "Tracking technologies"] },
          { type: "p", text: "For simplicity, we refer to all of these technologies as “cookies” in this Policy." },
        ],
      },
      {
        heading: "2. Why AHVI Uses Cookies",
        blocks: [
          { type: "p", text: "We may use cookies for several purposes." },
          { type: "sub", text: "Essential functionality" },
          { type: "p", text: "These cookies are necessary for the website or service to function. They may help us:" },
          { type: "list", items: ["Keep you signed in", "Maintain secure sessions", "Remember essential settings", "Process requests", "Protect against fraud", "Maintain website security"] },
          { type: "p", text: "You generally cannot disable these cookies through our cookie preference tool because the Services may not function properly without them." },
          { type: "sub", text: "Preferences" },
          { type: "p", text: "These cookies help AHVI remember choices you make. For example:" },
          { type: "list", items: ["Language", "Region", "Interface preferences", "Cookie preferences", "Other settings"] },
          { type: "sub", text: "Analytics" },
          { type: "p", text: "Analytics technologies help us understand how visitors use AHVI. For example, we may learn:" },
          { type: "list", items: ["Which pages are visited", "How users navigate the website", "Which features are used", "How long users spend on pages", "Whether pages or features are functioning correctly", "How many people visit AHVI"] },
          { type: "p", text: "We use this information to improve the website and our Services." },
          { type: "p", text: "Where required by applicable law, we will obtain consent before placing non-essential analytics cookies." },
          { type: "sub", text: "Marketing & Performance" },
          { type: "p", text: "Where applicable and where permitted, we may use cookies or similar technologies to understand the effectiveness of our marketing campaigns." },
          { type: "p", text: "This may help us understand whether someone who interacted with an AHVI campaign later visited our website or signed up." },
          { type: "p", text: "We will not use sensitive personal information for targeted advertising merely because cookies are present." },
          { type: "p", text: "Where consent is legally required, we will request it before using marketing cookies." },
        ],
      },
      {
        heading: "3. Types of Cookies We May Use",
        blocks: [
          {
            type: "table",
            headers: ["Type", "Purpose", "Required?"],
            rows: [
              ["Strictly Necessary", "Security, login, sessions and core functionality", "Yes"],
              ["Preferences", "Remember your settings and choices", "Usually optional"],
              ["Analytics", "Understand website usage and performance", "Optional where required"],
              ["Marketing", "Measure campaigns and advertising", "Optional where required"],
            ],
          },
          { type: "p", text: "The exact cookies used by AHVI may change as our website and Services evolve." },
        ],
      },
      {
        heading: "4. Third-Party Cookies",
        blocks: [
          { type: "p", text: "Some cookies may be placed by third-party services that AHVI uses. These may include providers for:" },
          { type: "list", items: ["Website analytics", "Authentication", "Payments", "Security", "Customer support", "Marketing", "Advertising", "Embedded content"] },
          { type: "p", text: "Third-party providers may collect information through their own technologies and may process that information according to their own privacy policies." },
          { type: "p", text: "AHVI does not control the independent privacy practices of third-party providers." },
          { type: "p", text: "Where required, we will obtain your consent before allowing optional third-party cookies to operate." },
        ],
      },
      {
        heading: "5. Your Cookie Choices",
        blocks: [
          { type: "p", text: "When you first visit AHVI, we may display a cookie banner or preference centre where applicable. You may be able to:" },
          { type: "sub", text: "Accept all cookies" },
          { type: "p", text: "Allow optional cookies in addition to essential cookies." },
          { type: "sub", text: "Reject optional cookies" },
          { type: "p", text: "Allow only cookies necessary for the operation and security of AHVI." },
          { type: "sub", text: "Customize your choices" },
          { type: "p", text: "Choose which categories of optional cookies you allow." },
          { type: "p", text: "Your choices may vary depending on your location and applicable law." },
        ],
      },
      {
        heading: "6. Withdrawing Your Consent",
        blocks: [
          { type: "p", text: "Where AHVI relies on your consent for optional cookies, you can withdraw that consent at any time." },
          { type: "p", text: "You can do this through our Cookie Settings or preference centre, where available." },
          { type: "p", text: "Withdrawing consent does not affect the lawfulness of processing that occurred before your withdrawal." },
          { type: "p", text: "Some website functionality may be affected if certain cookies are disabled." },
        ],
      },
      {
        heading: "7. Browser Controls",
        blocks: [
          { type: "p", text: "Most modern browsers allow you to control or delete cookies through their settings. You can generally:" },
          { type: "list", items: ["Block cookies", "Delete existing cookies", "Block third-party cookies", "Receive notifications when cookies are placed"] },
          { type: "p", text: "However, disabling all cookies may cause some AHVI functionality to stop working." },
          { type: "p", text: "For instructions, refer to your browser's privacy or cookie settings." },
        ],
      },
      {
        heading: "8. Do Not Track",
        blocks: [
          { type: "p", text: "Some browsers provide a “Do Not Track” (DNT) signal." },
          { type: "p", text: "Because there is currently no universally consistent technical standard for responding to DNT signals, AHVI may not respond to all DNT signals." },
          { type: "p", text: "Where required by applicable law, we will honor legally recognized browser or device-based privacy signals." },
        ],
      },
      {
        heading: "9. Personal Information & Cookies",
        blocks: [
          { type: "p", text: "Cookies may sometimes be associated with information that can identify or relate to you." },
          { type: "p", text: "Where this occurs, such information will be handled in accordance with our Privacy Policy." },
          { type: "p", text: "Cookies themselves generally do not provide AHVI with access to information stored on your device beyond the information made available through the relevant technology and your permissions." },
        ],
      },
      {
        heading: "10. AHVI App & SDKs",
        blocks: [
          { type: "p", text: "The AHVI mobile application may use technologies similar to cookies, including software development kits (“SDKs”) and device identifiers. These technologies may be used for:" },
          { type: "list", items: ["Authentication", "Security", "Analytics", "Crash reporting", "Performance monitoring", "Personalization", "Feature functionality", "Marketing measurement, where permitted"] },
          { type: "p", text: "The permissions available to you may depend on your device and operating system." },
          { type: "p", text: "You can manage certain permissions through your device settings." },
        ],
      },
      {
        heading: "11. How Long Cookies Stay on Your Device",
        blocks: [
          { type: "p", text: "Cookies may be:" },
          { type: "sub", text: "Session cookies" },
          { type: "p", text: "These are deleted when you close your browser or session." },
          { type: "sub", text: "Persistent cookies" },
          { type: "p", text: "These remain on your device for a defined period or until you delete them." },
          { type: "p", text: "The retention period varies depending on the purpose of the cookie." },
          { type: "p", text: "We aim to retain cookies only for as long as reasonably necessary for their intended purpose." },
        ],
      },
      {
        heading: "12. Cookies and Personalized AHVI Experiences",
        blocks: [
          { type: "p", text: "AHVI's personalization is primarily designed around information you choose to provide and your interactions with AHVI." },
          { type: "p", text: "Cookies used on the AHVI website may help us remember preferences or understand website interactions." },
          { type: "p", text: "Cookies are not the sole basis on which AHVI builds your personal profile." },
          { type: "p", text: "Information provided directly to AHVI through the application or Services is governed by our Privacy Policy." },
        ],
      },
      {
        heading: "13. Children",
        blocks: [
          { type: "p", text: "AHVI is not intended for children below the minimum age permitted under applicable law." },
          { type: "p", text: "We do not knowingly use cookies to collect personal information from children in violation of applicable law." },
          { type: "p", text: "If you believe a child has provided personal information to AHVI, please contact us." },
        ],
      },
      {
        heading: "14. International Users",
        blocks: [
          { type: "p", text: "AHVI may operate internationally, and cookie requirements differ between countries and regions." },
          { type: "p", text: "Depending on your location, you may have additional rights regarding cookies and similar technologies." },
          { type: "p", text: "For example, applicable law may require AHVI to obtain consent before using certain non-essential cookies." },
          { type: "p", text: "AHVI will apply the cookie controls and consent mechanisms required by applicable law in the relevant jurisdiction." },
        ],
      },
      {
        heading: "15. Updates to This Cookie Policy",
        blocks: [
          { type: "p", text: "We may update this Cookie Policy when our Services, technologies, third-party providers or legal requirements change." },
          { type: "p", text: "When we make material changes, we may notify you through the website, application or another appropriate method." },
          { type: "p", text: "The “Last Updated” date at the top of this Policy indicates when it was most recently revised." },
        ],
      },
      {
        heading: "16. Contact Us",
        blocks: [
          { type: "p", text: "If you have questions about how AHVI uses cookies or want to exercise a privacy right, see the contact details below." },
        ],
      },
    ],
    contact: {
      heading: "AHVI Technologies Pvt Ltd",
      lines: [
        "Website: ahvi.ai",
        "Privacy Email: ahvi.aisignup@gmail.com",
        "Support Email: ahvi.aisignup@gmail.com",
      ],
    },
    closing: {
      heading: "Our Cookie Promise",
      lines: [
        "Cookies should make AHVI better — not make your privacy worse.",
        "We aim to use cookies responsibly, clearly explain why we use them, and give you meaningful control over non-essential cookies.",
      ],
    },
  },

  terms: {
    title: "Terms of Service",
    effectiveDate: "August 17, 2026",
    lastUpdated: "August 17, 2026",
    intro: [
      "Welcome to AHVI.",
      "These Terms of Service (“Terms”) govern your access to and use of the AHVI mobile application, website, and related services (collectively, the “Services”).",
      "By creating an account, accessing, or using AHVI, you agree to these Terms. If you do not agree with these Terms, please do not use the Services.",
    ],
    sections: [
      {
        heading: "1. About AHVI",
        blocks: [
          { type: "p", text: "AHVI is an AI-powered personal styling and wardrobe management platform designed to help users organize their wardrobe, discover outfits, receive styling recommendations, create style boards, and explore fashion-related ideas." },
          { type: "p", text: "AHVI provides recommendations and AI-generated content for informational and entertainment purposes. AHVI does not guarantee that any recommendation will be suitable, accurate, fashionable, available, or appropriate for every user or occasion." },
        ],
      },
      {
        heading: "2. Eligibility",
        blocks: [
          { type: "p", text: "You must be legally permitted to use the Services under the laws applicable to you." },
          { type: "p", text: "If you are below the applicable age of majority or minimum age for using the Services in your jurisdiction, you may use AHVI only with the involvement and permission of a parent or legal guardian where required by law." },
          { type: "p", text: "By using AHVI, you represent that the information you provide is accurate and that you have the legal capacity to agree to these Terms." },
        ],
      },
      {
        heading: "3. Your AHVI Account",
        blocks: [
          { type: "p", text: "Some AHVI features may require you to create an account." },
          { type: "p", text: "You agree to:" },
          { type: "list", items: ["Provide accurate and current information.", "Keep your account information updated.", "Keep your login credentials secure.", "Not share your account with unauthorized individuals.", "Notify us if you believe your account has been compromised.", "Accept responsibility for activity occurring through your account, except where caused by AHVI's negligence or unauthorized access beyond your reasonable control."] },
          { type: "p", text: "We reserve the right to suspend or terminate accounts that violate these Terms or applicable law." },
        ],
      },
      {
        heading: "4. Using AHVI",
        blocks: [
          { type: "p", text: "You may use AHVI only for lawful purposes and in accordance with these Terms." },
          { type: "p", text: "You agree not to:" },
          { type: "list", items: ["Use AHVI for unlawful, fraudulent, or abusive purposes.", "Attempt to gain unauthorized access to AHVI or its systems.", "Interfere with or disrupt the Services.", "Reverse engineer, decompile, or attempt to extract source code from AHVI except where permitted by applicable law.", "Scrape, copy, reproduce, or systematically collect AHVI content without permission.", "Circumvent security or access controls.", "Use automated systems to abuse or overload the Services.", "Upload malicious software, code, or files.", "Impersonate another person or entity.", "Use AHVI to violate another person's privacy, intellectual property, or other rights.", "Use AHVI's AI systems to generate content for illegal or harmful purposes."] },
        ],
      },
      {
        heading: "5. Your Content",
        blocks: [
          { type: "p", text: "You may upload, submit, create, or otherwise provide content through AHVI, including:" },
          { type: "list", items: ["Clothing and wardrobe photographs", "Personal photographs", "Outfit images", "Style preferences", "Text", "Reviews", "Feedback", "Style boards and mood boards", "Other materials you choose to provide"] },
          { type: "p", text: "You retain ownership of content that you own and upload to AHVI." },
          { type: "p", text: "By submitting content, you grant AHVI a limited, worldwide, non-exclusive, royalty-free license to host, store, process, reproduce, modify, transmit, and display that content solely as reasonably necessary to provide, operate, maintain, secure, and improve the Services, subject to our Privacy Policy and applicable law." },
          { type: "p", text: "You represent that you have the necessary rights and permissions to upload and use the content you provide." },
        ],
      },
      {
        heading: "6. Images of Other People",
        blocks: [
          { type: "p", text: "If you upload an image containing another person, you are responsible for ensuring that you have the appropriate permission or legal basis to upload and process that image." },
          { type: "p", text: "You must not use AHVI to process or distribute another person's photograph in a manner that violates their privacy, rights, or applicable law." },
        ],
      },
      {
        heading: "7. AI-Generated Recommendations",
        blocks: [
          { type: "p", text: "AHVI uses artificial intelligence and machine-learning technologies." },
          { type: "p", text: "AI-generated recommendations may include:" },
          { type: "list", items: ["Outfit combinations", "Styling suggestions", "Colour recommendations", "Wardrobe recommendations", "Style boards", "Fashion inspiration", "Product or shopping suggestions", "Other fashion-related content"] },
          { type: "p", text: "AI-generated content can sometimes be inaccurate, incomplete, outdated, or unsuitable." },
          { type: "p", text: "You are responsible for deciding whether to follow any recommendation." },
          { type: "p", text: "AHVI does not guarantee that:" },
          { type: "list", items: ["An outfit will look exactly as represented.", "A colour or style recommendation will suit you.", "A recommended product will remain available.", "Product prices or availability will remain accurate.", "AI-generated content will always be free from errors.", "Recommendations will meet your personal expectations."] },
          { type: "p", text: "AHVI should not be relied upon as professional, medical, financial, legal, or other specialized advice." },
        ],
      },
      {
        heading: "8. Virtual Try-On and Appearance Features",
        blocks: [
          { type: "p", text: "Certain AHVI features may use photographs or visual information to provide appearance-related or virtual styling experiences." },
          { type: "p", text: "These features are intended to provide an approximate visual representation or styling experience." },
          { type: "p", text: "Results may differ from real-world appearance, fit, colour, proportions, or product performance." },
          { type: "p", text: "You should not rely on virtual representations as a guarantee of how a product will actually look or fit." },
        ],
      },
      {
        heading: "9. Shopping and Third-Party Products",
        blocks: [
          { type: "p", text: "AHVI may display or recommend products from third-party brands, retailers, marketplaces, or other businesses." },
          { type: "p", text: "AHVI may provide links to third-party websites or services." },
          { type: "p", text: "Unless explicitly stated otherwise:" },
          { type: "list", items: ["AHVI does not manufacture or sell those third-party products.", "AHVI does not guarantee product quality, availability, authenticity, sizing, pricing, shipping, returns, or customer service.", "Purchases made through third-party platforms are subject to those platforms' terms and policies."] },
          { type: "p", text: "Any transaction with a third-party seller is between you and that seller." },
        ],
      },
      {
        heading: "10. Subscriptions and Paid Services",
        blocks: [
          { type: "p", text: "AHVI may offer free and paid features, subscriptions, trials, or other premium services." },
          { type: "p", text: "Before purchasing a paid service, you will be shown the applicable price and relevant subscription terms." },
          { type: "p", text: "Unless otherwise stated, subscriptions may automatically renew at the end of each billing period." },
          { type: "p", text: "You authorize the applicable payment provider or app store to charge the applicable subscription fee." },
          { type: "p", text: "Prices may change in the future. Where required by law, we will provide advance notice of material price changes." },
        ],
      },
      {
        heading: "11. Free Trials and Promotional Offers",
        blocks: [
          { type: "p", text: "AHVI may occasionally offer free trials, promotional pricing, discounts, referral programs, or other offers." },
          { type: "p", text: "Promotional offers may have additional terms." },
          { type: "p", text: "Unless otherwise stated, a free trial may automatically convert into a paid subscription when the trial period ends." },
          { type: "p", text: "You are responsible for cancelling before the end of the trial if you do not wish to continue with the paid subscription." },
        ],
      },
      {
        heading: "12. Cancellation and Refunds",
        blocks: [
          { type: "p", text: "You may cancel your subscription in accordance with the payment platform through which you purchased it." },
          { type: "p", text: "If you purchased through the Apple App Store or Google Play, cancellation and refund requests may be subject to the applicable store's policies and procedures." },
          { type: "p", text: "Unless required by applicable law or expressly stated otherwise, cancelling a subscription does not automatically entitle you to a refund for a partially used billing period." },
          { type: "p", text: "Nothing in these Terms limits any mandatory consumer rights you may have under applicable law." },
        ],
      },
      {
        heading: "13. Intellectual Property",
        blocks: [
          { type: "p", text: "AHVI and its underlying technology, software, design, branding, logos, graphics, interfaces, databases, text, features, and other materials are owned by or licensed to AHVI and are protected by applicable intellectual property laws." },
          { type: "p", text: "Except as expressly permitted by these Terms, you may not:" },
          { type: "list", items: ["Copy AHVI's software or technology.", "Reproduce or distribute AHVI's proprietary content.", "Modify or create derivative works from AHVI's Services.", "Use AHVI's trademarks or branding without permission.", "Attempt to commercially exploit AHVI's proprietary technology."] },
          { type: "p", text: "Your use of AHVI does not transfer ownership of AHVI's intellectual property to you." },
        ],
      },
      {
        heading: "14. Feedback",
        blocks: [
          { type: "p", text: "If you provide feedback, ideas, suggestions, or recommendations regarding AHVI, you agree that we may use that feedback without restriction or compensation to you." },
          { type: "p", text: "This does not give AHVI ownership of your independently owned intellectual property." },
        ],
      },
      {
        heading: "15. Third-Party Services",
        blocks: [
          { type: "p", text: "AHVI may rely on or integrate with third-party services, including cloud providers, AI providers, payment processors, analytics providers, authentication services, app stores, retailers, and other technology providers." },
          { type: "p", text: "Third-party services may have their own terms and privacy policies." },
          { type: "p", text: "AHVI is not responsible for the availability, security, accuracy, or practices of third-party services that AHVI does not control." },
        ],
      },
      {
        heading: "16. Availability of the Services",
        blocks: [
          { type: "p", text: "We aim to keep AHVI available and reliable, but we do not guarantee uninterrupted or error-free operation." },
          { type: "p", text: "The Services may occasionally be unavailable because of:" },
          { type: "list", items: ["Maintenance", "Updates", "Technical failures", "Security incidents", "Internet or infrastructure problems", "Third-party service interruptions", "Events outside our reasonable control"] },
          { type: "p", text: "We may modify, suspend, discontinue, or restrict any feature of AHVI at any time, subject to applicable law." },
        ],
      },
      {
        heading: "17. Account Suspension or Termination",
        blocks: [
          { type: "p", text: "We may suspend or terminate your access to AHVI if:" },
          { type: "list", items: ["You materially violate these Terms.", "You engage in fraudulent or abusive behaviour.", "You attempt to compromise AHVI's security.", "Your use creates legal, security, or operational risks.", "We are required to do so by law.", "We discontinue the relevant Services."] },
          { type: "p", text: "You may stop using AHVI at any time." },
          { type: "p", text: "Upon termination, provisions that by their nature should survive termination—including intellectual property, disclaimers, limitations of liability, indemnification, dispute resolution, and governing law—will continue to apply." },
        ],
      },
      {
        heading: "18. Privacy",
        blocks: [
          { type: "p", text: "Your use of AHVI is also governed by our Privacy Policy." },
          { type: "p", text: "Our Privacy Policy explains what information we collect, how we use it, how it may be shared, and the choices available to you." },
          { type: "p", text: "Privacy Policy: ahvi.ai/privacypolicy" },
        ],
      },
      {
        heading: "19. Disclaimers",
        blocks: [
          { type: "p", text: "To the maximum extent permitted by applicable law, AHVI is provided on an “as is” and “as available” basis." },
          { type: "p", text: "We do not guarantee that:" },
          { type: "list", items: ["AHVI will always be available.", "AHVI will be completely secure or error-free.", "AI recommendations will always be accurate.", "Information displayed through AHVI will always be current.", "Third-party products or services will meet your expectations.", "AHVI will achieve a particular styling, fashion, purchasing, or personal outcome."] },
          { type: "p", text: "You use AHVI and rely on its recommendations at your own discretion." },
          { type: "p", text: "Nothing in these Terms excludes or limits any warranty, right, or protection that cannot legally be excluded under applicable law." },
        ],
      },
      {
        heading: "20. Limitation of Liability",
        blocks: [
          { type: "p", text: "To the maximum extent permitted by applicable law, AHVI and its officers, directors, employees, affiliates, contractors, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or relating to your use of the Services." },
          { type: "p", text: "This may include loss of data, loss of profits, loss of business, loss of opportunities, or other indirect losses." },
          { type: "p", text: "To the maximum extent permitted by law, AHVI's total liability arising from your use of the Services will be limited to the amount you paid to AHVI for the Services during the twelve months immediately preceding the event giving rise to the claim." },
          { type: "p", text: "Nothing in these Terms limits liability that cannot legally be limited or excluded." },
        ],
      },
      {
        heading: "21. Indemnification",
        blocks: [
          { type: "p", text: "To the extent permitted by applicable law, you agree to defend, indemnify, and hold harmless AHVI and its officers, directors, employees, affiliates, contractors, and service providers from claims, liabilities, damages, losses, and expenses arising from:" },
          { type: "list", items: ["Your violation of these Terms.", "Your misuse of the Services.", "Content you upload or submit.", "Your violation of another person's rights.", "Your violation of applicable law."] },
          { type: "p", text: "This obligation does not apply to the extent that a claim results from AHVI's own unlawful conduct or negligence." },
        ],
      },
      {
        heading: "22. Changes to These Terms",
        blocks: [
          { type: "p", text: "We may update these Terms from time to time." },
          { type: "p", text: "If we make material changes, we may notify you through the application, website, email, or another reasonable method." },
          { type: "p", text: "The updated Terms will become effective on the date specified in the updated Terms." },
          { type: "p", text: "Your continued use of AHVI after the updated Terms become effective constitutes acceptance of the revised Terms, to the extent permitted by applicable law." },
        ],
      },
      {
        heading: "23. Governing Law and Disputes",
        blocks: [
          { type: "p", text: "These Terms will be governed by the laws of India, unless mandatory local law requires otherwise." },
          { type: "p", text: "Any dispute arising from or relating to these Terms or your use of AHVI will be subject to the jurisdiction of the courts having appropriate jurisdiction in India, subject to applicable consumer protection and other mandatory laws." },
          { type: "p", text: "Nothing in these Terms prevents you from exercising rights available to you under applicable consumer or data protection laws." },
        ],
      },
      {
        heading: "24. Severability",
        blocks: [
          { type: "p", text: "If any provision of these Terms is determined to be invalid, unlawful, or unenforceable, that provision will be interpreted or modified to the minimum extent necessary, and the remaining provisions will continue in full force and effect." },
        ],
      },
      {
        heading: "25. Entire Agreement",
        blocks: [
          { type: "p", text: "These Terms, together with the Privacy Policy and any additional terms expressly applicable to particular AHVI features or services, constitute the agreement between you and AHVI concerning your use of the Services." },
        ],
      },
      {
        heading: "26. Contact Us",
        blocks: [
          { type: "p", text: "If you have questions about these Terms, please contact us using the details below." },
        ],
      },
      {
        heading: "Acceptance",
        blocks: [
          { type: "p", text: "By creating an account, accessing, or using AHVI, you confirm that:" },
          { type: "list", items: ["You have read these Terms.", "You understand these Terms.", "You agree to be bound by these Terms.", "You will use AHVI in accordance with these Terms and applicable law."] },
          { type: "p", text: "Thank you for using AHVI." },
        ],
      },
    ],
    contact: {
      heading: "AHVI Technologies Pvt Ltd",
      lines: ["Email: ahvitechnologies@gmail.com"],
    },
    closing: {
      heading: "AHVI",
      lines: ["Plan ahead. Live in the moment."],
    },
  },

  privacy: {
    title: "Privacy Policy",
    effectiveDate: "August 17, 2026",
    lastUpdated: "August 17, 2026",
    intro: [
      "AHVI (“AHVI”, “we”, “us”, or “our”) respects your privacy and is committed to protecting the personal information you share with us.",
      "This Privacy Policy explains how AHVI collects, uses, stores, shares, and protects information when you use the AHVI mobile application, website, and related services (collectively, the “Services”).",
      "By using AHVI, you acknowledge that you have read and understood this Privacy Policy.",
    ],
    sections: [
      {
        heading: "1. Who We Are",
        blocks: [
          { type: "p", text: "AHVI is an AI-powered personal styling and wardrobe management platform that helps users discover, organize, and style the clothes and accessories they own and discover new looks." },
          { type: "p", text: "Privacy Contact: ahvitechnologies@gmail.com" },
          { type: "p", text: "Company/Legal Entity: AHVI Technologies Pvt Ltd" },
        ],
      },
      {
        heading: "2. Information We Collect",
        blocks: [
          { type: "p", text: "Depending on how you use AHVI, we may collect the following categories of information." },
          { type: "sub", text: "A. Account Information" },
          { type: "p", text: "When you create an account, we may collect:" },
          { type: "list", items: ["Name", "Email address", "Phone number", "Login credentials or authentication information", "Profile information you choose to provide"] },
          { type: "sub", text: "B. Wardrobe and Fashion Information" },
          { type: "p", text: "When you use AHVI's wardrobe and styling features, you may provide:" },
          { type: "list", items: ["Photographs of clothing, shoes, accessories, and other personal items", "Photos containing you or other people", "Clothing categories, colours, brands, sizes, and preferences", "Favourite looks and saved outfits", "Style preferences and fashion interests", "Occasion and event information", "Items you add to your digital wardrobe", "Style boards, mood boards, and other content you create"] },
          { type: "p", text: "We use this information to provide personalized styling recommendations and improve your AHVI experience." },
          { type: "sub", text: "C. Images and Visual Information" },
          { type: "p", text: "If you choose to upload photographs, AHVI may process those photographs using image-analysis and AI technologies to identify relevant visual information such as clothing items, colours, patterns, accessories, and other fashion-related characteristics." },
          { type: "p", text: "If you use optional visual features such as face or appearance analysis, we may process information derived from the image you provide for the specific feature you requested." },
          { type: "p", text: "AHVI does not use your photographs for advertising or sell your personal photographs to third parties." },
          { type: "p", text: "Where a feature does not require us to permanently retain an image, we may delete the image after processing or within the applicable retention period." },
          { type: "sub", text: "D. Usage and Device Information" },
          { type: "p", text: "We may automatically collect certain technical information when you use AHVI, including:" },
          { type: "list", items: ["Device type and model", "Operating system", "App version", "IP address", "Device identifiers", "Language and country/region settings", "Crash reports", "Diagnostic information", "General usage information", "Features used and interactions with the Services"] },
          { type: "p", text: "This information helps us maintain security, troubleshoot problems, understand product usage, and improve AHVI." },
          { type: "sub", text: "E. Purchases and Subscription Information" },
          { type: "p", text: "If you purchase an AHVI subscription or other paid service, we may receive information necessary to confirm and manage your purchase." },
          { type: "p", text: "Payment card or other payment information may be processed directly by the relevant payment provider or app store. We generally do not receive or store your complete payment card number." },
          { type: "sub", text: "F. Information You Provide Through Support" },
          { type: "p", text: "If you contact us, we may collect:" },
          { type: "list", items: ["Your name", "Contact information", "The contents of your message", "Attachments or other information you voluntarily provide"] },
          { type: "p", text: "We use this information to respond to your request and improve customer support." },
        ],
      },
      {
        heading: "3. How We Use Your Information",
        blocks: [
          { type: "p", text: "We may use personal information to:" },
          { type: "list", items: ["Create and manage your AHVI account.", "Provide personalized styling recommendations.", "Organize and manage your digital wardrobe.", "Analyze clothing images and identify fashion-related attributes.", "Generate style boards, outfit recommendations, mood boards, and other requested content.", "Remember your preferences and personalize the Services.", "Provide features you specifically request.", "Process subscriptions and purchases.", "Communicate with you about your account, subscriptions, updates, security, and support.", "Detect, prevent, and investigate fraud, abuse, security incidents, or violations of our terms.", "Monitor and improve the performance, reliability, and functionality of AHVI.", "Conduct analytics and product research.", "Develop and improve our AI and styling systems, subject to applicable law and the choices and disclosures provided to you.", "Comply with applicable laws, regulations, legal processes, and lawful requests."] },
          { type: "p", text: "We will not use personal information for purposes that are materially different from those described in this Privacy Policy without providing appropriate notice or obtaining consent where required." },
        ],
      },
      {
        heading: "4. AI and Personalization",
        blocks: [
          { type: "p", text: "AHVI uses artificial intelligence and machine-learning technologies to provide personalized styling experiences." },
          { type: "p", text: "Depending on the feature you use, your information may be processed to:" },
          { type: "list", items: ["Understand your wardrobe", "Identify clothing and accessories in images", "Understand your stated preferences", "Generate outfit recommendations", "Personalize style boards and recommendations", "Improve the accuracy and usefulness of AHVI"] },
          { type: "p", text: "AHVI does not claim that AI-generated recommendations are always accurate, appropriate, or suitable for every individual." },
          { type: "p", text: "Where third-party AI or technology providers process information on our behalf, they are required to handle information consistently with applicable contractual, privacy, and security requirements." },
        ],
      },
      {
        heading: "5. When We Share Information",
        blocks: [
          { type: "p", text: "We do not sell your personal information." },
          { type: "p", text: "We may share information only when reasonably necessary to operate AHVI, provide requested services, protect our users, or comply with law. This may include sharing information with:" },
          { type: "sub", text: "Service Providers" },
          { type: "p", text: "We may use trusted third-party providers for services such as:" },
          { type: "list", items: ["Cloud hosting and storage", "AI and image processing", "Analytics", "Authentication", "Customer support", "Payment processing", "Security and fraud prevention", "Notifications and communications"] },
          { type: "p", text: "These providers may access information only as necessary to provide services to AHVI." },
          { type: "sub", text: "Legal and Safety Requirements" },
          { type: "p", text: "We may disclose information where reasonably necessary to:" },
          { type: "list", items: ["Comply with applicable law", "Respond to valid legal processes", "Protect the rights, safety, and property of AHVI, our users, or others", "Detect or investigate fraud, abuse, or security issues"] },
          { type: "sub", text: "Business Transfers" },
          { type: "p", text: "If AHVI is involved in a merger, acquisition, financing, restructuring, sale of assets, or similar transaction, personal information may be transferred as part of that transaction, subject to applicable law and appropriate protections." },
        ],
      },
      {
        heading: "6. Your Photos and Wardrobe Data",
        blocks: [
          { type: "p", text: "Your wardrobe is personal to you." },
          { type: "p", text: "Photos and wardrobe information that you upload are used to provide AHVI's features and personalize your experience." },
          { type: "p", text: "We do not sell your wardrobe, photographs, or personal styling information." },
          { type: "p", text: "You should avoid uploading photographs or information belonging to another person unless you have the appropriate permission to do so." },
          { type: "p", text: "You are responsible for ensuring that content you upload does not violate another person's privacy, intellectual property, or other rights." },
        ],
      },
      {
        heading: "7. Data Retention",
        blocks: [
          { type: "p", text: "We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including to:" },
          { type: "list", items: ["Provide the Services", "Maintain your account", "Meet legal and regulatory obligations", "Resolve disputes", "Enforce our agreements", "Maintain security and prevent abuse", "Maintain appropriate business and technical records"] },
          { type: "p", text: "You may request deletion of your account and associated personal information as described below." },
          { type: "p", text: "Certain information may need to be retained where required by law or where reasonably necessary for legitimate legal, security, or fraud-prevention purposes." },
        ],
      },
      {
        heading: "8. Deleting Your Account and Data",
        blocks: [
          { type: "p", text: "You may request deletion of your AHVI account and personal information." },
          { type: "p", text: "You can request deletion through:" },
          { type: "p", text: "Email: ahvi.aisignup@gmail.com" },
          { type: "p", text: "When we receive a valid deletion request, we will take reasonable steps to delete or anonymize information that we are not legally or otherwise required to retain." },
          { type: "p", text: "If AHVI provides an in-app account deletion function, you may also delete your account directly through the application." },
          { type: "p", text: "Deletion may not immediately remove information that is required to be retained by law or that has been irreversibly anonymized." },
        ],
      },
      {
        heading: "9. Your Privacy Choices and Rights",
        blocks: [
          { type: "p", text: "Depending on your location and applicable law, you may have rights relating to your personal information, including the ability to:" },
          { type: "list", items: ["Know what personal information we process", "Request access to your personal information", "Request correction of inaccurate information", "Request deletion of your information", "Withdraw consent where processing is based on consent", "Request information about how your data is used or shared", "Raise a grievance or privacy complaint", "Exercise other rights available under applicable data protection law"] },
          { type: "p", text: "We may need to verify your identity before processing certain requests." },
          { type: "p", text: "You can contact us at: ahvitechnologies@gmail.com" },
        ],
      },
      {
        heading: "10. Consent",
        blocks: [
          { type: "p", text: "Where required by applicable law, AHVI will obtain your consent before processing personal information." },
          { type: "p", text: "You may withdraw consent where legally permitted by contacting us or using the relevant controls within the application." },
          { type: "p", text: "Withdrawing consent may affect our ability to provide certain features or Services that depend on that information." },
        ],
      },
      {
        heading: "11. Children's Privacy",
        blocks: [
          { type: "p", text: "AHVI is not intended for children who are below the minimum age permitted to use the Services under applicable law." },
          { type: "p", text: "We do not knowingly collect personal information from children in violation of applicable law." },
          { type: "p", text: "If you believe that a child has provided personal information to AHVI without appropriate authorization, please contact us at: ahvi.aisignup@gmail.com" },
          { type: "p", text: "If we become aware that we have collected such information in violation of applicable requirements, we will take reasonable steps to delete it." },
        ],
      },
      {
        heading: "12. Security",
        blocks: [
          { type: "p", text: "We take reasonable technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure." },
          { type: "p", text: "These measures may include access controls, authentication, encryption where appropriate, secure infrastructure, monitoring, and other security practices." },
          { type: "p", text: "However, no internet transmission or electronic storage system can be guaranteed to be completely secure." },
          { type: "p", text: "You are responsible for maintaining the confidentiality of your account credentials." },
        ],
      },
      {
        heading: "13. International Data Transfers",
        blocks: [
          { type: "p", text: "Some of our technology, hosting, AI, analytics, or service providers may process information in countries other than the country in which you live." },
          { type: "p", text: "Where personal information is transferred across borders, we will take reasonable steps to ensure that the transfer and processing are carried out in accordance with applicable data protection laws." },
        ],
      },
      {
        heading: "14. Third-Party Services and Links",
        blocks: [
          { type: "p", text: "AHVI may contain links to third-party websites, products, services, or platforms." },
          { type: "p", text: "Third-party services operate under their own privacy policies. AHVI is not responsible for the privacy practices of third parties that we do not control." },
          { type: "p", text: "We encourage you to review the privacy policies of third-party services before providing them with personal information." },
        ],
      },
      {
        heading: "15. Analytics and Advertising",
        blocks: [
          { type: "p", text: "We may use analytics technologies to understand how users interact with AHVI, identify technical problems, measure performance, and improve the Services." },
          { type: "p", text: "If we use advertising or tracking technologies that require consent under applicable law or platform requirements, we will provide the relevant disclosures and choices." },
          { type: "p", text: "We will not permit third parties to use your personal information for purposes inconsistent with this Privacy Policy." },
        ],
      },
      {
        heading: "16. Notifications",
        blocks: [
          { type: "p", text: "If you enable notifications, AHVI may send you:" },
          { type: "list", items: ["Account notifications", "Subscription-related notifications", "Service updates", "Styling or wardrobe reminders you request", "Product or feature updates", "Promotional communications where permitted"] },
          { type: "p", text: "You can control certain notifications through your device or AHVI settings." },
        ],
      },
      {
        heading: "17. Changes to This Privacy Policy",
        blocks: [
          { type: "p", text: "We may update this Privacy Policy from time to time." },
          { type: "p", text: "When we make material changes, we may notify you through the AHVI application, website, email, or another appropriate method." },
          { type: "p", text: "The updated Privacy Policy will include a revised “Last Updated” date." },
          { type: "p", text: "Your continued use of AHVI after the effective date of an updated Privacy Policy means that you acknowledge the updated policy, subject to any consent requirements under applicable law." },
        ],
      },
      {
        heading: "18. Governing Law",
        blocks: [
          { type: "p", text: "This Privacy Policy is governed by the laws applicable to AHVI and its users, including applicable data protection and privacy laws in India." },
          { type: "p", text: "Where you are located outside India, mandatory privacy rights applicable to you under the laws of your jurisdiction will continue to apply where required." },
        ],
      },
      {
        heading: "19. Contact Us",
        blocks: [
          { type: "p", text: "If you have questions, concerns, requests, or complaints regarding this Privacy Policy or AHVI's handling of personal information, please contact us using the details below." },
          { type: "p", text: "Subject line: Privacy Request / Data Deletion Request" },
          { type: "p", text: "We will review and respond to privacy requests within the period required by applicable law." },
        ],
      },
    ],
    contact: {
      heading: "AHVI Technologies Pvt Ltd",
      lines: ["Email: ahvitechnologies@gmail.com"],
    },
    closing: {
      heading: "AHVI",
      lines: ["By using AHVI, you acknowledge that you've read and understood this Privacy Policy."],
    },
  },
};
