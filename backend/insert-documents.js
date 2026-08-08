const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    insertDocuments();
  }
});

function insertDocuments() {
  const documents = [
    {
      category: "Mandatory Disclosure",
      title: "CBSE Affiliation Certificate",
      description: "School affiliation certificate from Central Board of Secondary Education",
      type: "PDF",
      size: "2.1 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view" // Replace with actual link
    },
    {
      category: "Mandatory Disclosure",
      title: "Trust Deed / Society Registration",
      description: "Registration certificate of the school trust/society",
      type: "PDF",
      size: "1.8 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Mandatory Disclosure",
      title: "No Objection Certificate (NOC)",
      description: "NOC issued by the State Government/UT",
      type: "PDF",
      size: "1.5 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Mandatory Disclosure",
      title: "Recognition Certificate",
      description: "Certificate of recognition under RTE Act, 2009",
      type: "PDF",
      size: "1.2 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Safety & Infrastructure",
      title: "Building Safety Certificate",
      description: "Certificate ensuring structural safety of the building",
      type: "PDF",
      size: "3.2 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Safety & Infrastructure",
      title: "Fire Safety Certificate",
      description: "Fire safety compliance certificate",
      type: "PDF",
      size: "2.8 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Safety & Infrastructure",
      title: "Health & Sanitation Certificate",
      description: "Certificate for health and sanitation facilities",
      type: "PDF",
      size: "1.9 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Safety & Infrastructure",
      title: "Drinking Water & Sanitation Facilities",
      description: "Details of drinking water and sanitation facilities",
      type: "PDF",
      size: "2.5 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Academic & Administrative",
      title: "Fee Structure",
      description: "Complete fee structure for all classes",
      type: "PDF",
      size: "1.1 MB",
      lastUpdated: "2024-25",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Academic & Administrative",
      title: "Annual Academic Calendar",
      description: "Academic calendar for the current session",
      type: "PDF",
      size: "1.7 MB",
      lastUpdated: "2024-25",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Academic & Administrative",
      title: "List of Books & Uniforms",
      description: "Prescribed books and uniform details",
      type: "PDF",
      size: "2.3 MB",
      lastUpdated: "2024-25",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Academic & Administrative",
      title: "Teachers' Details",
      description: "Information about teaching staff",
      type: "PDF",
      size: "1.4 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Governance & Committees",
      title: "School Management Committee (SMC)",
      description: "Composition and minutes of SMC meetings",
      type: "PDF",
      size: "2.6 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Governance & Committees",
      title: "Parent Teacher Association (PTA)",
      description: "PTA constitution and meeting minutes",
      type: "PDF",
      size: "1.8 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    },
    {
      category: "Governance & Committees",
      title: "Last Three Years' Results",
      description: "Academic results of classes X and XII",
      type: "PDF",
      size: "3.1 MB",
      lastUpdated: "2024",
      required: 1,
      file_url: "https://drive.google.com/file/d/YOUR_FILE_ID/view"
    }
  ];

  documents.forEach((doc, index) => {
    db.run('INSERT INTO documents (category, title, description, type, size, lastUpdated, required, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [doc.category, doc.title, doc.description, doc.type, doc.size, doc.lastUpdated, doc.required, doc.file_url], function(err) {
      if (err) {
        console.error('Error inserting document:', err.message);
      } else {
        console.log(`Inserted document ${index + 1}: ${this.lastID}`);
      }
    });
  });

  // Close after a delay to allow inserts
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }, 1000);
}