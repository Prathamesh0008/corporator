import type { AnnouncementContent, FaqItem, NewsItem, SchemeItem, StatItem, TestimonialItem } from "../types/site";

export const announcementContent: AnnouncementContent = {
  enabled: true,
  en: {
    text: "Public office updates for Ward 24(D) are now shared here regularly.",
    link: "/works",
    linkText: "View current projects",
  },
  mr: {
    text: "वॉर्ड २४(ड) मधील सार्वजनिक कार्यालयीन अपडेट्स आता नियमितपणे येथे शेअर केल्या जातात.",
    link: "/works",
    linkText: "सध्याच्या प्रकल्पांचे निरीक्षण करा",
  },
};

export const statsData: StatItem[] = [
  { id: "resolved", labelEn: "Complaints resolved", labelMr: "तक्रारी निकाली", value: 1820, suffix: "+", noteEn: "Updated regularly", noteMr: "नियमित अपडेट" },
  { id: "projects", labelEn: "Development projects", labelMr: "विकास प्रकल्प", value: 64, suffix: "+", noteEn: "Ward service initiatives", noteMr: "वॉर्ड सेवा उपक्रम" },
  { id: "citizens", labelEn: "Citizens served", labelMr: "राहिवासी सेवा", value: 15000, suffix: "+", noteEn: "Across ward areas", noteMr: "वॉर्ड परिसरात" },
  { id: "years", labelEn: "Years of public service", labelMr: "सार्वजनिक सेवेचे वर्ष", value: 15, suffix: "+", noteEn: "Community engagement", noteMr: "समुदाय सहभाग" },
];

export const newsData: NewsItem[] = [
  {
    id: "road-updates",
    slug: "road-updates-ward-24d",
    titleEn: "Road repair and drainage work update",
    titleMr: "रस्ता दुरुस्ती आणि गटार कामाची अद्ययावत माहिती",
    categoryEn: "Infrastructure",
    categoryMr: "आधारभूत सुविधा",
    date: "2026-07-10",
    summaryEn: "Latest updates on road resurfacing, drainage cleaning and public safety improvements.",
    summaryMr: "रस्ता डांबरीकरण, गटार स्वच्छता आणि सार्वजनिक सुरक्षेतील सुधारणा याबाबतची ताज्या माहिती.",
    image: "/images/banner-2.jpg",
  },
  {
    id: "citizen-help-desk",
    slug: "citizen-help-desk-open",
    titleEn: "Citizen help desk now available for ward visits",
    titleMr: "वॉर्ड भेटींसाठी नागरिक मदत केंद्र उपलब्ध",
    categoryEn: "Public service",
    categoryMr: "सार्वजनिक सेवा",
    date: "2026-06-24",
    summaryEn: "Residents can now get guidance for complaints, location checks and ward updates in person.",
    summaryMr: "राहिवाशांना आता तक्रारी, ठिकाण तपासणी आणि वॉर्ड अपडेट्सबाबत प्रत्यक्ष मार्गदर्शन मिळू शकते.",
    image: "/images/banner-3.jpeg",
  },
  {
    id: "water-supply-check",
    slug: "water-supply-check-drive",
    titleEn: "Water supply inspection drive launched",
    titleMr: "पाणीपुरवठा तपासणी मोहिमेचा प्रारंभ",
    categoryEn: "Utility service",
    categoryMr: "यूटिलिटी सेवा",
    date: "2026-06-11",
    summaryEn: "The ward office has started regular checks to improve water pressure and reduce disruptions.",
    summaryMr: "वॉर्ड कार्यालयाने पाण्याच्या दाबात सुधारणा आणि disruptions कमी करण्यासाठी नियमित तपासणी सुरू केली आहे.",
    image: "/images/banner-1.jpg",
  },
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "resident-1",
    name: "Asha Patil",
    areaEn: "Sector 20, Nerul",
    areaMr: "सेक्टर २०, नेरूळ",
    feedbackEn: "The office responded quickly and guided me step by step. I felt heard and supported.",
    feedbackMr: "कार्यालयाने त्वरित प्रतिसाद दिला आणि मला चरणबद्ध मार्गदर्शन केले. मला ऐकले गेले आणि आधार मिळाला.",
    rating: 5,
    image: "/bio.png",
  },
  {
    id: "resident-2",
    name: "Ravi Deshmukh",
    areaEn: "Nerul Market Area",
    areaMr: "नेरूळ मार्केट क्षेत्र",
    feedbackEn: "The ward team helped with a drainage issue that had been pending for months.",
    feedbackMr: "वॉर्ड टीमने अनेक महिने प्रलंबित असलेली गटाराची समस्या सोडवण्यास मदत केली.",
    rating: 5,
    image: "/photo.jpeg",
  },
  {
    id: "resident-3",
    name: "Meera Kulkarni",
    areaEn: "Palm Beach Road",
    areaMr: "पामबिझ रोड",
    feedbackEn: "Clear communication and visible follow-up made the whole process easy.",
    feedbackMr: "स्पष्ट संवाद आणि स्पष्ट पाठपुराव्यामुळे संपूर्ण प्रक्रिया सोपी झाली.",
    rating: 5,
    image: "/bio-1.png",
  },
];

