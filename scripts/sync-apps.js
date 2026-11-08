const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const userApps = [
  {
    name: "PPT and PPTX: Read and Edit",
    packageName: "com.pptreader.powerpoint.app",
    slug: "ppt-reader",
    category: "Productivity",
    tagline: "Smooth PowerPoint Presentation Viewer & Editor",
    shortDescription: "Open, view, search, and manage PowerPoint PPT & PPTX presentation slides directly on your mobile device."
  },
  {
    name: "All in one ToolBox",
    packageName: "com.allinonetools",
    slug: "all-in-one-tools",
    category: "Tools",
    tagline: "Essential Everyday Utility Kit for Android",
    shortDescription: "Comprehensive multi-utility suite featuring unit converters, daily calculators, checklists, and device tools."
  },
  {
    name: "Arrow Challenge - Puzzle",
    packageName: "com.arrows.escape.puzzle.challenge.app",
    slug: "arrows-escape-puzzle",
    category: "Casual Games",
    tagline: "Relaxing Logic & Directional Maze Puzzle",
    shortDescription: "Stimulate your brain with clever arrow routing puzzles, intuitive controls, and calming ambient gameplay."
  },
  {
    name: "Nebula VPN",
    packageName: "com.nebulaVPN.app",
    slug: "nebula-vpn",
    category: "Tools",
    tagline: "Encrypted High-Speed Tunnel & Private Proxy",
    shortDescription: "Safeguard your Wi-Fi connections, protect network privacy, and browse with encrypted tunneling."
  },
  {
    name: "EXCEL TO PDF",
    packageName: "com.excel.xls.to.pdf.converter.app",
    slug: "excel-to-pdf-converter",
    category: "Productivity",
    tagline: "Convert XLS & XLSX Spreadsheets to PDF Instantly",
    shortDescription: "Transform complex Excel sheets and workbooks into clean, printable PDF documents directly on device."
  },
  {
    name: "DOC and DOCX to PDF",
    packageName: "com.doc.docx.to.pdf.converter.app",
    slug: "doc-to-pdf-converter",
    category: "Productivity",
    tagline: "Fast, Offline Word DOC & DOCX to PDF Conversion",
    shortDescription: "Convert Microsoft Word documents to professional PDF files rapidly with full offline processing."
  },
  {
    name: "PPT and PPTX to PDF CONVERTOR",
    packageName: "com.ppt.pptx.to.pdf.converter.app",
    slug: "ppt-to-pdf-converter",
    category: "Productivity",
    tagline: "Export Presentation Slides to PDF Documents",
    shortDescription: "Convert PPT slides into crisp, vector-clear PDF files ready for printing, archiving, and sharing."
  },
  {
    name: "Birthday Reminder",
    packageName: "com.birthdayReminder.app",
    slug: "birthday-reminder",
    category: "Productivity",
    tagline: "Never Forget a Birthday, Anniversary, or Event",
    shortDescription: "Keep track of upcoming birthdays and special milestones with customizable countdowns and reminders."
  },
  {
    name: "Music World: Piano & More",
    packageName: "com.kidspiano.guitadrumsmusicgame",
    slug: "kids-piano-guitar-drums",
    category: "Casual Games",
    tagline: "Play Piano, Drums, Guitar & Musical Mini-Games",
    shortDescription: "Vibrant musical instrument playground featuring piano keys, drum pads, xylophone, and catchy melodies."
  },
  {
    name: "Liquid Color Sort",
    packageName: "com.liquidcolorsort.app",
    slug: "liquid-color-sort",
    category: "Casual Games",
    tagline: "Satisfying Water Sorting Brain Teaser",
    shortDescription: "Test your logic and color coordination by pouring and sorting colorful liquids into matching test tubes."
  },
  {
    name: "Bubble Shooter",
    packageName: "com.bubblegames.bubbleshoote.app",
    slug: "bubble-shooter-pop-puzzle",
    category: "Casual Games",
    tagline: "Classic Bubble Pop & Match-3 Arcade Adventure",
    shortDescription: "Aim, match, and blast clusters of colorful bubbles across hundreds of dynamic, fun-filled puzzle levels."
  },
  {
    name: "Arrow Puzzle - Challenge",
    packageName: "com.arrowpuzzles.app",
    slug: "arrow-puzzle-challenge",
    category: "Casual Games",
    tagline: "Strategic Arrow Navigation & Escape Maze",
    shortDescription: "Guide arrows through intricate logic labyrinths without collisions in this addictive mental workout."
  },
  {
    name: "All Document Reader & Editor",
    packageName: "com.allinonedocumentreader.pdf.doc.docx.xls.xlsx.ppt.pptx.txt.editor.app",
    slug: "all-in-one-document-reader",
    category: "Productivity",
    tagline: "Unified Office Reader for PDF, Word, Excel & Slides",
    shortDescription: "One single lightweight application to open, view, edit, and organize all major document formats seamlessly."
  },
  {
    name: "PDF Reader & Editor",
    packageName: "pdf.reader.pdfviewer.pdfeditor.app",
    slug: "pdf-reader-editor",
    category: "Productivity",
    tagline: "Feature-Packed Mobile PDF Viewer, Annotator & Manager",
    shortDescription: "Read eBooks, annotate forms, sign contracts, and organize your PDF documents with smooth page navigation."
  },
  {
    name: "TXT : Read and Edit",
    packageName: "com.txtreader.texteditor.app",
    slug: "txt-reader",
    category: "Productivity",
    tagline: "Distraction-Free Notepad & Plain Text File Editor",
    shortDescription: "Minimalist text viewer and markdown-friendly editor engineered for rapid notes, code snippets, and logs."
  },
  {
    name: "DOC & DOCX :Read and Edit",
    packageName: "com.docxreader.docreader.app",
    slug: "doc-and-docx-reader",
    category: "Productivity",
    tagline: "Modern Mobile Word Document Viewer & Manager",
    shortDescription: "View and review Word DOC and DOCX files on the go with zero formatting distortion and complete privacy."
  },
  {
    name: "Excel Reader : XLS File Edit",
    packageName: "com.xlsxreader.excelreader.app",
    slug: "excel-reader-xls-file",
    category: "Productivity",
    tagline: "High-Performance Spreadsheet & Table Inspector",
    shortDescription: "Open, calculate, and inspect complex Excel XLS/XLSX workbooks with fluid zooming and clear table layout."
  },
  {
    name: "Smart Voice Calculator",
    packageName: "com.smartvoicecal.app",
    slug: "smart-voice-calculator",
    category: "Tools",
    tagline: "Speak to Calculate Hands-Free Math Equations",
    shortDescription: "Innovative voice-activated calculator that speaks back answers and simplifies rapid everyday math."
  },
  {
    name: "GhostX VPN",
    packageName: "com.GhostXVPN.app",
    slug: "ghostx-vpn",
    category: "Tools",
    tagline: "Stealth Virtual Private Network & Encryption Tunnel",
    shortDescription: "Ultra-fast proxy servers designed to defend your digital privacy and secure public Wi-Fi hotspots."
  },
  {
    name: "Expense Checklist",
    packageName: "com.expense.checklist",
    slug: "expense-checklist",
    category: "Productivity",
    tagline: "Daily Budget & Personal Expense Tracker",
    shortDescription: "Simple and intuitive expense organizer to manage recurring bills, daily outlays, and budget goals."
  },
  {
    name: "Grocery Checklist",
    packageName: "com.GroceryChecklist.app",
    slug: "grocery-checklist",
    category: "Productivity",
    tagline: "Smart Shopping List & Pantry Organizer",
    shortDescription: "Build organized grocery checklists categorized by aisle so you never miss an ingredient at the store."
  },
  {
    name: "FFF Daimond and Guide",
    packageName: "com.ffdiamond.app",
    slug: "fff-diamond-guide",
    category: "Tools",
    tagline: "Gaming Tips, Strategies & Companion Guide",
    shortDescription: "Discover expert loadout tips, character tactics, weapon statistics, and companion guides for mobile gaming."
  },
  {
    name: "Status Saver -Video Downloader",
    packageName: "app.statussaver.videodownloaderpro",
    slug: "status-saver-video-downloader",
    category: "Tools",
    tagline: "Save Status Videos & Photos Directly to Gallery",
    shortDescription: "Easily backup and organize status updates, short clips, and memorable pictures straight onto your phone."
  },
  {
    name: "Paper AI PDF - APP (TTS)",
    packageName: "com.paperknifeapp",
    slug: "paper-ai-pdf-tts",
    category: "Productivity",
    tagline: "Listen to Documents with AI Text-to-Speech Voice",
    shortDescription: "Turn lengthy PDFs, articles, and documents into natural human audio so you can listen while multitasking."
  },
  {
    name: "PaperFlow PDF Tools",
    packageName: "com.paperknifepdf",
    slug: "paperflow-pdf-tools",
    category: "Productivity",
    tagline: "Merge, Split, Compress & Secure PDF Documents",
    shortDescription: "Powerful all-in-one PDF utility station to compress file size, combine chapters, and password-protect pages."
  },
  {
    name: "Wallpaper Pro 4K",
    packageName: "com.freewallpapers4k.gold",
    slug: "wallpaper-pro-4k",
    category: "Personalization",
    tagline: "Ultra-HD 4K Wallpapers & AMOLED Backgrounds",
    shortDescription: "Explore thousands of curated 4K backgrounds, artistic aesthetics, and battery-friendly AMOLED wallpapers."
  },
  {
    name: "Qr Scanner and Generator",
    packageName: "com.Qrscannerandgenerator",
    slug: "qr-scanner-generator",
    category: "Tools",
    tagline: "Instant QR Code Scanner & Custom Code Creator",
    shortDescription: "Lightning-speed barcode reader and generator for Wi-Fi passwords, contact cards, web links, and text."
  },
  {
    name: "Sharp PDF -Tools",
    packageName: "com.sharppdf.tools",
    slug: "sharp-pdf-tools",
    category: "Productivity",
    tagline: "Clean, Lightweight PDF Optimizer & Utility Kit",
    shortDescription: "Sharpen scanned pages, reorder sheets, convert images to PDF, and clean up messy documents on the go."
  },
  {
    name: "Zolex VPN - Security & Privacy",
    packageName: "com.zolex.vpnpro",
    slug: "zolex-vpn",
    category: "Tools",
    tagline: "Private Virtual Network with Zero Log Architecture",
    shortDescription: "Protect sensitive data with military-grade encryption and access your favorite global web services securely."
  },
  {
    name: "Quick AI PDF – Scan & Read",
    packageName: "com.quick.aipdf",
    slug: "quick-ai-pdf-scan-read",
    category: "Productivity",
    tagline: "Intelligent Document Scanner & Smart Summarizer",
    shortDescription: "Capture paper documents with high-clarity auto-cropping, OCR text extraction, and quick reading modes."
  },
  {
    name: "Zolex VPN Pro-Security&Privacy₹1,499.00",
    packageName: "com.zolex.vpnpromax",
    slug: "zolex-vpn-pro-max",
    category: "Tools",
    tagline: "Premium High-Bandwidth Dedicated Proxy Nodes",
    shortDescription: "Ultra-low latency dedicated VIP tunneling routes engineered for maximum throughput and ultimate privacy."
  },
  {
    name: "ID & Passport Photo Maker",
    packageName: "com.idcardmaker.passportphotomaker",
    slug: "id-and-passport-photo-maker",
    category: "Productivity",
    tagline: "Custom ID Card Maker, Badge Designer & Passport Photo Studio",
    shortDescription: "Create custom ID cards, student badges, staff passes, and passport-size photo layouts directly on your phone."
  },
  {
    name: "Word Search & Connect Game",
    packageName: "com.wordsearchandconnectgame",
    slug: "word-search-and-connect-game",
    category: "Casual Games",
    tagline: "Engaging Word Hunt & Crossword Vocabulary Puzzle",
    shortDescription: "Find hidden words, connect letter tiles, and expand your vocabulary across hundreds of relaxing brain puzzles."
  },
  {
    name: "Net Go VPN",
    packageName: "com.netgovpn",
    slug: "net-go-vpn",
    category: "Tools",
    tagline: "Fast & Encrypted WireGuard VPN Tunnel",
    shortDescription: "Secure your connection with modern WireGuard tunneling, worldwide servers, and zero-log private browsing."
  },
  {
    name: "Aim Headshot Sensitivity",
    packageName: "com.aim.headshot.sensitivity.tool",
    slug: "aim-headshot-sensitivity",
    category: "Tools",
    tagline: "Gaming Sensitivity, DPI & Pro Esports Tag Studio",
    shortDescription: "Optimize weapon sensitivity, screen DPI, and HUD button layouts, plus generate stylish esports gamertags."
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function fetchPlayData(pkg) {
  return new Promise((resolve) => {
    https.get(`https://play.google.com/store/apps/details?id=${pkg}&hl=en&gl=US`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        const iconMatch = data.match(/<img class="T75of[^"]*" src="([^"]+)"/i) || data.match(/src="(https:\/\/play-lh\.googleusercontent\.com\/[^"]+)"/i);
        const allPlayImages = [...data.matchAll(/src="(https:\/\/play-lh\.googleusercontent\.com\/[^"=]+)=w526-h296-rw"/g)].map(m => m[1] + "=w720-h1280-rw");
        
        resolve({
          iconUrl: iconMatch ? iconMatch[1].replace(/=w\d+-h\d+-rw/, "=s256-rw") : null,
          screenshots: Array.from(new Set(allPlayImages)).slice(0, 5)
        });
      });
    }).on("error", () => resolve({ iconUrl: null, screenshots: [] }));
  });
}

