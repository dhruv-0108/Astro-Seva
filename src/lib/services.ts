import { Sparkles, BookOpen, PhoneCall } from 'lucide-react';

export interface ServiceItem {
  id: string;
  titleEN: string;
  titleGU: string;
  price: number;
  descEN: string;
  descGU: string;
  iconName: 'Sparkles' | 'BookOpen' | 'PhoneCall';
  popular: boolean;
  featuresEN: string[];
  featuresGU: string[];
}

export const GURU_SERVICES: ServiceItem[] = [
  {
    id: '3-questions',
    titleEN: '3 Questions Consultation',
    titleGU: '૩ પ્રશ્નો પરામર્શ (3 Questions)',
    price: 501,
    descEN: 'Direct astrological answers to 3 specific life, career, or relationship questions based on BPHS calculations.',
    descGU: 'તમારા ૩ ચોક્કસ જીવન, કારકિર્દી અથવા સંબંધોના પ્રશ્નોના બીપીએચએસ આધારિત સીધા જવાબો.',
    iconName: 'Sparkles',
    popular: false,
    featuresEN: [
      '3 Specific Life/Career Questions',
      'BPHS Planetary Dasha Analysis',
      'Direct WhatsApp Delivery',
    ],
    featuresGU: [
      '૩ ચોક્કસ જીવન/કારકિર્દી પ્રશ્નો',
      'બીપીએચએસ ગ્રહ દશા વિશ્લેષણ',
      'વોટ્સએપ પર સીધો રિપોર્ટ',
    ],
  },
  {
    id: '5-questions',
    titleEN: '5 Questions + Full Kundli',
    titleGU: '૫ પ્રશ્નો + કુંડળી વિશ્લેષણ',
    price: 1100,
    descEN: 'Comprehensive analysis for 5 life questions + complete digital Kundli report and remedy guidance.',
    descGU: 'તમારા ૫ જીવન પ્રશ્નોનું વિગતવાર વિશ્લેષણ + સંપૂર્ણ ડીજિટલ કુંડળી રિપોર્ટ અને ઉપાય માર્ગદર્શન.',
    iconName: 'BookOpen',
    popular: true,
    featuresEN: [
      '5 In-Depth Life/Career Questions',
      'Full Kundli Digital Report',
      'Vimshottari Dasha & Dosha Remedies',
      '30-Day Digital Report Access',
    ],
    featuresGU: [
      '૫ ઊંડાણપૂર્વકના જીવન પ્રશ્નો',
      'સંપૂર્ણ ડીજિટલ કુંડળી રિપોર્ટ',
      'વિંશોત્તરી દશા અને દોષ ઉપાયો',
      '૩૦ દિવસ ડીજિટલ રિપોર્ટ એક્સેસ',
    ],
  },
  {
    id: '30-min-call',
    titleEN: '30 Mins 1-on-1 Phone Call',
    titleGU: '૩૦ મિનિટ ૧-ઓન-૧ ફોન પરામર્શ',
    price: 2100,
    descEN: 'Personal 1-on-1 30-minute phone call consultation directly with Guru Ji (Sri Vidya Sadhak, 30+ Yrs Exp).',
    descGU: 'ગુરુજી (શ્રી વિદ્યા સાધક, ૩૦+ વર્ષનો અનુભવ) સાથે સીધો ૩૦ મિનિટનો ૧-ઓન-૧ ફોન કૉલ પરામર્શ.',
    iconName: 'PhoneCall',
    popular: false,
    featuresEN: [
      '30 Mins Direct Phone Call with Guruji',
      'Personalized Q&A & Remedies',
      'Full Kundli Digital Report Included',
      'Priority Support',
    ],
    featuresGU: [
      'ગુરુજી સાથે ૩૦ મિનિટ સીધો ફોન કૉલ',
      'વ્યક્તિગત પ્રશ્નોત્તરી અને ઉપાયો',
      'સંપૂર્ણ કુંડળી રિપોર્ટ સામેલ',
      'પ્રાથમિકતા સેવા',
    ],
  },
];

export const GURU_UPI_ID = 'verify@ybl';
