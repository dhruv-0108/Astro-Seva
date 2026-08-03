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
    id: 'kundli-jova-na',
    titleEN: 'Kundli Reading (કુંડળી જોવાના)',
    titleGU: 'કુંડળી જોવાના',
    price: 250,
    descEN: 'Complete birth chart verification & planetary dasha reading with Guruji.',
    descGU: 'ગુરુજી દ્વારા જન્મ કુંડળી અને ગ્રહ દશાનું સીધું શાસ્ત્રીય વિશ્લેષણ.',
    iconName: 'BookOpen',
    popular: false,
    featuresEN: [
      'Comprehensive Birth Chart Reading',
      'Vimshottari Dasha & Planetary Analysis',
      'Direct Authentic Guidance from Guruji',
    ],
    featuresGU: [
      'સંપૂર્ણ જન્મ કુંડળીનું વિશ્લેષણ',
      'વિંશોત્તરી દશા અને ગ્રહ ગોચર ગણતરી',
      'ગુરુજી દ્વારા સીધું સાચું માર્ગદર્શન',
    ],
  },
  {
    id: 'consultation-30min',
    titleEN: '30 Mins Live Session (૩૦ મિનિટ પરામર્શ)',
    titleGU: '૩૦ મિનિટ પરામર્શ',
    price: 250,
    descEN: '30 minutes direct 1-on-1 phone or video consultation for comprehensive life guidance.',
    descGU: '૩૦ મિનિટ સીધો ફોન/વીડિયો પરામર્શ - કારકિર્દી, લગ્ન અને જીવનના મહત્વના નિર્ણયો પર સ્પષ્ટતા.',
    iconName: 'PhoneCall',
    popular: true,
    featuresEN: [
      '30 Mins Direct 1-on-1 Call with Guruji',
      'Detailed Discussion on Major Life Issues',
      'Authentic Remedies & Upasana Guidance',
    ],
    featuresGU: [
      '૩૦ મિનિટ ગુરુજી સાથે સીધો ફોન/વીડિયો કૉલ',
      'મહત્વના પ્રશ્નો અને સમસ્યાઓ પર ઊંડાણપૂર્વક ચર્ચા',
      'પ્રામાણિક ઉપાય અને સાધના માર્ગદર્શન',
    ],
  },
  {
    id: 'extra-questions',
    titleEN: 'Extra Questions (વધારાના પ્રશ્નો)',
    titleGU: 'વધારાના પ્રશ્નો',
    price: 100,
    descEN: 'Targeted guidance for additional personal, career, or family horoscope questions.',
    descGU: 'તમારા કે પરિવારના અન્ય વધારાના ચોક્કસ પ્રશ્નો અને શંકાઓનું સીધું સમાધાન.',
    iconName: 'Sparkles',
    popular: false,
    featuresEN: [
      'Single/Multiple Additional Specific Questions',
      'Instant Clarity on Family/Career Query',
      'Direct Shastric Answer from Guruji',
    ],
    featuresGU: [
      'વધારાના ચોક્કસ પ્રશ્નોનું વિશ્લેષણ',
      'પરિવાર કે કારકિર્દીના પ્રશ્નો પર ત્વરિત સ્પષ્ટતા',
      'શાસ્ત્રોક્ત અને સાધના આધારિત જવાબ',
    ],
  },
];

export const GURU_UPI_ID = 'goswami.narendragiri53@oksbi';

// If you have a custom QR code image file (e.g. qr-code.png or qr-code.jpg), place it in the public/ folder
// and set this path below (e.g. '/qr-code.png'). If set to null or empty string, it automatically generates a dynamic UPI QR code.
export const GURU_QR_IMAGE_PATH: string | null = '/qr-code.jpeg';
