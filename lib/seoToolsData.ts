export type PdfCategory = 'Organize' | 'Edit & Markup' | 'Security & Clean' | 'Create & Read';

export type PdfToolId =
  | 'merge'
  | 'split'
  | 'delete'
  | 'rearrange'
  | 'addpage'
  | 'nup'
  | 'sign'
  | 'addimage'
  | 'watermark'
  | 'headerfooter'
  | 'pagenum'
  | 'bates'
  | 'redact'
  | 'rotate'
  | 'margin'
  | 'compress'
  | 'repair'
  | 'flatten'
  | 'sanitize'
  | 'metadata'
  | 'img2pdf'
  | 'create'
  | 'reader'
  | 'scan'
  | 'crop'
  | 'reverse'
  | 'splitzip'
  | 'highlighter'
  | 'extractlinks'
  | 'extractimages'
  | 'securityaudit'
  | 'dictation'
  | 'csv2pdf'
  | 'json2pdf';

export interface PdfToolMeta {
  id: PdfToolId;
  slug: string;
  title: string;
  shortDesc: string;
  seoDescription: string;
  category: PdfCategory;
  badge?: string;
  keywords: string[];
  features: string[];
  howToSteps: string[];
}

export const ALL_PDF_TOOLS: PdfToolMeta[] = [
  {
    id: 'merge',
    slug: 'merge-pdf',
    title: 'Merge PDF',
    category: 'Organize',
    shortDesc: 'Combine multiple PDFs into one clean file.',
    seoDescription:
      'Merge multiple PDF documents into a single unified file directly in browser RAM with zero server uploads. Reorder files, inspect exact page counts, and combine invoices, contracts, or study notes instantly.',
    keywords: ['merge pdf online free', 'combine pdf files', 'join pdf offline'],
    features: ['Drag-free up/down file ordering', 'Shows exact per-file page counts', 'Preserves vector text & hyperlinks', 'Unlimited merges in browser RAM'],
    howToSteps: ['Add two or more PDF files from your device.', 'Use the up/down arrows to arrange the document order.', 'Click Merge & Download PDF to save your combined file instantly.'],
  },
  {
    id: 'split',
    slug: 'split-pdf',
    title: 'Split / Extract PDF',
    category: 'Organize',
    shortDesc: 'Extract exact page ranges into a new PDF.',
    seoDescription:
      'Split large multi-page PDF documents by selecting custom page ranges (e.g., 1-3, 5). Extract chapters, receipts, or individual certificates privately without uploading sensitive documents.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages free'],
    features: ['Supports single pages & comma ranges (1-3, 5)', 'Instant client-side page copying', 'No file size cap or account wall', 'Zero quality degradation'],
    howToSteps: ['Upload any multi-page PDF document.', 'Enter the page numbers or ranges you want to extract (e.g., 1-3, 5).', 'Click Extract Pages PDF to download only the selected pages.'],
  },
  {
    id: 'delete',
    slug: 'delete-pages',
    title: 'Delete Pages',
    category: 'Organize',
    badge: 'New',
    shortDesc: 'Remove unwanted or blank PDF pages permanently.',
    seoDescription:
      'Delete specific unwanted, duplicate, or blank pages from any PDF file in seconds. Enter page numbers or ranges to prune and download a clean updated PDF immediately.',
    keywords: ['delete pdf pages', 'remove pages from pdf', 'prune pdf pages'],
    features: ['Prune individual pages or ranges cleanly', 'Preserves formatting on remaining pages', 'Automatic page index safety check', '100% private in browser memory'],
    howToSteps: ['Select your source PDF file.', 'Type the page numbers or ranges to remove (e.g., 2, 4-5).', 'Press Delete Pages & Save PDF to export the trimmed document.'],
  },
  {
    id: 'rearrange',
    slug: 'rearrange-pages',
    title: 'Rearrange & Reverse',
    category: 'Organize',
    badge: 'New',
    shortDesc: 'Custom-order or reverse all pages in 1 click.',
    seoDescription:
      'Reorder PDF pages in any custom sequence (such as 3, 1, 2, 4) or reverse the entire page order from back to front with a single click—ideal for inverted double-sided scanner batches.',
    keywords: ['rearrange pdf pages', 'reverse pdf page order', 'reorder pdf'],
    features: ['Custom comma-separated sequence (3, 1, 2)', '1-click full Back-to-Front page reverse', 'Great for fixing duplex scanner batches', 'Keeps bookmarks & page dimensions intact'],
    howToSteps: ['Load your PDF document.', 'Enter a custom order like 3, 1, 2 or click Reverse All Pages.', 'Download your cleanly re-indexed PDF immediately.'],
  },
  {
    id: 'addpage',
    slug: 'add-blank-page',
    title: 'Add Blank Page',
    category: 'Organize',
    badge: 'New',
    shortDesc: 'Insert blank A4 or matching-size pages anywhere.',
    seoDescription:
      'Insert crisp blank A4, Letter, or matching-dimension pages at the beginning, end, or after any page index inside your PDF for divider sheets, notes, or double-sided booklet alignment.',
    keywords: ['insert blank page into pdf', 'add page to pdf free'],
    features: ['Insert at start, end, or after any page number', 'Automatically matches document page size', 'Useful for duplex printing alignment', 'Instant offline download'],
    howToSteps: ['Upload your existing PDF.', 'Choose where to insert the blank page (Start, End, or After Page #).', 'Click Insert Blank Page & Save to download.'],
  },
  {
    id: 'nup',
    slug: 'nup-grid',
    title: 'N-Up Multi-Page Grid',
    category: 'Organize',
    badge: 'New',
    shortDesc: 'Combine 2 or 4 PDF pages per sheet for printing.',
    seoDescription:
      'Impose multiple PDF pages onto a single sheet (2-up side-by-side or 4-up grid layout) to save paper, build compact study handouts, or preview multi-slide decks cleanly.',
    keywords: ['n-up pdf', '2 pages per sheet pdf', 'pdf imposition online'],
    features: ['Supports 2-Up side-by-side & 4-Up grid layouts', 'Clean proportional vector scaling onto A4 sheets', 'Cuts ink & paper usage by 50–75%', 'Runs completely offline'],
    howToSteps: ['Select the PDF you want to condense.', 'Pick 2-Up (2 per sheet) or 4-Up (2x2 grid).', 'Generate and download your print-ready imposed PDF.'],
  },
  {
    id: 'sign',
    slug: 'sign-pdf',
    title: 'Sign PDF',
    category: 'Edit & Markup',
    shortDesc: 'Draw smooth signatures & stamp onto any page.',
    seoDescription:
      'Draw high-resolution electronic signatures with custom ink colors directly on your screen and embed them cleanly onto the first, last, or every page of agreements and offer letters.',
    keywords: ['sign pdf online free', 'electronic signature pdf', 'draw signature pdf'],
    features: ['Smooth pressure-friendly HTML5 touch/mouse ink pad', 'Black, Navy, and Crimson ink choices', 'Stamp on first, last, or all pages', 'Corner placement options'],
    howToSteps: ['Load the PDF contract or form.', 'Draw your signature inside the canvas pad and pick ink color & placement.', 'Click Sign & Download PDF to embed it permanently.'],
  },
  {
    id: 'addimage',
    slug: 'add-image-stamp',
    title: 'Stamp Image / Logo',
    category: 'Edit & Markup',
    badge: 'New',
    shortDesc: 'Embed PNG/JPG logos or photos onto PDF pages.',
    seoDescription:
      'Place company logos, scanned wet signatures, QR codes, or ID photos cleanly onto selected pages of your PDF with adjustable width and corner positioning.',
    keywords: ['add image to pdf', 'stamp logo on pdf', 'insert photo pdf'],
    features: ['Supports PNG transparency & JPG photos', 'Adjustable stamp width slider (60px–280px)', 'Top-right, bottom-right, or center placement', '100% browser memory processing'],
    howToSteps: ['Upload your PDF file and choose a PNG/JPG image or logo.', 'Set stamp width and page corner placement.', 'Click Stamp Image & Save PDF to merge cleanly.'],
  },
  {
    id: 'watermark',
    slug: 'watermark-pdf',
    title: 'Watermark PDF',
    category: 'Edit & Markup',
    shortDesc: 'Apply diagonal text watermarks with opacity.',
    seoDescription:
      'Protect intellectual property and confidential drafts with customizable angled text watermarks, selectable brand colors, and precise transparency control across every page.',
    keywords: ['watermark pdf free', 'add confidential stamp to pdf'],
    features: ['Custom watermark text & color presets', 'Adjustable opacity from 10% to 80%', '45-degree diagonal overlay across every page', 'Zero external server exposure'],
    howToSteps: ['Choose your target PDF file.', 'Type your watermark label (e.g., CONFIDENTIAL) and set opacity & color.', 'Click Apply Watermark & Download PDF.'],
  },
  {
    id: 'headerfooter',
    slug: 'header-footer',
    title: 'Header & Footer',
    category: 'Edit & Markup',
    badge: 'New',
    shortDesc: 'Stamp top headers & bottom footers across pages.',
    seoDescription:
      'Add consistent document titles, classification labels, or copyright notices to the top header and bottom footer margins across every page of your PDF.',
    keywords: ['add header footer to pdf', 'stamp pdf margins'],
    features: ['Top header + bottom footer text stamps', 'Consistent margin placement across all pages', 'Safe WinAnsi Helvetica font encoding', 'Instant local export'],
    howToSteps: ['Upload your PDF file.', 'Customize top header text and bottom footer text.', 'Stamp across every page and download immediately.'],
  },
  {
    id: 'pagenum',
    slug: 'page-numbers',
    title: 'Page Numbers',
    category: 'Edit & Markup',
    shortDesc: 'Add sequential Page 1 of N numbering cleanly.',
    seoDescription:
      'Insert crisp sequential page numbers (Page 1 of N) at bottom-center, bottom-right, or top-right corners with custom label prefixes and starting offsets.',
    keywords: ['add page numbers to pdf', 'number pdf pages online'],
    features: ['Custom label prefix & start number', 'Bottom-Center, Bottom-Right, or Top-Right position', 'Automatic Page X of Y numbering', 'Clean readable typography'],
    howToSteps: ['Load your multi-page PDF.', 'Set prefix, starting number, and preferred corner position.', 'Click Add Page Numbers & Save PDF.'],
  },
  {
    id: 'bates',
    slug: 'bates-numbering',
    title: 'Bates Numbering',
    category: 'Edit & Markup',
    badge: 'New',
    shortDesc: 'Apply sequential legal discovery alphanumeric IDs.',
    seoDescription:
      'Stamp official sequential legal discovery Bates numbers (e.g., CASE-00001, EXH-00101) with configurable zero-padding and custom document prefixes for law firms and audits.',
    keywords: ['bates numbering pdf free', 'legal discovery pdf stamp'],
    features: ['Custom case/exhibit prefix (e.g. CASE-)', 'Configurable zero-padding (4, 5, or 6 digits)', 'Starting index offset control', 'Essential for confidential legal compliance'],
    howToSteps: ['Upload your confidential legal or audit PDF.', 'Enter your Bates prefix, starting index, and zero-padding width.', 'Apply sequential IDs and download privately.'],
  },
  {
    id: 'redact',
    slug: 'redact-pdf',
    title: 'Redact Confidential',
    category: 'Security & Clean',
    badge: 'New',
    shortDesc: 'Permanently blackout top, middle or footer zones.',
    seoDescription:
      'Draw solid permanent black redaction boxes over sensitive header, address, signature, or footer regions on chosen PDF pages prior to public disclosure or compliance review.',
    keywords: ['redact pdf free', 'blackout sensitive text pdf'],
    features: ['Top header, middle body, or bottom footer blackout zones', 'Target specific page numbers or ranges', 'Solid opaque vector black bars', 'Zero sensitive data leaves your computer'],
    howToSteps: ['Select your PDF document.', 'Choose target pages and the vertical region (Top, Middle, or Bottom) to blackout.', 'Click Apply Blackout Redaction to download.'],
  },
  {
    id: 'rotate',
    slug: 'rotate-pages',
    title: 'Rotate Pages',
    category: 'Organize',
    shortDesc: 'Fix sideways scans permanently (90/180/270 deg).',
    seoDescription:
      'Permanently correct sideways or upside-down scanned PDF pages by rotating all pages 90, 180, or 270 degrees clockwise inside local browser memory.',
    keywords: ['rotate pdf permanently', 'fix upside down pdf'],
    features: ['Permanent 90°, 180°, or 270° clockwise rotation', 'Saves orientation metadata directly inside PDF pages', 'Works on large multi-page scan files', 'Offline instant export'],
    howToSteps: ['Load your sideways or upside-down PDF.', 'Select 90°, 180°, or 270° rotation angle.', 'Click Rotate & Save PDF to permanently lock orientation.'],
  },
  {
    id: 'margin',
    slug: 'add-margins',
    title: 'Add Print Margins',
    category: 'Edit & Markup',
    badge: 'New',
    shortDesc: 'Expand white margins for spiral binding or notes.',
    seoDescription:
      'Expand page media and crop boxes to add extra blank margin padding around PDF content—ideal for spiral binding, three-hole punching, and handwritten study annotations.',
    keywords: ['add margin to pdf', 'resize pdf border padding'],
    features: ['Expand page border evenly from 12pt to 108pt', 'Updates both MediaBox & CropBox cleanly', 'Preserves center alignment of original artwork', 'Ready for print shops & tablets'],
    howToSteps: ['Upload your PDF document.', 'Adjust the margin padding slider in points (18pt = 0.25 in).', 'Download your print-friendly margined PDF.'],
  },
  {
    id: 'compress',
    slug: 'compress-pdf',
    title: 'Compress PDF',
    category: 'Security & Clean',
    shortDesc: 'Shrink PDF size with object-stream packing.',
    seoDescription:
      'Optimize PDF file sizes cleanly using compressed cross-reference object streams while preserving razor-sharp vector text and displaying exact KB reduction savings.',
    keywords: ['compress pdf without quality loss', 'reduce pdf size offline'],
    features: ['Re-packs objects using compressed PDF 1.5 streams', 'Reports exact Before/After KB & % saved', 'Preserves vector clarity & selectable text', 'Never blurs documents through third-party servers'],
    howToSteps: ['Choose the PDF you want to shrink.', 'Click Optimize & Compress PDF.', 'Review exact size savings and save your compressed PDF.'],
  },
  {
    id: 'repair',
    slug: 'repair-pdf',
    title: 'Repair / Rebuild PDF',
    category: 'Security & Clean',
    badge: 'New',
    shortDesc: 'Reconstruct damaged cross-reference tables.',
    seoDescription:
      'Recover readable pages from glitchy or poorly formatted PDFs by cloning valid page objects into a cleanly indexed cross-reference PDF container.',
    keywords: ['repair pdf online free', 'fix corrupted pdf xref'],
    features: ['Clones readable pages into a fresh PDF container', 'Rebuilds broken xref & trailer structures', 'Strips orphaned bloated objects', 'Privacy-safe offline recovery'],
    howToSteps: ['Load a malformed or glitchy PDF file.', 'Run Rebuild Clean PDF Structure.', 'Download the freshly indexed replacement PDF.'],
  },
  {
    id: 'flatten',
    slug: 'flatten-forms',
    title: 'Flatten Forms',
    category: 'Security & Clean',
    badge: 'New',
    shortDesc: 'Lock AcroForm inputs into static non-editable PDF.',
    seoDescription:
      'Flatten fillable PDF form fields, text inputs, and checkboxes into permanent static page layers so tax forms and applications look identical in every viewer.',
    keywords: ['flatten pdf forms', 'lock pdf fields static'],
    features: ['Detects fillable AcroForm widgets automatically', 'Converts text inputs & checkboxes into static ink', 'Prevents accidental edits by recipients', 'Compatible with all standard PDF viewers'],
    howToSteps: ['Upload a filled interactive PDF form.', 'Check form status and click Flatten & Lock PDF.', 'Save the non-editable archival copy.'],
  },
  {
    id: 'sanitize',
    slug: 'sanitize-metadata',
    title: 'Sanitize Metadata',
    category: 'Security & Clean',
    badge: 'New',
    shortDesc: 'Scrub hidden author, software & keyword tags.',
    seoDescription:
      'Strip hidden document Title, Author, Subject, Creator, Producer, and Keywords tracking metadata from PDFs before sharing files publicly or externally.',
    keywords: ['sanitize pdf metadata', 'remove author from pdf privacy'],
    features: ['Zeroes out Author, Creator, Producer & Subject tags', 'Removes hidden keyword tracking fields', 'Leaves visual page content untouched', 'Instant GDPR/OPSEC hygiene check'],
    howToSteps: ['Drop in any PDF before sharing publicly.', 'Click Sanitize & Scrub Metadata.', 'Download an anonymized clean PDF immediately.'],
  },
  {
    id: 'metadata',
    slug: 'metadata-inspector',
    title: 'Inspector & Metadata',
    category: 'Security & Clean',
    shortDesc: 'Inspect page sizes (pt/mm) & edit PDF tags.',
    seoDescription:
      'Audit exact page dimensions in points and millimeters and update PDF Title, Author, and Subject properties without installing desktop Acrobat software.',
    keywords: ['pdf metadata editor', 'check pdf page dimensions'],
    features: ['Inspect per-page exact pt & mm dimensions', 'Edit document Title, Author & Subject properties', 'Detect embedded AcroForm presence', 'Fast offline metadata saves'],
    howToSteps: ['Upload your PDF to inspect properties & page dimensions.', 'Update Title, Author, or Subject fields as needed.', 'Save & Download your updated PDF.'],
  },
  {
    id: 'img2pdf',
    slug: 'images-to-pdf',
    title: 'Images to PDF',
    category: 'Create & Read',
    shortDesc: 'Convert JPG, PNG & WebP photos into one PDF.',
    seoDescription:
      'Bundle multiple PNG, JPG, and WebP photos into crisp A4 or exact-image-dimension PDF albums for expense reports, photo assignments, and ID submissions.',
    keywords: ['jpg to pdf free offline', 'images to pdf converter'],
    features: ['Accepts JPG, PNG, and WebP images', 'Standard A4 Fit or Exact Image Dimensions modes', 'Reorder or remove images before export', 'Zero image uploads to external clouds'],
    howToSteps: ['Select one or multiple JPG/PNG/WebP images.', 'Pick A4 Standardized or Exact Match page sizing.', 'Click Generate Images PDF to download your bundle.'],
  },
  {
    id: 'create',
    slug: 'create-pdf',
    title: 'Create PDF',
    category: 'Create & Read',
    shortDesc: 'Write & format text documents directly to PDF.',
    seoDescription:
      'Author multi-page formatted PDFs directly in your browser with custom titles, author attribution, adjustable typography sizes, and automatic A4 page wrapping.',
    keywords: ['create pdf online free', 'text to pdf generator'],
    features: ['Document title & author header styling', 'Adjustable font size (10pt–16pt)', 'Automatic line-wrapping & A4 pagination', 'Zero registration required'],
    howToSteps: ['Enter your Document Title, Author, and body paragraphs.', 'Select preferred typography size.', 'Click Download New PDF to export a multi-page A4 document.'],
  },
  {
    id: 'reader',
    slug: 'pdf-reader-tts',
    title: 'Reader & AI Voice (TTS)',
    category: 'Create & Read',
    shortDesc: 'Preview PDFs & listen aloud with Web Speech TTS.',
    seoDescription:
      'Open PDFs securely inside the browser reader and listen to pasted document text aloud with natural Web Speech voices and adjustable playback speed.',
    keywords: ['pdf reader text to speech online', 'read pdf aloud'],
    features: ['Local iframe PDF object URL viewer', 'Native OS Web Speech synthesis voices', 'Adjustable playback speed (0.75x to 1.5x)', 'Zero audio data sent externally'],
    howToSteps: ['Upload a PDF to preview inside the local viewer.', 'Paste any excerpt into the Voice Reader panel.', 'Pick your system voice & speed and press Listen Aloud.'],
  },
  {
    id: 'scan',
    slug: 'scanner-to-pdf',
    title: 'Scanner to PDF',
    category: 'Create & Read',
    shortDesc: 'Apply B&W or Color scan filters to photos -> PDF.',
    seoDescription:
      'Turn camera photos of receipts, whiteboards, and handwritten notes into clean high-contrast B&W, Magic Color, or Grayscale scanned PDFs locally.',
    keywords: ['document scanner to pdf online', 'scan receipt photo to pdf'],
    features: ['Crushed B&W Document, Magic Color, Grayscale & Original presets', 'Live interactive Canvas preview', 'Fits scanned shot onto crisp A4 PDF sheet', 'Ideal for invoices & receipts'],
    howToSteps: ['Upload a smartphone photo of a receipt or document.', 'Select B&W Document or Magic Color enhancement.', 'Export the clean high-contrast scan directly as a PDF.'],
  },
  {
    id: 'crop',
    slug: 'crop-pdf',
    title: 'Crop PDF Margins',
    category: 'Organize',
    badge: 'New',
    shortDesc: 'Trim white borders or headers cleanly from all pages.',
    seoDescription:
      'Crop top, bottom, left, and right margins from every page of a PDF by adjusting CropBox and MediaBox coordinates directly inside browser memory.',
    keywords: ['crop pdf margins online free', 'trim pdf borders offline'],
    features: ['Independent Top, Bottom, Left & Right trim points', 'Safety clamp prevents invalid negative boxes', 'Preserves crisp selectable vector text', '100% browser RAM processing'],
    howToSteps: ['Upload your PDF file.', 'Set Top, Bottom, Left, and Right crop points.', 'Click Crop & Save PDF to export trimmed pages cleanly.'],
  },
  {
    id: 'reverse',
    slug: 'reverse-pdf',
    title: 'Reverse PDF Pages',
    category: 'Organize',
    badge: 'New',
    shortDesc: 'Flip entire PDF order back-to-front in 1 click.',
    seoDescription:
      'Invert multi-page PDF documents from last page to first page in a single click—ideal for fixing reverse-fed ADF scanner batches and upside-down exports.',
    keywords: ['reverse pdf page order', 'flip pdf last to first'],
    features: ['1-click back-to-front page inversion', 'Preserves page sizes, annotations & fonts', 'Instant processing for multi-page documents', 'Zero uploads or account wall'],
    howToSteps: ['Upload your multi-page PDF.', 'Click Reverse All Pages & Download.', 'Save your properly ordered PDF immediately.'],
  },
  {
    id: 'splitzip',
    slug: 'split-pdf-zip',
    title: 'Split PDF Into ZIP',
    category: 'Organize',
    badge: 'New',
    shortDesc: 'Burst every 1 or N pages into separate PDFs inside a ZIP.',
    seoDescription:
      'Split a multi-page PDF into dozens of individual standalone PDF documents grouped by every 1 or N pages, packed automatically into a single downloadable .ZIP archive.',
    keywords: ['burst pdf into single pages zip', 'split pdf every page zip'],
    features: ['Configurable pages per chunk (1 = 1 PDF per page)', 'Client-side ZIP bundling via JSZip', 'Sequential numbered filenames inside archive', 'Unlimited page splitting in browser RAM'],
    howToSteps: ['Upload a multi-page PDF document.', 'Choose how many pages go into each split PDF (e.g., 1).', 'Download the clean .ZIP archive of all separated PDFs.'],
  },
  {
    id: 'highlighter',
    slug: 'pdf-highlighter',
    title: 'PDF Highlighter',
    category: 'Edit & Markup',
    badge: 'New',
    shortDesc: 'Add translucent Yellow, Cyan, Green or Pink highlights.',
    seoDescription:
      'Stamp vivid translucent highlighter bands onto chosen PDF pages at adjustable vertical heights and widths—great for marking contracts, study handouts, and invoices.',
    keywords: ['highlight pdf online free', 'add highlighter bar to pdf'],
    features: ['4 high-contrast highlighter ink colors', 'Adjustable Y position, width & band height', 'Select specific pages or page ranges', 'Non-destructive vector overlay'],
    howToSteps: ['Upload your PDF document.', 'Choose highlighter color, vertical Y height, and target pages.', 'Apply Highlight & Download PDF immediately.'],
  },
  {
    id: 'extractlinks',
    slug: 'pdf-link-extractor',
    title: 'PDF Link Extractor',
    category: 'Security & Clean',
    badge: 'New',
    shortDesc: 'Audit and export all clickable URLs inside any PDF.',
    seoDescription:
      'Scan every page annotation and link dictionary inside a PDF document to uncover embedded external HTTP/HTTPS URLs, phishing links, and clickable citations offline.',
    keywords: ['extract links from pdf online', 'audit pdf urls offline'],
    features: ['Reads /URI action dictionaries across all objects', 'Deduplicates & lists every clickable URL found', '1-click Copy All or Download .TXT report', '100% private local inspection'],
    howToSteps: ['Load any PDF file into the analyzer.', 'View the list of extracted embedded URLs immediately.', 'Copy URLs or download the text report.'],
  },
  {
    id: 'extractimages',
    slug: 'extract-pdf-images',
    title: 'Extract PDF Images',
    category: 'Create & Read',
    badge: 'New',
    shortDesc: 'Inspect embedded XObject images & save JPEG assets.',
    seoDescription:
      'Inspect embedded image XObjects inside any PDF document, check pixel dimensions and compression filters, and download embedded JPEG (DCTDecode) images directly to your device.',
    keywords: ['extract images from pdf free', 'rip photos from pdf offline'],
    features: ['Enumerates all /Subtype /Image XObjects in RAM', 'Displays width, height, and filter encoding', 'Direct 1-click download for embedded JPEG assets', 'No cloud file exposure'],
    howToSteps: ['Upload a PDF containing embedded images.', 'Review every detected image stream and its dimensions.', 'Click Download JPG on any extractable image.'],
  },
  {
    id: 'securityaudit',
    slug: 'pdf-security-audit',
    title: 'PDF Password & Risk Audit',
    category: 'Security & Clean',
    badge: 'New',
    shortDesc: 'Check encryption flags, JS scripts & tracking actions.',
    seoDescription:
      'Run a quick local security inspection on incoming PDFs before trusting them—detecting encryption status, embedded JavaScript (/JS) actions, AcroForm count, and external links.',
    keywords: ['check pdf for javascript viruses', 'pdf password audit tool'],
    features: ['Detects password protection & encryption state', 'Scans object streams for /JS & /JavaScript triggers', 'Counts form fields & embedded /URI links', 'Zero cloud execution'],
    howToSteps: ['Select an untrusted or client PDF file.', 'Read the instant encryption, JavaScript & link report.', 'Verify document safety cleanly offline.'],
  },
  {
    id: 'dictation',
    slug: 'pdf-dictation',
    title: 'Voice Dictation to PDF',
    category: 'Create & Read',
    badge: 'New',
    shortDesc: 'Speak naturally into your mic & export directly to PDF.',
    seoDescription:
      'Turn live microphone speech dictation into clean multi-page formatted PDF notes using browser Web Speech Recognition—perfect for hands-free essays, memos, and transcripts.',
    keywords: ['voice to pdf dictation online', 'speech to pdf converter free'],
    features: ['Live Web Speech microphone transcription', 'Editable transcript & custom PDF title', 'Automatic A4 wrapping & pagination', 'Private browser processing'],
    howToSteps: ['Click Start Voice Mic (or type/edit notes directly).', 'Speak clearly to append sentences live.', 'Click Export Dictation PDF to download your document.'],
  },
  {
    id: 'csv2pdf',
    slug: 'csv-to-pdf',
    title: 'CSV Table to PDF',
    category: 'Create & Read',
    badge: 'New',
    shortDesc: 'Convert CSV data tables into styled striped A4 PDFs.',
    seoDescription:
      'Transform comma-separated `.csv` exports or pasted spreadsheets into crisp styled header-banded PDF tables directly in browser memory using SheetJS and pdf-lib.',
    keywords: ['csv to pdf converter free offline', 'convert csv table to pdf'],
    features: ['Upload .CSV or paste raw comma rows', 'Styled accent header row & alternating zebra rows', 'Auto-sizes columns cleanly on A4 landscape/portrait', '100% private conversion'],
    howToSteps: ['Upload a .CSV file or paste sample rows.', 'Preview row & column counts cleanly.', 'Download your formatted table PDF instantly.'],
  },
  {
    id: 'json2pdf',
    slug: 'json-to-pdf',
    title: 'JSON / Code to PDF',
    category: 'Create & Read',
    badge: 'New',
    shortDesc: 'Format JSON, XML, or plain logs into clean monospace PDFs.',
    seoDescription:
      'Pretty-print JSON payloads, API specs, XML configs, or developer logs and render them onto clean Courier monospace multi-page A4 PDF sheets locally.',
    keywords: ['json to pdf converter offline', 'code snippet to pdf'],
    features: ['Auto-beautifies valid JSON with 2-space indent', 'Monospace Courier typography for aligned keys', 'Supports multi-page pagination cleanly', 'Safe for confidential API payloads'],
    howToSteps: ['Upload a .JSON/.XML file or paste code text.', 'Optionally click Auto-Format JSON.', 'Click Generate PDF to export clean pages.'],
  },
];

