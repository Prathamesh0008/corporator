export const translations = {
  nav: {
    home: { en: "Home", mr: "मुख्यपृष्ठ" },
    about: { en: "Journey", mr: "प्रवास" },
    works: { en: "Ward Works", mr: "वॉर्ड कामे" },
    news: { en: "News", mr: "बातम्या" },
    gallery: { en: "Gallery", mr: "छायाचित्रे" },
    services: { en: "Ward Services", mr: "वॉर्ड सेवा" },
    complaints: { en: "Register Complaint", mr: "तक्रार नोंदवा" },
    contact: { en: "Office", mr: "कार्यालय" },
  },
  common: {
    readMore: { en: "Read more", mr: "अधिक वाचा" },
    viewAll: { en: "View all", mr: "सर्व पहा" },
    contactUs: { en: "Contact office", mr: "कार्यालयाशी संपर्क" },
    submit: { en: "Submit", mr: "पाठवा" },
  },
  contact: {
    title: { en: "Corporator Office", mr: "नगरसेवक कार्यालय" },
    officeAddress: { en: "Service Area", mr: "सेवा क्षेत्र" },
  },
  complaints: {
    title: { en: "Tell Us Your Ward Problem", mr: "आपल्या वॉर्डमधील समस्या सांगा" },
    formTitle: { en: "Register a Complaint", mr: "तक्रार नोंदणी" },
    name: { en: "Your full name", mr: "आपले पूर्ण नाव" },
    phone: { en: "Mobile number", mr: "मोबाईल नंबर" },
    address: { en: "Your address", mr: "आपला पत्ता" },
    complaintType: { en: "Type of problem", mr: "समस्येचा प्रकार" },
    description: { en: "Explain the problem", mr: "समस्या समजावून सांगा" },
    uploadPhoto: { en: "Add a photo (optional)", mr: "फोटो जोडा (ऐच्छिक)" },
    submitComplaint: { en: "Send My Complaint", mr: "माझी तक्रार पाठवा" },
  },
  about: {
    title: { en: "About", mr: "माहिती" },
    residence: { en: "Residence", mr: "निवास" },
    education: { en: "Education", mr: "शिक्षण" },
    profession: { en: "Profession", mr: "वृत्ती" },
    background: { en: "Background", mr: "पार्श्वभूमी" },
    socialWork: { en: "Social Work", mr: "समाजकार्य" },
  },
};

export function t(key, lang = "en") {
  const value = key.split(".").reduce((item, part) => item?.[part], translations);
  return value?.[lang] ?? value?.en ?? key;
}
