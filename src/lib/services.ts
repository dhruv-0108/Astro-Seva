export interface ServiceItem {
  id: string;
  titleEN: string;
  titleGU: string;
  price: number;
  descEN: string;
  descGU: string;
  iconName: 'Sparkles' | 'BookOpen' | 'PhoneCall' | 'UserCheck';
  popular: boolean;
  featuresEN: string[];
  featuresGU: string[];
}

export const GURU_SERVICES: ServiceItem[] = [
  {
    id: 'quick-question',
    titleEN: 'Quick Question / Single Issue',
    titleGU: 'ઝડપી પ્રશ્ન / એક ચોક્કસ બાબત (15-20 Mins)',
    price: 2500,
    descEN: '15-20 min phone/video call for direct astrological guidance on one specific urgent life or career issue.',
    descGU: '૧૫-૨૦ મિનિટ ફોન/વીડિયો કૉલ - એક ચોક્કસ મહત્વના પ્રશ્ન પર સીધું માર્ગદર્શન.',
    iconName: 'Sparkles',
    popular: false,
    featuresEN: [
      '15–20 Mins Direct Phone / Video Call',
      'Single Urgent Question Analysis',
      'Instant Clarity on Career/Marriage/Health',
    ],
    featuresGU: [
      '૧૫–૨૦ મિનિટ સીધો ફોન / વીડિયો કૉલ',
      'એક ચોક્કસ મહત્વના પ્રશ્નનું વિશ્લેષણ',
      'કારકિર્દી/લગ્ન/આરોગ્ય પર સીધી સ્પષ્ટતા',
    ],
  },
  {
    id: 'standard-consultation',
    titleEN: 'Standard Full Consultation',
    titleGU: 'સ્ટાન્ડર્ડ સંપૂર્ણ પરામર્શ (30-45 Mins)',
    price: 5000,
    descEN: '30-45 min full live reading covering planetary dasha, career, marriage & major life decisions.',
    descGU: '૩૦-૪૫ મિનિટ સંપૂર્ણ લાઇવ રીડિંગ - ગ્રહ દશા, કારકિર્દી અને મહત્વના નિર્ણયોનું વિશ્લેષણ.',
    iconName: 'PhoneCall',
    popular: true,
    featuresEN: [
      '30–45 Mins Full Live Consultation',
      'Comprehensive Birth Chart & Dasha Reading',
      'Career, Relationship & Health Guidance',
      'Vedic Remedy Recommendations',
    ],
    featuresGU: [
      '૩૦–૪૫ મિનિટ સંપૂર્ણ લાઇવ પરામર્શ',
      'સંપૂર્ણ જન્મ કુંડળી અને દશા રીડિંગ',
      'કારકિર્દી, સંબંધો અને આરોગ્ય માર્ગદર્શન',
      'વૈદિક ઉપાય માર્ગદર્શન',
    ],
  },
  {
    id: 'detailed-life-analysis',
    titleEN: 'Detailed Life Analysis',
    titleGU: 'વિગતવાર જીવન વિશ્લેષણ',
    price: 10000,
    descEN: 'Complete lifelong BPHS horoscope analysis, Vimshottari dasha, customized remedies and gemstone guidance.',
    descGU: 'સંપૂર્ણ આજીવન બીપીએચએસ કુંડળી વિશ્લેષણ, વિંશોત્તરી દશા, ઉપાયો અને રત્ન માર્ગદર્શન.',
    iconName: 'BookOpen',
    popular: false,
    featuresEN: [
      'Lifelong BPHS Planetary & Dasha Analysis',
      'Customized Vedic Remedies & Gemstone Guidance',
      'Career, Marriage & Health Deep Dive',
      'Follow-up Q&A Session',
    ],
    featuresGU: [
      'આજીવન ગ્રહ અને દશા વિશ્લેષણ',
      'વ્યક્તિગત વૈદિક ઉપાયો અને રત્ન માર્ગદર્શન',
      'કારકિર્દી, લગ્ન અને આરોગ્ય ઊંડાણપૂર્વક',
      'ફોલો-અપ પ્રશ્નોત્તરી સત્ર',
    ],
  },
  {
    id: 'in-person-session',
    titleEN: 'In-Person Personal Session',
    titleGU: 'રૂબરૂ વ્યક્તિગત મુલાકાત (In-Person)',
    price: 20000,
    descEN: 'Personal face-to-face in-person consultation session with Guru Ji for higher-effort, non-scalable deep guidance.',
    descGU: 'ગુરુજી સાથે સીધી રૂબરૂ વ્યક્તિગત મુલાકાત - ઊંડાણપૂર્વકનું આધ્યાત્મિક અને વૈદિક માર્ગદર્શન.',
    iconName: 'UserCheck',
    popular: false,
    featuresEN: [
      'Personal Face-to-Face Meeting with Guruji',
      'In-Depth Prashna & Horoscope Verification',
      'Private 1-on-1 Spiritual Guidance',
      'Direct Prashna Chart Rectification',
    ],
    featuresGU: [
      'ગુરુજી સાથે સીધી રૂબરૂ મુલાકાત',
      'પ્રશ્ન કુંડળી અને જન્મ કુંડળી ચકાસણી',
      'ખાનગી ૧-ઓન-૧ આધ્યાત્મિક માર્ગદર્શન',
      'ચોક્કસ જન્મ સમય સુધારણા',
    ],
  },
];

export const GURU_UPI_ID = 'verify@ybl';

// If you have a custom QR code image file (e.g. qr-code.png or qr-code.jpg), place it in the public/ folder
// and set this path below (e.g. '/qr-code.png'). If set to null or empty string, it automatically generates a dynamic UPI QR code.
export const GURU_QR_IMAGE_PATH: string | null = null;