export type WebToolComponentKey =
  | 'docx'
  | 'doc2pdf'
  | 'excel'
  | 'excel2pdf'
  | 'ppt_create'
  | 'ppt_reader'
  | 'ppt_charts'
  | 'ppt_outline'
  | 'ppt_templates'
  | 'stylish'
  | 'qr'
  | 'passport'
  | 'wallpaper'
  | 'status_media'
  | 'voice_calc'
  | 'birthday'
  | 'expense'
  | 'grocery'
  | 'unit'
  | 'password'
  | 'color'
  | 'json'
  | 'base64'
  | 'timer'
  | 'bmi'
  | 'vpn_inspector'
  | 'vpn_wireguard'
  | 'vpn_dns'
  | 'vpn_tracker'
  | 'game_word'
  | 'game_sort'
  | 'game_music'
  | 'img_compress'
  | 'img_convert'
  | 'img_resize'
  | 'img_strip'
  | 'img_palette'
  | 'word_case'
  | 'text_diff'
  | 'hash_uuid'
  | 'finance_calc'
  | 'age_date';

export interface WebToolMeta {
  slug: string;
  title: string;
  category:
    | 'Document Suite'
    | 'Spreadsheet Suite'
    | 'Presentation Suite'
    | 'Creator & Media'
    | 'Everyday Utilities'
    | 'Privacy & Security'
    | 'Web Games';
  shortDesc: string;
  seoDescription: string;
  keywords: string[];
  features: string[];
  howToSteps: string[];
  componentKey: WebToolComponentKey;
}

