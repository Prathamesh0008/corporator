export interface AnnouncementContent {
  enabled: boolean;
  en: { text: string; link?: string; linkText?: string };
  mr: { text: string; link?: string; linkText?: string };
}

export interface StatItem {
  id: string;
  labelEn: string;
  labelMr: string;
  value: number;
  suffix?: string;
  prefix?: string;
  noteEn?: string;
  noteMr?: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  titleEn: string;
  titleMr: string;
  categoryEn: string;
  categoryMr: string;
  locationEn: string;
  locationMr: string;
  statusEn: string;
  statusMr: string;
  progress: number;
  startDate: string;
  endDate: string;
  budget?: string;
  descriptionEn: string;
  descriptionMr: string;
  image: string;
  tag: "Completed" | "Ongoing" | "Planned";
}

export interface NewsItem {
  id: string;
  slug: string;
  titleEn: string;
  titleMr: string;
  categoryEn: string;
  categoryMr: string;
  date: string;
  summaryEn: string;
  summaryMr: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  areaEn: string;
  areaMr: string;
  feedbackEn: string;
  feedbackMr: string;
  rating?: number;
  image?: string;
}

export interface SchemeItem {
  id: string;
  titleEn: string;
  titleMr: string;
  eligibilityEn: string;
  eligibilityMr: string;
  benefitsEn: string;
  benefitsMr: string;
  docsEn: string;
  docsMr: string;
  link: string;
  updated: string;
}

export interface FaqItem {
  id: string;
  questionEn: string;
  questionMr: string;
  answerEn: string;
  answerMr: string;
}