async function main() {
  const storePath = path.join(__dirname, "../data/store.json");
  const oldStore = JSON.parse(fs.readFileSync(storePath, "utf8"));
  const imagesDir = path.join(__dirname, "../public/images/apps");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const finalApps = [];

  for (let i = 0; i < userApps.length; i++) {
    const u = userApps[i];
    console.log(`[${i+1}/${userApps.length}] Processing ${u.name} (${u.packageName})...`);
    
    // Check if we have existing app data to preserve features/permissions
    const existing = oldStore.apps.find(a => a.packageName.toLowerCase() === u.packageName.toLowerCase());
    
    let iconPath = `/images/apps/${u.slug}-icon.png`;
    let screenshotPaths = [];
    
    const diskIcon = path.join(__dirname, `../public${iconPath}`);
    
    // Scrape from play store if needed
    const playData = await fetchPlayData(u.packageName);
    
    if (playData.iconUrl && (!fs.existsSync(diskIcon) || fs.statSync(diskIcon).size < 1000)) {
      try {
        await downloadFile(playData.iconUrl, diskIcon);
        console.log(`  Downloaded icon -> ${iconPath}`);
      } catch (e) {
        console.log(`  Failed downloading icon: ${e.message}`);
      }
    }
    
    // Download screenshots
    if (playData.screenshots && playData.screenshots.length > 0) {
      for (let sIdx = 0; sIdx < playData.screenshots.length; sIdx++) {
        const sUrl = playData.screenshots[sIdx];
        const sRelative = `/images/apps/${u.slug}-screenshot-${sIdx + 1}.png`;
        const sDisk = path.join(__dirname, `../public${sRelative}`);
        try {
          if (!fs.existsSync(sDisk) || fs.statSync(sDisk).size < 1000) {
            await downloadFile(sUrl, sDisk);
            console.log(`  Downloaded screenshot ${sIdx + 1} -> ${sRelative}`);
          }
          screenshotPaths.push(sRelative);
        } catch (e) {
          console.log(`  Failed screenshot ${sIdx + 1}: ${e.message}`);
        }
      }
    }
    
    // If no scraped screenshots, fallback to existing or default
    if (screenshotPaths.length === 0 && existing && existing.screenshots) {
      screenshotPaths = existing.screenshots;
    }
    if (screenshotPaths.length === 0) {
      screenshotPaths = [iconPath];
    }

    const defaultFeatures = [
      "Intuitive and easy-to-use interface tailored for mobile productivity",
      "Fast response times with zero unnecessary background battery drain",
      "Local on-device processing prioritizing privacy and data integrity",
      "Regular updates conforming to latest Android SDK and Google Play guidelines"
    ];

    const defaultPermissions = [
      {
        name: "Storage / Media Access",
        purpose: "Required to open, edit, and save user-selected files on the device."
      },
      {
        name: "Internet & Network State",
        purpose: "Used strictly for license verification, critical telemetry, and security checks."
      }
    ];

    // Assemble clean app object WITHOUT rating or reviews!
    const appObj = {
      id: u.slug,
      slug: u.slug,
      name: u.name,
      packageName: u.packageName,
      category: u.category,
      shortDescription: u.shortDescription,
      longDescription: existing?.longDescription || `${u.name} by Publixa is crafted to deliver exceptional utility, maximum convenience, and uncompromising privacy. Built adhering strictly to Google Play developer standards, ${u.name} ensures reliable performance with clear offline boundaries.`,
      tagline: u.tagline,
      downloads: existing?.downloads || "100K+",
      icon: iconPath,
      screenshots: screenshotPaths,
      features: existing?.features || defaultFeatures,
      permissions: existing?.permissions || defaultPermissions,
      thirdPartySDKs: existing?.thirdPartySDKs || [
        "Google Play Services",
        "Google AdMob",
        "Firebase Core"
      ],
      playStoreUrl: `https://play.google.com/store/apps/details?id=${u.packageName}`,
      lastUpdated: "2026-03-01",
      status: "Published"
    };

    finalApps.push(appObj);
  }

  const updatedStore = {
    apps: finalApps,
    deletionRequests: oldStore.deletionRequests || [],
    supportMessages: oldStore.supportMessages || []
  };

  fs.writeFileSync(storePath, JSON.stringify(updatedStore, null, 2), "utf8");
  console.log(`\nSuccessfully updated store.json with EXACTLY ${finalApps.length} apps and NO reviews/ratings!`);
}

main().catch(console.error);