export const ALL_WEB_TOOLS: WebToolMeta[] = [
  // Document Suite
  {
    slug: 'word-docx-editor',
    title: 'Word & DOCX Rich Text Editor',
    category: 'Document Suite',
    shortDesc: 'Google Docs–style WYSIWYG editor with live DOCX, PDF & HTML export.',
    seoDescription:
      'Write, edit, and format rich multi-tab documents directly in your browser—no login required. Supports H1–H3 headings, custom fonts, text/highlight colors, tables, images, and clean PDF or .DOCX downloads preserving every edit.',
    keywords: ['online word editor no account', 'edit docx online free', 'google docs alternative offline'],
    features: ['Left Document Tabs & auto-generated Headings Outline', 'Full formatting toolbar + Insert Table & Image', 'Auto-saves locally in browser storage', 'Exports edits faithfully to PDF, DOCX, HTML, and TXT'],
    howToSteps: ['Open an existing .DOCX/.TXT file or start writing from templates.', 'Use File, Format, and Insert menus to customize typography and layout.', 'Download instantly as PDF, Microsoft Word (.DOCX), or HTML.'],
    componentKey: 'docx',
  },
  {
    slug: 'doc-to-pdf-converter',
    title: 'Document & DOCX to PDF Converter',
    category: 'Document Suite',
    shortDesc: 'Convert Word (.DOCX), Markdown & HTML files cleanly to PDF.',
    seoDescription:
      'Load Word (.DOCX), TXT, Markdown, or HTML files directly in browser memory, adjust styles or fix typos before exporting, and save crisp paginated A4 PDFs with zero server uploads.',
    keywords: ['docx to pdf converter offline', 'word to pdf no upload'],
    features: ['Client-side DOCX parser via Mammoth', 'Inline pre-export typo & heading edits', 'Preserves colors, alignment, and tables in PDF output', '100% confidential browser RAM conversion'],
    howToSteps: ['Upload a .DOCX, .TXT, or .MD document from your device.', 'Inspect or tweak formatting directly on the page.', 'Click PDF Export to download a clean vector A4 PDF.'],
    componentKey: 'doc2pdf',
  },

  // Spreadsheet Suite
  {
    slug: 'excel-spreadsheet-editor',
    title: 'Excel & Sheets Formula Workbench',
    category: 'Spreadsheet Suite',
    shortDesc: 'Google Sheets–style grid with =SUM, =AVERAGE, =IF, charts & XLSX export.',
    seoDescription:
      'Create and edit multi-sheet workbooks directly in your browser without a Microsoft or Google account. Evaluates live Excel formulas, applies currency/percent formatting and cell colors, builds charts, and exports edited .XLSX, .PDF, and .CSV files.',
    keywords: ['online excel editor no login', 'free spreadsheet formula tool', 'google sheets alternative offline'],
    features: ['Live =SUM, =AVERAGE, =COUNT, =MIN, =MAX, =IF engine', 'Currency, Percent & decimal rounding formatting', 'Multi-sheet bottom tabs & column sorting', 'Instant export of all edits to XLSX, PDF & CSV'],
    howToSteps: ['Load a sample budget/invoice template or upload your .XLSX/.CSV file.', 'Edit cells, write formulas in the fx bar, and apply colors or formats.', 'Click .XLSX or PDF in the top right to save your updated workbook.'],
    componentKey: 'excel',
  },
  {
    slug: 'excel-to-pdf-converter',
    title: 'Excel (.XLSX) & CSV to PDF Converter',
    category: 'Spreadsheet Suite',
    shortDesc: 'Open XLSX/CSV sheets, review totals, and export print-ready PDF.',
    seoDescription:
      'Preview and inspect Microsoft Excel (.XLSX, .XLS) and CSV spreadsheets privately in your browser, modify any numbers or headings inline, and export crisp landscape/portrait PDF reports.',
    keywords: ['excel to pdf converter free offline', 'xlsx to pdf no server upload'],
    features: ['Native client-side SheetJS XLSX parsing', 'Preserves header shading, alignment & cell colors in PDF', 'Multi-column proportional scaling', 'Zero file upload latency'],
    howToSteps: ['Open your .XLSX or .CSV spreadsheet using the Open button.', 'Double-check or edit formulas, quantities, or totals.', 'Press the PDF button to export your spreadsheet cleanly.'],
    componentKey: 'excel2pdf',
  },

  // Presentation Suite
  {
    slug: 'ppt-slide-creator',
    title: 'PPTX Slide Studio & Deck Builder',
    category: 'Presentation Suite',
    shortDesc: 'Build multi-slide decks with themes, speaker notes & .PPTX export.',
    seoDescription:
      'Design modern widescreen presentations with filmstrip thumbnails, selectable color themes, speaker notes, and fullscreen presenter mode. Download native PowerPoint (.PPTX) or widescreen .PDF decks completely free.',
    keywords: ['powerpoint maker online free no account', 'create pptx in browser'],
    features: ['Filmstrip slide navigator & reorderable cards', '4 designer themes (Peach, Midnight, Navy, Mint)', 'Speaker notes & fullscreen slideshow mode', 'One-click .PPTX and widescreen .PDF downloads'],
    howToSteps: ['Edit slide titles, bullet lists, and speaker notes on the main canvas.', 'Pick a color theme that fits your presentation topic.', 'Download your finished deck as .PPTX or .PDF.'],
    componentKey: 'ppt_create',
  },
  {
    slug: 'ppt-reader-viewer',
    title: 'PPT / Presentation Deck Reader',
    category: 'Presentation Suite',
    shortDesc: 'Inspect and present slides cleanly in widescreen browser view.',
    seoDescription:
      'Open, review, and rehearse multi-slide decks inside a clean distraction-free presentation canvas with instant speaker notes and theme contrast controls.',
    keywords: ['online ppt viewer offline', 'presentation slideshow viewer'],
    features: ['Fullscreen click-to-advance presenter mode', 'Built-in speaker cue notes pane', 'Widescreen 16:9 slide preview', 'Works offline with zero plugins'],
    howToSteps: ['Switch between slides in the left filmstrip.', 'Launch Present Fullscreen to rehearse your talk.', 'Export a portable PDF handout whenever ready.'],
    componentKey: 'ppt_reader',
  },
  {
    slug: 'ppt-chart-slides',
    title: 'PPT Chart & Data Slide Builder',
    category: 'Presentation Suite',
    shortDesc: 'Embed visual bar charts straight into PowerPoint & PDF slides.',
    seoDescription:
      'Turn numeric KPI rows directly into styled bar chart slides embedded cleanly into your exported PowerPoint (.PPTX) and widescreen PDF presentations.',
    keywords: ['ppt chart slide generator', 'presentation bar chart maker'],
    features: ['Editable Label + Numeric Value data rows', 'Instant live slide canvas chart preview', 'Embeds vector bars cleanly in .PPTX & .PDF', 'Supports multiple data slides per deck'],
    howToSteps: ['Add category labels and metric values on the Charts tab.', 'Preview the styled bar slide in real time.', 'Download the deck with embedded chart graphics.'],
    componentKey: 'ppt_charts',
  },
  {
    slug: 'ppt-outline-generator',
    title: 'Outline to Slides Generator',
    category: 'Presentation Suite',
    shortDesc: 'Paste structured outlines and auto-generate a full deck.',
    seoDescription:
      'Convert plain-text bulleted notes or Markdown outlines into structured presentation slides in one click—saving hours when turning docs into pitch decks or lectures.',
    keywords: ['text outline to pptx', 'convert notes to powerpoint slides'],
    features: ['One-click batch slide parsing from text blocks', 'Preserves bullet hierarchy automatically', 'Instant theme styling applied across all slides', 'Exports cleanly to .PPTX'],
    howToSteps: ['Paste headings and bullet lines into the Outline box.', 'Click Generate Slides from Outline.', 'Customize or download your newly structured .PPTX deck.'],
    componentKey: 'ppt_outline',
  },
  {
    slug: 'ppt-templates',
    title: 'Presentation Deck Templates',
    category: 'Presentation Suite',
    shortDesc: 'Start fast with Startup Pitch, Sprint Report & Lecture decks.',
    seoDescription:
      'Kickstart investor pitches, weekly sprint updates, or classroom lectures using pre-built editable slide deck templates that export cleanly to PowerPoint (.PPTX).',
    keywords: ['free pitch deck template pptx', 'sprint report slide template'],
    features: ['Startup Pitch, Status Report & Classroom packs', '100% editable text, bullets, and themes', 'Instant live preview', 'Zero sign-up required'],
    howToSteps: ['Browse template cards and click Load Template.', 'Replace placeholder text with your project details.', 'Export to .PPTX or .PDF immediately.'],
    componentKey: 'ppt_templates',
  },

  // Creator & Media
  {
    slug: 'stylish-name-generator',
    title: 'Stylish Name & Unicode Font Studio',
    category: 'Creator & Media',
    shortDesc: '24+ fancy Unicode fonts, wings, crowns & gaming clan tags.',
    seoDescription:
      'Generate eye-catching stylish names for Free Fire, BGMI, Instagram bios, Discord, and YouTube using 24+ mathematical Unicode fonts, gothic alphabets, decorative wings, and 1-tap copy.',
    keywords: ['stylish name generator', 'fancy font copy paste gaming', 'unicode nickname maker'],
    features: ['24+ live Unicode transforms (Gothic, Script, Circled, Wings)', 'Instant 1-click clipboard copy', 'Gaming & general bio presets', 'Works across Android, iOS & web'],
    howToSteps: ['Type your nickname or brand name in the input box.', 'Scroll live variations and decorative symbols.', 'Tap Copy on your favorite style and paste anywhere.'],
    componentKey: 'stylish',
  },
  {
    slug: 'qr-code-studio',
    title: 'QR Code Generator & Scanner Studio',
    category: 'Creator & Media',
    shortDesc: 'Create custom URL, Wi-Fi & UPI payment QR codes (SVG/PNG).',
    seoDescription:
      'Generate high-resolution QR codes for websites, Wi-Fi network logins, UPI payments, or plain text with custom foreground/background colors and instant vector SVG or PNG downloads.',
    keywords: ['free qr code generator svg png', 'wifi qr code maker', 'upi qr generator'],
    features: ['Dedicated URL, Wi-Fi, UPI & Text builders', 'Custom color palette pickers', 'Crisp vector SVG + 480px PNG downloads', 'QR image decoder included'],
    howToSteps: ['Choose QR type (URL, Wi-Fi, UPI, or Text) and enter details.', 'Customize QR foreground and background colors.', 'Download print-sharp SVG or PNG immediately.'],
    componentKey: 'qr',
  },
  {
    slug: 'passport-photo-maker',
    title: 'Passport & ID Photo Sheet Maker',
    category: 'Creator & Media',
    shortDesc: 'Build printable 4x6" ID photo sheets for India, UK, EU & US Visa.',
    seoDescription:
      'Crop and lay out official 35x45mm (India/UK/EU), 2x2 inch (US Visa), or stamp-size passport photos onto standard 4x6-inch printable strips with clean brightness & cut guidelines.',
    keywords: ['passport photo maker online 4x6 sheet', '35x45mm visa photo cropper'],
    features: ['35x45mm, 2x2" US Visa & Stamp size presets', 'Auto-tiles multiple copies onto 4x6" print canvas', 'Brightness/contrast touchups', 'Instant PNG download for home or shop print'],
    howToSteps: ['Upload a clear front-facing portrait photo.', 'Choose official country size preset and background contrast.', 'Download the ready-to-print 4x6 photo sheet.'],
    componentKey: 'passport',
  },
  {
    slug: '4k-wallpaper-creator',
    title: '4K UHD Wallpaper & Gradient Studio',
    category: 'Creator & Media',
    shortDesc: 'Generate 3840x2160 wallpapers with custom color waves.',
    seoDescription:
      'Design and export ultra-crisp 3840x2160 4K desktop and vertical mobile wallpapers using procedural gradient waves and curated color palettes directly on HTML5 Canvas.',
    keywords: ['4k wallpaper generator online', 'gradient background maker 3840x2160'],
    features: ['True 3840px UHD canvas export', 'Peach Sunset, Aurora, Cyber, Mint & Gold presets', 'Instant custom angle & wave overlay rendering', 'Royalty-free personal & commercial output'],
    howToSteps: ['Pick a curated palette preset or adjust colors.', 'Select 4K Desktop (16:9) or Mobile aspect ratio.', 'Click Download 4K Wallpaper to save PNG.'],
    componentKey: 'wallpaper',
  },
  {
    slug: 'status-media-studio',
    title: 'Quote Poster & Status Card Maker',
    category: 'Creator & Media',
    shortDesc: 'Design crisp social quote cards and status graphics in 1080px.',
    seoDescription:
      'Turn daily quotes, announcements, and WhatsApp/Instagram story updates into square or portrait high-resolution gradient status cards without installing design software.',
    keywords: ['quote poster maker online', 'whatsapp status card generator'],
    features: ['Custom headline, subtext & author watermark', 'High-contrast social theme gradients', 'Instant high-res PNG download', '100% browser Canvas rendering'],
    howToSteps: ['Enter your quote or announcement text.', 'Select background gradient theme.', 'Export a crisp social-ready PNG image.'],
    componentKey: 'status_media',
  },

  // Everyday Utilities & Planners
  {
    slug: 'voice-calculator',
    title: 'Smart Voice & GST Calculator',
    category: 'Everyday Utilities',
    shortDesc: 'Calculate expressions with GST shortcuts, speech & tape history.',
    seoDescription:
      'Perform fast arithmetic, apply instant +18% / -18% GST tax adjustments, speak math queries via browser speech recognition, and review your full calculation history tape.',
    keywords: ['gst calculator online', 'voice calculator browser'],
    features: ['Quick GST percentage helpers', 'Calculation audit history tape', 'Optional microphone voice input & audio readback', 'Clean mobile & desktop keypad'],
    howToSteps: ['Tap keypad buttons or type an expression cleanly.', 'Apply tax or math functions as needed.', 'Copy totals or inspect prior calculations in the tape log.'],
    componentKey: 'voice_calc',
  },
  {
    slug: 'unit-converter',
    title: 'All-in-One Unit Converter',
    category: 'Everyday Utilities',
    shortDesc: 'Convert Length, Weight, Temp, Digital Storage & Speed.',
    seoDescription:
      'Instant multi-category unit conversions across metric and imperial standards—covering kilometers/miles, kg/lbs, Celsius/Fahrenheit, MB/GB/TB, and km/h/knots.',
    keywords: ['unit converter online free', 'length weight storage converter'],
    features: ['5 real-time categories (Length, Weight, Temp, Storage, Speed)', 'Zero page reload calculation', 'High-precision decimal output', 'Clean card layout'],
    howToSteps: ['Select a measurement category tab.', 'Enter your source number.', 'Read all converted units simultaneously.'],
    componentKey: 'unit',
  },
  {
    slug: 'password-generator',
    title: 'Cryptographic Password Generator',
    category: 'Everyday Utilities',
    shortDesc: 'Generate CSPRNG passwords using window.crypto cleanly.',
    seoDescription:
      'Create strong random passwords of customizable length directly inside your browser using native Web Crypto API (`crypto.getRandomValues`)—never transmitted over the network.',
    keywords: ['strong password generator offline', 'csprng random password'],
    features: ['Uses hardware-backed Web Crypto CSPRNG', 'Adjustable length slider (8–64 chars)', '1-tap copy button', 'Guaranteed zero password logging'],
    howToSteps: ['Choose desired character length.', 'Click Generate New Password.', 'Copy cleanly to your clipboard or password manager.'],
    componentKey: 'password',
  },
  {
    slug: 'color-gradient-studio',
    title: 'CSS Color & Gradient Generator',
    category: 'Everyday Utilities',
    shortDesc: 'Pick HEX/RGB colors and copy linear-gradient CSS snippets.',
    seoDescription:
      'Preview dual-stop color palettes, inspect instant RGB conversions, and copy production-ready CSS `linear-gradient` code snippets for websites and UI mockups.',
    keywords: ['css gradient generator', 'hex to rgb color picker'],
    features: ['Live swatch preview card', 'Automatic HEX to RGB breakdown', '1-click Copy CSS linear-gradient rule', 'Ideal for frontend & Tailwind developers'],
    howToSteps: ['Pick Color A and Color B swatches.', 'Preview the live CSS gradient banner.', 'Click Copy CSS to paste straight into your stylesheet.'],
    componentKey: 'color',
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    category: 'Everyday Utilities',
    shortDesc: 'Pretty-print, minify, and syntax-check JSON payloads locally.',
    seoDescription:
      'Beautify nested JSON payloads with 2-space indentation, compress whitespace into single-line JSON, and catch syntax errors immediately inside private browser memory.',
    keywords: ['json formatter offline', 'validate pretty print json'],
    features: ['Beautify & Minify in one click', 'Exact syntax error message reporting', 'Runs privately on sensitive API tokens/data', 'Zero external telemetry'],
    howToSteps: ['Paste raw JSON data into the editor box.', 'Click Format Pretty or Minify.', 'Fix any reported syntax issues or copy the clean output.'],
    componentKey: 'json',
  },
  {
    slug: 'base64-url-encoder',
    title: 'Base64 & URL Encoder / Decoder',
    category: 'Everyday Utilities',
    shortDesc: 'Encode and decode UTF-8 text to Base64 or safe URLs.',
    seoDescription:
      'Convert plain strings, Unicode emojis, or query parameters safely to Base64 or percent-encoded URL formats and decode strings back instantaneously.',
    keywords: ['base64 encode decode utf8', 'url encoder online free'],
    features: ['UTF-8 safe Base64 encode & decode', 'URL component escape/unescape support', 'Instant bidirectional workflow', '100% browser-only execution'],
    howToSteps: ['Enter plain text or an encoded Base64 string.', 'Click Encode or Decode.', 'Copy the transformed result immediately.'],
    componentKey: 'base64',
  },
  {
    slug: 'pomodoro-focus-timer',
    title: 'Focus Pomodoro Timer',
    category: 'Everyday Utilities',
    shortDesc: '25-minute deep work timer & 5-minute break presets.',
    seoDescription:
      'Boost deep focus and study productivity with an uncomplicated Pomodoro countdown timer featuring 25-minute work sprints, 5-minute rest intervals, and zero distractions.',
    keywords: ['pomodoro timer 25 min online', 'free study focus timer'],
    features: ['25:00 Focus & 05:00 Break instant presets', 'Start, Pause, and Reset controls', 'Large high-contrast countdown display', 'No account or ads'],
    howToSteps: ['Choose 25-min Focus or 5-min Break mode.', 'Click Start Timer to begin your session.', 'Pause or reset anytime cleanly.'],
    componentKey: 'timer',
  },
  {
    slug: 'bmi-health-calculator',
    title: 'BMI & Healthy Weight Calculator',
    category: 'Everyday Utilities',
    shortDesc: 'Compute Body Mass Index & health zone instantaneously.',
    seoDescription:
      'Calculate accurate Body Mass Index (BMI) from height in centimeters and weight in kilograms with clear Underweight, Healthy Normal, Overweight, or Obese classifications.',
    keywords: ['bmi calculator cm kg', 'body mass index checker'],
    features: ['Metric cm & kg real-time inputs', 'WHO classification category badge', 'Completely private health input (stored locally)', 'Instant calculation'],
    howToSteps: ['Enter your height in cm and weight in kg.', 'Read your computed BMI score immediately.', 'Review your standard health bracket indicator.'],
    componentKey: 'bmi',
  },
  {
    slug: 'birthday-reminder',
    title: 'Birthday Countdown & Reminder Tracker',
    category: 'Everyday Utilities',
    shortDesc: 'Track upcoming birthdays & days remaining in local storage.',
    seoDescription:
      'Never miss important family or friend birthdays. Add names and birthdates to calculate exact upcoming countdown days automatically inside local browser storage.',
    keywords: ['birthday countdown tracker offline', 'upcoming birthday list'],
    features: ['Calculates exact days until next birthday', 'Shows upcoming turning age cleanly', 'Persists offline in browser localStorage', 'Zero social account linking'],
    howToSteps: ['Add a person’s name and date of birth.', 'Inspect sorted countdown days automatically.', 'Check back anytime without logging in.'],
    componentKey: 'birthday',
  },
  {
    slug: 'expense-checklist',
    title: 'Monthly Expense & Bill Tracker',
    category: 'Everyday Utilities',
    shortDesc: 'Track bills, paid status & total budget locally.',
    seoDescription:
      'Organize utility bills, rent, subscriptions, and daily spending with one-click Paid toggles and automatic Paid vs. Pending totals saved privately on your device.',
    keywords: ['simple expense tracker offline', 'monthly bill checklist'],
    features: ['Real-time Paid vs. Remaining summaries', 'Toggle status with 1 click', 'Category labels (Bills, Food, Utilities)', '100% private local persistence'],
    howToSteps: ['Enter expense title, category, and amount.', 'Click items to mark bills as paid or unpaid.', 'Monitor live spending totals effortlessly.'],
    componentKey: 'expense',
  },
  {
    slug: 'grocery-checklist',
    title: 'Smart Grocery & Shopping List',
    category: 'Everyday Utilities',
    shortDesc: 'Organize groceries by aisle with tap-to-check progress.',
    seoDescription:
      'Build tidy aisle-grouped grocery and household shopping lists (`Produce`, `Dairy`, `Bakery`, `Pantry`) with quantity tags and quick check-off tracking.',
    keywords: ['grocery checklist online free', 'aisle shopping list maker'],
    features: ['Aisle & quantity organization', 'Progress bar for completed items', 'Clear completed items in 1 click', 'Local browser memory persistence'],
    howToSteps: ['Type item name, quantity, and supermarket aisle.', 'Tap items while shopping to check them off.', 'Clear checked entries before your next trip.'],
    componentKey: 'grocery',
  },

  // Privacy & Security
  {
    slug: 'privacy-ip-inspector',
    title: 'Browser Privacy & Public IP Inspector',
    category: 'Privacy & Security',
    shortDesc: 'Check HTTPS security, timezone, screen & public IP exposure.',
    seoDescription:
      'Inspect what network and browser fingerprinting signals your current session exposes—including HTTPS protocol status, system timezone, CPU threads, and optional public IP lookup.',
    keywords: ['check browser privacy fingerprint', 'what is my ip tool'],
    features: ['Reads HTTPS, timezone, viewport & platform info locally', 'On-demand public IP check button', 'Zero automatic background tracking', 'Helpful security audit baseline'],
    howToSteps: ['Open the inspector card to view local browser telemetry.', 'Optionally click Check Public IP to test network egress.', 'Audit timezone and hardware exposure signals cleanly.'],
    componentKey: 'vpn_inspector',
  },
  {
    slug: 'wireguard-config-generator',
    title: 'WireGuard Keypair & Config Generator',
    category: 'Privacy & Security',
    shortDesc: 'Generate X25519-clamped WireGuard keypairs & .conf files.',
    seoDescription:
      'Create fresh X25519 WireGuard private keys directly via browser `crypto.getRandomValues` alongside customizable endpoint `.conf` profiles ready for instant download.',
    keywords: ['wireguard key generator browser', 'generate wireguard conf offline'],
    features: ['Browser WebCrypto X25519 key generation', 'Downloadable standard `.conf` template', 'Supports custom DNS & AllowedIPs', 'Zero server-side key retention'],
    howToSteps: ['Click Regenerate Keys to create fresh private/public keys.', 'Fill in endpoint host, port, and DNS servers.', 'Download your `.conf` file for WireGuard clients.'],
    componentKey: 'vpn_wireguard',
  },
  {
    slug: 'dns-latency-benchmark',
    title: 'Encrypted DNS Latency Benchmark',
    category: 'Privacy & Security',
    shortDesc: 'Compare Cloudflare 1.1.1.1, Google 8.8.8.8 & Quad9 DoH speeds.',
    seoDescription:
      'Measure real-time DNS-over-HTTPS (DoH) lookup round-trip times right from your current internet connection across Cloudflare, Google Public DNS, and Quad9 resolvers.',
    keywords: ['dns speed test browser', 'cloudflare vs google dns latency'],
    features: ['Live browser fetch timing benchmark', 'Compares Cloudflare, Google & Quad9 DoH endpoints', 'Finds lowest-latency resolver for your ISP', '1-click re-benchmark'],
    howToSteps: ['Click Run Live DNS Benchmark.', 'Wait ~1 second while DoH test pings complete.', 'Compare millisecond latencies across top resolvers.'],
    componentKey: 'vpn_dns',
  },
  {
    slug: 'url-tracker-stripper',
    title: 'URL Tracker & UTM Cleaner',
    category: 'Privacy & Security',
    shortDesc: 'Strip utm_*, fbclid, gclid & referral spy parameters from links.',
    seoDescription:
      'Paste messy marketing or social share URLs and strip tracking tags (`utm_source`, `fbclid`, `gclid`, `mc_cid`, `ref`) automatically before sharing links privately.',
    keywords: ['remove utm tracking from url', 'clean fbclid link tool'],
    features: ['Removes UTM, Facebook, Google, and Mailchimp tags', 'Lists every stripped tracking parameter', '1-tap copy cleaned canonical URL', 'Preserves legitimate query parameters'],
    howToSteps: ['Paste any tracked link into the input bar.', 'Click Strip Trackers.', 'Copy the clean privacy-safe URL.'],
    componentKey: 'vpn_tracker',
  },

  // Playable Casual Web Games
  {
    slug: 'word-connect-game',
    title: 'Word Search & Connect Puzzle',
    category: 'Web Games',
    shortDesc: 'Interactive letter-wheel puzzle to discover hidden words.',
    seoDescription:
      'Play our relaxing offline Word Connect puzzle directly in your browser. Click letter tiles to spell valid words across progressively challenging stages with zero ads.',
    keywords: ['word connect game online free', 'browser word puzzle no ads'],
    features: ['Multi-level anagram letter boards', 'Smooth instant tile selection & shuffle', 'Works completely offline in browser', 'Zero pop-up ads or timers'],
    howToSteps: ['Tap or click letter tiles in sequence to form a word.', 'Discover every target word to advance to the next puzzle.', 'Use Shuffle anytime to spark fresh combinations.'],
    componentKey: 'game_word',
  },
  {
    slug: 'liquid-color-sort-game',
    title: 'Liquid Color Sort Brain Puzzle',
    category: 'Web Games',
    shortDesc: 'Sort colorful liquid layers into matching bottles.',
    seoDescription:
      'Challenge your logic skills with Liquid Color Sort—transfer matching top colors cleanly between glass tubes until every bottle holds a single pure hue.',
    keywords: ['water sort puzzle online free', 'color sort game browser'],
    features: ['Clean animated bottle pouring rules', 'Undo & New Level reset controls', 'Win celebration detector', 'Runs silently with zero trackers'],
    howToSteps: ['Click a source bottle, then click a matching destination bottle.', 'Only same-colored top layers can stack onto non-full bottles.', 'Group every solid color into its own bottle to win.'],
    componentKey: 'game_sort',
  },
  {
    slug: 'music-studio-game',
    title: 'Web Piano, Guitar & Drum Pad Studio',
    category: 'Web Games',
    shortDesc: 'Play real Web Audio API piano keys, guitar chords & drums.',
    seoDescription:
      'Jam live in your browser using synthesized Web Audio API instruments—play chromatic piano octaves, strum chords, or tap responsive bass/snare/hi-hat drum pads with zero downloads.',
    keywords: ['online virtual piano web audio', 'browser drum pad synthesizer'],
    features: ['Zero-latency Web Audio API sound synthesis', 'Interactive Piano Keys + Guitar Chords + Drum Kit', 'Works without external MP3 asset downloads', 'Great for quick ear training or fun beats'],
    howToSteps: ['Choose Piano, Guitar, or Drum Pad tabs.', 'Click keys, chords, or drum pads directly with mouse or touch.', 'Layer rhythms and melodies live!'],
    componentKey: 'game_music',
  },

  // Knife PDF-Inspired Image, Developer & Finance Tools
  {
    slug: 'image-compressor',
    title: 'Image Compressor (JPG / WebP)',
    category: 'Creator & Media',
    shortDesc: 'Shrink photo sizes locally with adjustable quality slider.',
    seoDescription:
      'Compress large PNG, JPG, and WebP photos in browser memory with real-time quality adjustment, exact Before/After KB savings readout, and zero server uploads.',
    keywords: ['compress image online free offline', 'reduce jpg size kb browser'],
    features: ['Adjustable compression quality slider (10%–95%)', 'Live KB & % size savings readout', 'Supports JPEG & WebP export', '100% browser Canvas privacy'],
    howToSteps: ['Upload any JPG, PNG, or WebP image.', 'Adjust target quality slider and output format.', 'Click Download Compressed Image immediately.'],
    componentKey: 'img_compress',
  },
  {
    slug: 'image-converter',
    title: 'Image & SVG Format Converter',
    category: 'Creator & Media',
    shortDesc: 'Convert PNG, JPG, WebP & SVG cleanly at 1x/2x/3x scale.',
    seoDescription:
      'Convert images effortlessly between PNG, JPEG, and WebP formats—plus rasterize vector SVG artwork into crisp high-DPI PNG assets directly in your browser.',
    keywords: ['svg to png high dpi online', 'webp to jpg png converter offline'],
    features: ['PNG ↔ JPG ↔ WebP & SVG rasterizer', '1x, 2x, and 3x resolution multiplier', 'Handles transparent alpha backgrounds cleanly', 'Zero external image hosting'],
    howToSteps: ['Drop in a PNG, JPG, WebP, or SVG file.', 'Select desired output format and resolution multiplier.', 'Download your converted file immediately.'],
    componentKey: 'img_convert',
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer & Dimension Scaler',
    category: 'Creator & Media',
    shortDesc: 'Resize images to exact pixel dimensions with aspect lock.',
    seoDescription:
      'Scale photos to exact pixel widths and heights or quick social presets while optionally locking original aspect ratio cleanly in browser Canvas RAM.',
    keywords: ['resize image pixels online free', 'bulk photo dimension changer'],
    features: ['Custom Width & Height inputs with Aspect Ratio Lock', 'Quick presets (1080px Square, 1920px HD, 512px Icon)', 'Real-time scaled preview', 'Lossless PNG or crisp JPEG download'],
    howToSteps: ['Upload any image from your device.', 'Set desired Width & Height or tap a quick preset.', 'Download your newly resized image instantly.'],
    componentKey: 'img_resize',
  },
  {
    slug: 'image-strip-metadata',
    title: 'Photo EXIF Metadata Stripper',
    category: 'Privacy & Security',
    shortDesc: 'Scrub hidden GPS location & camera EXIF data before sharing.',
    seoDescription:
      'Strip sensitive GPS coordinates, smartphone camera serial numbers, timestamps, and EXIF metadata from photos by cleanly re-rendering pixel buffers in Canvas RAM.',
    keywords: ['remove exif gps from photo online', 'strip image metadata privacy'],
    features: ['Wipes all EXIF, IPTC, XMP & GPS tags permanently', 'Preserves full visual resolution cleanly', 'Essential before posting photos publicly', 'Runs 100% offline'],
    howToSteps: ['Select a smartphone photo to sanitize.', 'Click Strip EXIF & Download Clean Image.', 'Share the metadata-free PNG/JPG safely.'],
    componentKey: 'img_strip',
  },
  {
    slug: 'image-palette-extractor',
    title: 'Image Color & Palette Extractor',
    category: 'Creator & Media',
    shortDesc: 'Click any pixel for HEX/RGB & extract dominant swatches.',
    seoDescription:
      'Inspect exact pixel HEX and RGB color values directly on uploaded images and extract dominant aesthetic color palettes with 1-tap clipboard copy for UI & graphic design.',
    keywords: ['image color picker hex online', 'extract color palette from photo'],
    features: ['Click anywhere on canvas to sample exact pixel color', 'Auto-extracts top dominant color swatches', '1-click HEX code clipboard copy', 'Zero external uploads'],
    howToSteps: ['Upload an artwork or UI screenshot.', 'Click any spot on the image or inspect extracted palette swatches.', 'Tap any HEX badge to copy to clipboard.'],
    componentKey: 'img_palette',
  },
  {
    slug: 'word-counter-case',
    title: 'Word Counter & Text Case Converter',
    category: 'Everyday Utilities',
    shortDesc: 'Live word/char stats + UPPER, Title, camelCase & slug tool.',
    seoDescription:
      'Count words, characters, sentences, paragraphs, and estimated reading time in real time—plus transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and URL slugs.',
    keywords: ['word counter reading time free', 'case converter title camelcase'],
    features: ['Real-time word, char, sentence & reading-time metrics', '6 instant case transformers + URL slugify', '1-tap copy transformed output', 'Runs cleanly offline'],
    howToSteps: ['Paste or type text into the editor box.', 'Check instant word & character metrics above.', 'Click any Case button to transform and copy text.'],
    componentKey: 'word_case',
  },
  {
    slug: 'text-diff-compare',
    title: 'Text & Code Diff Compare Tool',
    category: 'Everyday Utilities',
    shortDesc: 'Compare two text blocks line-by-line to highlight edits.',
    seoDescription:
      'Spot added, removed, and changed lines between original and revised drafts, contracts, or config files instantaneously in browser memory.',
    keywords: ['compare two texts diff online', 'line by line text diff checker'],
    features: ['Side-by-side Original vs Revised editors', 'Color-coded + Added / - Removed line diff view', 'Shows exact change summary count', 'Safe for confidential code or legal drafts'],
    howToSteps: ['Paste Original text on the left and Revised text on the right.', 'Inspect highlighted Added and Removed lines below.', 'Verify changes cleanly without uploading files.'],
    componentKey: 'text_diff',
  },
  {
    slug: 'hash-uuid-generator',
    title: 'UUID v4 & SHA-256 Hash Generator',
    category: 'Everyday Utilities',
    shortDesc: 'Generate RFC 4122 UUIDs & SHA-1/256/512 WebCrypto hashes.',
    seoDescription:
      'Compute cryptographic SHA-1, SHA-256, SHA-384, and SHA-512 checksums using Web Crypto SubtleCrypto alongside bulk RFC 4122 v4 UUID generation cleanly in RAM.',
    keywords: ['sha256 hash generator online', 'bulk uuid v4 generator'],
    features: ['Real SubtleCrypto SHA-1, SHA-256 & SHA-512 digests', 'Bulk 1/5/10/25 UUID v4 generator', '1-click copy for hashes & UUID lists', '100% browser execution'],
    howToSteps: ['Type input text for hashing or choose UUID batch count.', 'Read real-time hexadecimal hashes below.', 'Copy any digest or UUID list cleanly.'],
    componentKey: 'hash_uuid',
  },
  {
    slug: 'finance-emi-sip-calculator',
    title: 'EMI, SIP & Discount Calculator',
    category: 'Everyday Utilities',
    shortDesc: 'Calculate monthly Loan EMIs, SIP wealth returns & discounts.',
    seoDescription:
      'Plan loans, investments, and shopping discounts accurately in seconds—covering monthly Loan EMI & interest totals, Mutual Fund SIP maturity projections, and % discount math.',
    keywords: ['loan emi calculator online', 'sip investment return calculator'],
    features: ['3 modes: Loan EMI, Mutual Fund SIP & Discount %', 'Real-time Principal vs Interest breakdown', 'Works cleanly offline with zero sign-up', 'Mobile-friendly sliders & inputs'],
    howToSteps: ['Pick Loan EMI, Investment SIP, or Discount mode.', 'Adjust amount, interest rate, and tenure.', 'Read monthly EMI, total interest, or maturity value immediately.'],
    componentKey: 'finance_calc',
  },
  {
    slug: 'age-date-calculator',
    title: 'Exact Age & Date Difference Calc',
    category: 'Everyday Utilities',
    shortDesc: 'Calculate exact Age (Y/M/D), weekday & days between dates.',
    seoDescription:
      'Find your exact age in years, months, and days, discover your birth weekday, count days until your next birthday, and measure exact durations between any two calendar dates.',
    keywords: ['exact age calculator dob', 'days between two dates calculator'],
    features: ['Exact Years, Months & Days age calculation', 'Shows next birthday countdown & birth weekday', 'Date-to-Date difference in days, weeks & months', 'Instant browser math'],
    howToSteps: ['Enter your Date of Birth or two calendar dates.', 'Inspect exact breakdown of years, months, and days.', 'Check weekday & upcoming birthday countdown.'],
    componentKey: 'age_date',
  },
];

