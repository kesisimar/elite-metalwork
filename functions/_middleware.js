export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type");

  // Only process HTML responses
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  // Global Translation Mapping (Expert Level)
  const translations = {
    // Global Navigation & Brand
    "HOME": "ΑΡΧΙΚΗ",
    "PROJECTS": "ΕΡΓΑ",
    "CONTACT": "ΕΠΙΚΟΙΝΩΝΙΑ",
    "JOURNAL": "ΑΡΘΡΑ",
    "SERVICES": "ΥΠΗΡΕΣΙΕΣ",
    "OUR WORK": "ΤΑ ΕΡΓΑ ΜΑΣ",
    "OUR SERVICES": "ΟΙ ΥΠΗΡΕΣΙΕΣ ΜΑΣ",
    "PROJECT PORTFOLIO": "ΤΟ ΠΟΡΤΦΟΛΙΟ ΜΑΣ",
    "METALWORK": "ΜΕΤΑΛΛΙΚΕΣ ΚΑΤΑΣΚΕΥΕΣ",
    "ALL RIGHTS RESERVED": "ΜΕ ΤΗΝ ΕΠΙΦΥΛΑΞΗ ΠΑΝΤΟΣ ΔΙΚΑΙΩΜΑΤΟΣ",
    
    // Section Headings & Metadata
    "TECHNICAL SPECIFICATIONS": "ΤΕΧΝΙΚΕΣ ΠΡΟΔΙΑΓΡΑΦΕΣ",
    "ENGINEERING PROCESS": "ΔΙΑΔΙΚΑΣΙΑ ΠΑΡΑΓΩΓΗΣ",
    "TECHNICAL INSIGHTS": "ΤΕΧΝΙΚΕΣ ΠΛΗΡΟΦΟΡΙΕΣ",
    "EXPERT SOLUTIONS": "ΚΟΡΥΦΑΙΕΣ ΛΥΣΕΙΣ",
    "CLIENT": "ΠΕΛΑΤΗΣ",
    "CATEGORY": "ΚΑΤΗΓΟΡΙΑ",
    "LOCATION": "ΤΟΠΟΘΕΣΙΑ",
    "BACK TO PROJECTS": "ΕΠΙΣΤΡΟΦΗ ΣΤΑ ΕΡΓΑ",
    
    // Industry Terms
    "PRECISION ENGINEERING": "ΜΗΧΑΝΟΛΟΓΙΚΗ ΑΚΡΙΒΕΙΑ",
    "INDUSTRIAL FABRICATION": "ΒΙΟΜΗΧΑΝΙΚΗ ΚΑΤΑΣΚΕΥΗ",
    "CUSTOM ENGINEERING": "ΕΙΔΙΚΕΣ ΚΑΤΑΣΚΕΥΕΣ",
    "AUTOMOTIVE INDUSTRY": "ΑΥΤΟΚΙΝΗΤΟΒΙΟΜΗΧΑΝΙΑ",
    "TECHNICAL SERVICES": "ΤΕΧΝΙΚΕΣ ΥΠΗΡΕΣΙΕΣ",
    "SAFETY ENGINEERING": "ΜΗΧΑΝΙΚΗ ΑΣΦΑΛΕΙΑΣ",
    "SPECIAL PROJECTS": "ΕΙΔΙΚΑ ΕΡΓΑ",
    "METAL CONSTRUCTION": "ΜΕΤΑΛΛΙΚΗ ΚΑΤΑΣΚΕΥΗ",
    
    // UI Elements
    "READ MORE": "ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕΡΑ",
    "GET IN TOUCH": "ΕΠΙΚΟΙΝΩΝΗΣΤΕ ΜΑΖΙ ΜΑΣ",
    "REQUEST A QUOTE": "ΖΗΤΗΣΤΕ ΠΡΟΣΦΟΡΑ",
    "DIRECT LINE": "ΓΡΑΜΜΗ ΕΠΙΚΟΙΝΩΝΙΑΣ",
    "FEATURED": "ΠΡΟΤΕΙΝΟΜΕΝΟ",
    "SCROLL": "SCROLL"
  };

  const rewriter = new HTMLRewriter()
    // 1. Text Translation Node Handler
    .on("*", {
      text(text) {
        const content = text.text.trim();
        if (!content) return;

        // Try exact match
        if (translations[content]) {
          text.replace(translations[content]);
          return;
        }

        // Try case-insensitive match for common labels
        const upperContent = content.toUpperCase();
        if (translations[upperContent]) {
          // Preserve sentence case if not original uppercase
          const translated = translations[upperContent];
          text.replace(content === upperContent ? translated : translated.charAt(0) + translated.slice(1).toLowerCase());
        }
      }
    })
    // 2. Edge Style Injection for Mobile UI Consistency
    .on("head", {
      element(element) {
        element.append(`
          <style>
            /* Force Orange Hover/Active State on Mobile (max-width: 1024px) */
            @media (max-width: 1024px) {
              #mobile-menu a, 
              .mobile-nav-link,
              nav a {
                transition: color 0s !important;
                -webkit-tap-highlight-color: transparent;
              }
              
              #mobile-menu a:active,
              #mobile-menu a:hover,
              .mobile-nav-link:active,
              .mobile-nav-link:hover,
              nav a:active {
                color: #FF5E14 !important;
              }
            }
          </style>
        `, { html: true });
      }
    });

  return rewriter.transform(response);
}
