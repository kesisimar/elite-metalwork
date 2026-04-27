export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type");

  // Only process HTML responses
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  // Translation Map
  const translations = {
    "Home": "Αρχική",
    "Projects": "Έργα",
    "Contact": "Επικοινωνία",
    "Journal": "Άρθρα",
    "PROJECT PORTFOLIO": "ΤΑ ΕΡΓΑ ΜΑΣ",
    "TECHNICAL SPECIFICATIONS": "ΤΕΧΝΙΚΕΣ ΠΡΟΔΙΑΓΡΑΦΕΣ",
    "Our Method": "Η Μέθοδος Μας",
    "ENGINEERING PROCESS": "ΔΙΑΔΙΚΑΣΙΑ ΠΑΡΑΓΩΓΗΣ",
    "Get in Touch": "Επικοινωνήστε Μαζί Μας",
    "Technical Support": "Τεχνική Υποστήριξη",
    "Direct Line": "Γραμμή Επικοινωνίας",
    "Email": "Email",
    "Address": "Διεύθυνση",
    "Subject": "Θέμα",
    "Message": "Μήνυμα",
    "Send Message": "Αποστολή Μηνύματος",
    "Request a Quote": "Ζητήστε Προσφορά",
    "Services": "Υπηρεσίες",
    "Read More": "Διαβάστε Περισσότερα",
    "Precision Engineering": "Μηχανολογική Ακρίβεια",
    "Metalwork": "ΜΕΤΑΛΛΙΚΕΣ ΚΑΤΑΣΚΕΥΕΣ",
    "All rights reserved": "Με την επιφύλαξη παντός δικαιώματος",
    "Privacy Policy": "Πολιτική Απορρήτου",
    "Terms of Service": "Όροι Χρήσης"
  };

  const rewriter = new HTMLRewriter()
    // 1. Handle Text Translations
    .on("*", {
      text(text) {
        const content = text.text.trim();
        if (translations[content]) {
          text.replace(translations[content]);
        }
      }
    })
    // 2. Inject Mobile UI CSS Fix
    .on("head", {
      element(element) {
        element.append(`
          <style>
            @media (max-width: 1024px) {
              #mobile-menu a, .mobile-nav-link {
                transition: color 0s !important;
              }
              #mobile-menu a:hover, 
              #mobile-menu a:active, 
              #mobile-menu a:focus,
              .mobile-nav-link:hover,
              .mobile-nav-link:active,
              .mobile-nav-link:focus {
                color: #FF5E14 !important;
              }
            }
          </style>
        `, { html: true });
      }
    });

  return rewriter.transform(response);
}