export function getPdfToolBySlug(slug: string): PdfToolMeta | undefined {
  return ALL_PDF_TOOLS.find((t) => t.slug === slug);
}

export function getWebToolBySlug(slug: string): WebToolMeta | undefined {
  return ALL_WEB_TOOLS.find((t) => t.slug === slug);
}

export interface SeoToolShowcaseItem {
  name: string;
  category: string;
  description: string;
  href: string;
}

export const SUITE_SEO_DIRECTORY: SeoToolShowcaseItem[] = [
  {
    name: 'Publixa PDF Studio (34 Dedicated Tools)',
    category: 'PDF Workbench',
    description:
      'Merge, split, ZIP burst, crop, reverse, delete pages, rearrange, N-up imposition, electronic signature pad, highlighter, Bates numbering, redact, flatten forms, sanitize metadata, link/image extractors, dictation, CSV/JSON to PDF & scanner 100% locally in browser memory.',
    href: '/pdf',
  },
  {
    name: 'Publixa Docs (Word & Rich Text)',
    category: 'Document Suite',
    description:
      'Full Google Docs–style WYSIWYG document processor with left document tabs, automatic headings outline, inch ruler, bold/italic/underline, colors, highlights, tables, image insertion, and faithful export to PDF, DOCX, HTML, and TXT with zero sign-in.',
    href: '/docs',
  },
  {
    name: 'Publixa Sheets (Excel & Formulas)',
    category: 'Spreadsheet Suite',
    description:
      'Full Google Sheets–style spreadsheet editor supporting =SUM, =AVERAGE, =IF, =COUNT, currency/percent formats, cell colors, borders, column sorting, live bar/line charts, and styled PDF/XLSX/CSV/JSON exports without an account.',
    href: '/excel',
  },
  {
    name: 'Publixa Slides (PPT & Presentations)',
    category: 'Presentation Suite',
    description:
      'Create multi-slide presentations with filmstrip thumbnails, custom color themes, speaker notes, native bar chart slides, outline-to-slides generation, fullscreen slideshow presenter, and .PPTX or widescreen .PDF downloads.',
    href: '/slides',
  },
  {
    name: 'Stylish Name & Gaming Font Studio',
    category: 'Creator Tools',
    description:
      'Generate 24+ Unicode gaming fonts, decorative wings, crowns, clan tags, esports nicknames, and calibrated sensitivity profiles with 1-tap clipboard copy.',
    href: '/tools/stylish-name-generator',
  },
  {
    name: 'Passport Photo, QR, 4K Wallpaper & Utility Lab',
    category: 'Everyday Utilities',
    description:
      'Create 4x6" printable passport photo sheets, custom SVG/PNG QR codes (URL/Wi-Fi/UPI), 4K UHD wallpapers, Voice Calculator, JSON formatter, Pomodoro timer, and Privacy/WireGuard config tools.',
    href: '/tools',
  },
];

