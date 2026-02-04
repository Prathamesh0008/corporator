export const translations = {
  // Navigation
  nav: {
    home: { en: "Home", mr: "मुख्यपृष्ठ" },
    about: { en: "About", mr: "माहिती" },
    works: { en: "Works", mr: "कार्ये" },
    gallery: { en: "Gallery", mr: "गॅलरी" },
    services: { en: "Services", mr: "सार्वजनिक सेवा" },
    complaints: { en: "Complaint", mr: "तक्रार नोंदवा" },
    contact: { en: "Contact Office", mr: "संपर्क कार्यालय" }
  },

  // Common
  common: {
    readMore: { en: "Read More", mr: "अधिक वाचा" },
    viewAll: { en: "View All", mr: "सर्व पहा" },
    contactUs: { en: "Contact Us", mr: "संपर्क करा" },
    emergency: { en: "Emergency", mr: "आपत्कालीन" },
    viewDetails: { en: "View Details", mr: "तपशील पहा" },
    submit: { en: "Submit", mr: "सबमिट करा" },
    search: { en: "Search", mr: "शोधा" }
  },

  // Home Page
  home: {
    heroTitle: { 
      en: "Corporator Sachin D. Lavate", 
      mr: "नगरसेवक सचिन देवाप्पा लवटे" 
    },
    heroSubtitle: { 
      en: "Ward 24(D), Navi Mumbai", 
      mr: "वॉर्ड २४(ड), नेरूळ सेक्टर १८, नवी मुंबई" 
    },
    welcomeMessage: { 
      en: "Dedicated to Public Service & Development", 
      mr: "सार्वजनिक सेवा आणि विकासासाठी समर्पित" 
    },
    statsTitle: { 
      en: "Our Progress in Numbers", 
      mr: "संख्या मध्ये आमची प्रगती" 
    },
    servicesTitle: { 
      en: "Public Services", 
      mr: "सार्वजनिक सेवा" 
    },
    worksTitle: { 
      en: "Recent Development Works", 
      mr: "अलीकडील विकास कार्ये" 
    }
  },

  // Stats
  stats: {
    complaintsResolved: { en: "Complaints Resolved", mr: "तक्रारी सोडवल्या" },
    worksCompleted: { en: "Works Completed", mr: "कार्ये पूर्ण" },
    ongoingProjects: { en: "Ongoing Projects", mr: "चालू प्रकल्प" },
    publicMeetings: { en: "Public Meetings", mr: "सार्वजनिक बैठका" }
  },

  // About Page
  about: {
    title: { en: "About Corporator Sachin Lavate", mr: "नगरसेवक सचिन लवटे यांच्याबद्दल" },
    personalInfo: { en: "Personal Information", mr: "वैयक्तिक माहिती" },
    background: { en: "Background & Journey", mr: "पार्श्वभूमी आणि प्रवास" },
    socialWork: { en: "Social Work Experience", mr: "सामाजिक कार्य अनुभव" },
    education: { en: "Education", mr: "शिक्षण" },
    profession: { en: "Profession", mr: "व्यवसाय" },
    residence: { en: "Residence", mr: "निवास" }
  },

  // Contact Page
  contact: {
    title: { en: "Contact Corporator Office", mr: "नगरसेवक कार्यालयाशी संपर्क" },
    officeAddress: { en: "Office Address", mr: "कार्यालयाचा पत्ता" },
    phoneNumbers: { en: "Phone Numbers", mr: "फोन नंबर" },
    email: { en: "Email Address", mr: "ईमेल पत्ता" },
    officeHours: { en: "Office Hours", mr: "कार्यालयीन वेळ" },
    emergencyContact: { en: "Emergency Contact", mr: "आपत्कालीन संपर्क" }
  },

  // Complaints Page
  complaints: {
    title: { en: "Register Your Complaint", mr: "आपली तक्रार नोंदवा" },
    formTitle: { en: "Complaint Registration Form", mr: "तक्रार नोंदणी फॉर्म" },
    name: { en: "Full Name", mr: "पूर्ण नाव" },
    phone: { en: "Phone Number", mr: "फोन नंबर" },
    address: { en: "Address", mr: "पत्ता" },
    complaintType: { en: "Complaint Type", mr: "तक्रार प्रकार" },
    description: { en: "Description", mr: "वर्णन" },
    uploadPhoto: { en: "Upload Photo", mr: "फोटो अपलोड करा" },
    submitComplaint: { en: "Submit Complaint", mr: "तक्रार सबमिट करा" }
  }
};

// Helper function to get translation
export function t(key, lang = 'en') {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  if (value && typeof value === 'object') {
    if (value[lang] !== undefined) {
      return value[lang];
    }
    if (value.en !== undefined) {
      return value.en;
    }
  }

  if (typeof value === 'string') {
    return value;
  }

  return key;
}