export const schemesData: SchemeItem[] = [
  {
    id: "health-help",
    titleEn: "Health and sanitation assistance",
    titleMr: "आरोग्य आणि स्वच्छता सहाय्य",
    eligibilityEn: "Residents facing sanitation or public health issues in the ward.",
    eligibilityMr: "वॉर्डमध्ये स्वच्छता किंवा सार्वजनिक आरोग्याच्या समस्येने त्रस्त रहिवासी.",
    benefitsEn: "Priority inspection, sanitation support, and coordination with local civic teams.",
    benefitsMr: "प्राधान्य तपासणी, स्वच्छता सहाय्य आणि स्थानिक नागरी टीमशी समन्वय.",
    docsEn: "Aadhaar, address proof, and complaint reference if available.",
    docsMr: "आधार, पत्ता पुरावा आणि उपलब्ध असल्यास तक्रार संदर्भ.",
    link: "https://nmmc.gov.in",
    updated: "2026-07-12",
  },
  {
    id: "road-civic",
    titleEn: "Road and drainage support",
    titleMr: "रस्ता आणि गटार सहकार्य",
    eligibilityEn: "Residents reporting damaged roads, blocked drains or waterlogging.",
    eligibilityMr: "खराब रस्ते, अडलेले गटारे किंवा पाणी साचलेली जागा सांगणारे रहिवासी.",
    benefitsEn: "Site inspection, priority follow-up and project coordination.",
    benefitsMr: "स्थळ तपासणी, प्राधान्य पाठपुरावा आणि प्रकल्प समन्वय.",
    docsEn: "Address proof, photo evidence, and complaint number.",
    docsMr: "पत्ता पुरावा, फोटो पुरावा आणि तक्रार क्रमांक.",
    link: "https://nmmc.gov.in",
    updated: "2026-07-08",
  },
];

export const faqData: FaqItem[] = [
  {
    id: "complaint-register",
    questionEn: "How do I register a complaint?",
    questionMr: "मी तक्रार कशी नोंदवू शकतो?",
    answerEn: "Use the complaint form on the complaints page and include your address, category, and a clear description.",
    answerMr: "तक्रार पृष्ठावरील फॉर्म वापरा आणि तुमचा पत्ता, श्रेणी आणि स्पष्ट वर्णन द्या.",
  },
  {
    id: "complaint-track",
    questionEn: "How can I track my complaint?",
    questionMr: "मी माझी तक्रार कशी तपासू शकतो?",
    answerEn: "Save the complaint reference number and use the tracking section to follow the status.",
    answerMr: "तक्रार संदर्भ क्रमांक जतन करा आणि स्थिती पाहण्यासाठी ट्रॅकिंग विभाग वापरा.",
  },
  {
    id: "required-info",
    questionEn: "What information is needed for a complaint?",
    questionMr: "तक्रारीसाठी कोणती माहिती आवश्यक आहे?",
    answerEn: "A location, landmark, photos if available, and the category of issue helps the office follow up faster.",
    answerMr: "ठिकाण, सुसूत्र चिन्ह, उपलब्ध असल्यास फोटो आणि समस्येची श्रेणी दिल्यास कार्यालयाला वेगाने पाठपुरावा करता येतो.",
  },
  {
    id: "office-hours",
    questionEn: "What are the ward office hours?",
    questionMr: "वॉर्ड कार्यालयाचे कामकाजाचे वेळा काय आहेत?",
    answerEn: "The office generally operates during standard public office hours, and the contact page shares current working days.",
    answerMr: "कार्यालय सामान्य सार्वजनिक कार्यालयीन वेळापत्रकानुसार कार्य करते आणि संपर्क पृष्ठावर सध्याचे कार्यदिवस दिलेले असतात.",
  },
];