export const SUITE_FAQS = [
  {
    q: 'Does every Publixa PDF and Web tool have its own dedicated page?',
    a: 'Yes. All 34 PDF tools under /pdf/[tool] and all 42 Office, Image, Creator, Utility, Privacy, and Game tools under /tools/[tool] have dedicated pages with direct URLs, step-by-step instructions, and full descriptions.',
  },
  {
    q: 'Do Publixa PDF, Docs, Sheets, and Slides require an account or login?',
    a: 'No. Every tool on Publixa runs directly in your browser without registration, subscriptions, or cloud sign-in. Your open workbooks, documents, and presentations auto-save locally to your browser storage.',
  },
  {
    q: 'Are my confidential PDF, Word, or Excel files uploaded to a server?',
    a: 'Never. All 34 PDF utilities, Image tools, DOCX parsing, XLSX formula evaluation, and PPTX slide exports execute 100% client-side in your browser RAM using WebAssembly and modern Web APIs.',
  },
  {
    q: 'Can I edit downloaded documents and re-export them cleanly?',
    a: 'Yes. Edits made in Docs, Sheets, Slides, and PDF Studio are flushed immediately and preserved across PDF, DOCX, XLSX, PPTX, CSV, and HTML exports—including bold styles, currency formatting, colors, and custom headings.',
  },
];
