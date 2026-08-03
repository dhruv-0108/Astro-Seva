export interface ServiceItem {
  id: string;
  titleEN: string;
  titleGU: string;
  titleHI: string;
  price: number;
  descEN: string;
  descGU: string;
  descHI: string;
  iconName: 'Sparkles' | 'BookOpen' | 'PhoneCall' | 'UserCheck';
  popular: boolean;
  featuresEN: string[];
  featuresGU: string[];
  featuresHI: string[];
}

export const GURU_SERVICES: ServiceItem[] = [
  {
    id: 'kundli-jova-na',
    titleEN: 'Kundli Reading (કુંડળી જોવાના)',
    titleGU: 'કુંડળી જોવાના',
    titleHI: 'कुंडली देखना (Kundli Reading)',
    price: 250,
    descEN: 'Complete birth chart verification & planetary dasha reading with Guruji.',
    descGU: 'ગુરુજી દ્વારા જન્મ કુંડળી અને ગ્રહ દશાનું સીધું શાસ્ત્રીય વિશ્લેષણ.',
    descHI: 'गुरुजी द्वारा जन्म कुंडली और ग्रह दशा का सीधा शास्त्रीय विश्लेषण।',
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
    featuresHI: [
      'संपूर्ण जन्म कुंडली का विश्लेषण',
      'विंशोत्तरी दशा एवं ग्रह गोचर गणना',
      'गुरुजी द्वारा सीधा प्रमाणिक मार्गदर्शन',
    ],
  },
  {
    id: 'consultation-30min',
    titleEN: '30 Mins Live Session (૩૦ મિનિટ પરામર્શ)',
    titleGU: '૩૦ મિનિટ પરામર્શ',
    titleHI: '30 मिनट परामर्श (30 Mins Live)',
    price: 250,
    descEN: '30 minutes direct 1-on-1 phone or video consultation for comprehensive life guidance.',
    descGU: '૩૦ મિનિટ સીધો ફોન/વીડિયો પરામર્શ - કારકિર્દી, લગ્ન અને જીવનના મહત્વના નિર્ણયો પર સ્પષ્ટતા.',
    descHI: '30 मिनट सीधा फोन/वीडियो परामर्श - करियर, विवाह और जीवन के महत्वपूर्ण निर्णयों पर स्पष्टता।',
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
    featuresHI: [
      '30 मिनट गुरुजी के साथ सीधा फोन/वीडियो कॉल',
      'महत्वपूर्ण प्रश्नों और समस्याओं पर गहन चर्चा',
      'प्रमाणिक उपाय एवं साधना मार्गदर्शन',
    ],
  },
  {
    id: 'extra-questions',
    titleEN: 'Extra Questions (વધારાના પ્રશ્નો)',
    titleGU: 'વધારાના પ્રશ્નો',
    titleHI: 'अतिरिक्त प्रश्न (Extra Questions)',
    price: 100,
    descEN: 'Targeted guidance for additional personal, career, or family horoscope questions.',
    descGU: 'તમારા કે પરિવારના અન્ય વધારાના ચોક્કસ પ્રશ્નો અને શંકાઓનું સીધું સમાધાન.',
    descHI: 'आपके या परिवार के अन्य अतिरिक्त विशिष्ट प्रश्नों एवं शंकाओं का सीधा समाधान।',
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
    featuresHI: [
      'अतिरिक्त विशिष्ट प्रश्नों का विश्लेषण',
      'परिवार या करियर के प्रश्नों पर तुरंत स्पष्टता',
      'शास्त्रोक्त एवं साधना आधारित उत्तर',
    ],
  },
];

export const GURU_UPI_ID = 'goswami.narendragiri53@oksbi';

// If you have a custom QR code image file (e.g. qr-code.png or qr-code.jpg), place it in the public/ folder
// and set this path below (e.g. '/qr-code.png'). If set to null or empty string, it automatically generates a dynamic UPI QR code.
export const GURU_QR_IMAGE_PATH: string | null = '/qr-code.jpeg';
