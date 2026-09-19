/* English translations for skillQuestionBank.js — keyed by the exact Arabic question text.
   Option ORDER mirrors the Arabic bank (index 0 stays the correct answer).
   Generic-template questions (built from generateGenericQuestions) are matched via GENERIC_TEMPLATES
   with the skill name substituted. */
const EN = {
  "ما وظيفة أداة Clone Stamp في فوتوشوب؟": { q: "What does the Clone Stamp tool do?", opts: ["Copies part of an image over another area","Crops the image","Draws shapes","Resizes the image"] },
  "ما هو الـ Layer في فوتوشوب؟": { q: "What is a layer in Photoshop?", opts: ["An independently editable plane that doesn't affect others","The image size","A type of filter","A save format"] },
  "ما وظيفة الـ Mask في فوتوشوب؟": { q: "What does a mask do in Photoshop?", opts: ["Non-destructively hides or reveals parts of a layer","Permanently deletes the layer","Zooms the image","Colors the layer"] },
  "أي صيغة لا تدعم الشفافية إطلاقًا؟": { q: "Which format does NOT support transparency at all?", opts: ["JPG","PNG","GIF","TIFF"] },
  "ما الفرق بين RGB و CMYK؟": { q: "What is the difference between RGB and CMYK?", opts: ["RGB is for screens, CMYK is for print","No difference","RGB is for print, CMYK is for screens","Both are print-only"] },
  "ما وظيفة أداة Pen Tool؟": { q: "What is the Pen tool for?", opts: ["Creating precise paths and selections","Quick coloring","Straight cuts only","Writing text"] },
  "ما هو الـ Smart Object؟": { q: "What is a Smart Object?", opts: ["A layer that preserves source content for non-destructive editing","A small image","A blur filter","A type of mask"] },
  "ما وظيفة أداة Healing Brush؟": { q: "What does the Healing Brush do?", opts: ["Removes blemishes by blending the surrounding pixels","Reshapes","Draws lines","Darkens edges"] },
  "ما قيمة الـ DPI المناسبة للطباعة؟": { q: "What DPI is standard for printing?", opts: ["300","72","96","1000"] },
  "ما وظيفة الـ Blend Mode؟": { q: "What does a blend mode do?", opts: ["Defines how a layer interacts with the layers below it","Merges files","Quick-saves","Rotates the image"] },
  "ما نوع الرسومات التي ينتجها Illustrator؟": { q: "What type of graphics does Illustrator produce?", opts: ["Vector graphics that scale without quality loss","Bitmap images","Videos","3D renders"] },
  "ما هو الـ Anchor Point؟": { q: "What is an anchor point?", opts: ["A point that defines a path's curve or corner","A palette color","A hidden layer","A cutting tool"] },
  "ما الفرق بين Fill و Stroke؟": { q: "What is the difference between fill and stroke?", opts: ["Fill colors the inside, stroke colors the outline","They are the same","Fill is the outline, stroke is the inside","Both are for shadows"] },
  "ما وظيفة الـ Pathfinder؟": { q: "What does the Pathfinder do?", opts: ["Combines, subtracts, and intersects shapes","Colors text","Exports files","Manages layers"] },
  "ما هو الـ Artboard؟": { q: "What is an artboard?", opts: ["An independent working canvas inside the file","A drawing tool","A type of brush","A separate file"] },
  "ما وظيفة أداة Blob Brush؟": { q: "What does the Blob Brush do?", opts: ["Draws freeform filled vector shapes","Erases precisely","Rotates","Writes"] },
  "ما هو الـ Swatch؟": { q: "What is a swatch?", opts: ["A saved color or gradient sample for reuse","A decorative line","A cutting tool","A ready template"] },
  "ما وظيفة Image Trace؟": { q: "What does Image Trace do?", opts: ["Converts raster images into vectors","Converts vectors into raster","Compresses the file","Auto-colors"] },
  "أي صيغة تصدير تحافظ على المتجهات؟": { q: "Which export format preserves vectors?", opts: ["SVG","JPG","PNG","GIF"] },
  "ما هو الـ Gradient Mesh؟": { q: "What is a gradient mesh?", opts: ["A grid for multi-color shading inside a single shape","An alignment grid","A background pattern","A measuring tool"] },
  "ما هو الـ Keyword Research؟": { q: "What is keyword research?", opts: ["Finding the words your target audience searches for","Buying ads","Writing long articles","Only analyzing competitors"] },
  "ما هو الـ Backlink؟": { q: "What is a backlink?", opts: ["A link from another site to yours that boosts search-engine trust","An internal link between your pages","A paid ad link only","A domain name"] },
  "ما الفرق بين On-page و Off-page SEO؟": { q: "What is the difference between on-page and off-page SEO?", opts: ["On-page is within the page (content and tags), off-page is external (links and reputation)","No difference","Both are code-only","Off-page is content-only"] },
  "ما هو الـ Meta Description؟": { q: "What is a meta description?", opts: ["A short summary shown under the title in search results","The page's main heading","An image tag","A robots file"] },
  "ما هو الـ Title Tag؟": { q: "What is a title tag?", opts: ["The page title shown in the browser tab and search results","An image description","The domain name","The page footer"] },
  "ما هو ملف robots.txt؟": { q: "What is robots.txt?", opts: ["A file directing search engines on what to crawl and exclude","A design tool","A security protocol","A sitemap"] },
  "ما هو الـ Sitemap؟": { q: "What is a sitemap?", opts: ["A file listing site pages to help search engines crawl them","A geographic map page","A design template","A performance report"] },
  "ما هو الـ SERP؟": { q: "What is SERP?", opts: ["The search engine results page","A statistics tool","The bounce rate","A crawling protocol"] },
  "ما هو Bounce Rate؟": { q: "What is bounce rate?", opts: ["The share of visitors who leave without interacting","The number of visits","Site speed","The word count"] },
  "ما هو الـ Local SEO؟": { q: "What is local SEO?", opts: ["Optimizing visibility in local results and maps","Language-only optimization","Paid local ads","Mobile-only optimization"] },
  "ما هو الـ CMS؟": { q: "What is a CMS?", opts: ["A system for creating and managing digital content without coding","A design program","A database","A web browser"] },
  "ما هو WordPress؟": { q: "What is WordPress?", opts: ["The most popular open-source content management system","A programming language","An image editor","A web host"] },
  "ما هو الـ Editorial Calendar؟": { q: "What is an editorial calendar?", opts: ["A schedule planning content publishing dates in advance","An article archive","A daily to-do list","A sales report"] },
  "ما هو الـ Workflow في إدارة المحتوى؟": { q: "What is a content workflow?", opts: ["The content's stages from idea to review and publishing","The internet grid","The design template","A measuring tool"] },
  "ما الفرق بين Draft و Published؟": { q: "What is the difference between draft and published?", opts: ["A draft is invisible to the public, published is live","No difference","A draft is public","Published is saved locally only"] },
  "ما هو الـ Content Audit؟": { q: "What is a content audit?", opts: ["A full review of existing content to evaluate and update it","Deleting content","Copying content","Translating content"] },
  "ما هو تتبع الإصدارات في المحتوى؟": { q: "What is version tracking for content?", opts: ["Recording edits with the ability to restore an earlier version","Encrypting content","Final archiving","Repeated publishing"] },
  "ما هي الـ Taxonomy في إدارة المحتوى؟": { q: "What is taxonomy in content management?", opts: ["Classifying content into organized categories and tags","A formatting tool","A page template","A privacy policy"] },
  "ما هي مكتبة الوسائط داخل أنظمة إدارة المحتوى؟": { q: "What is the media library in a CMS?", opts: ["A central store of images and files used across articles","A software library","An external gallery","A trash bin"] },
  "ما هو عنوان SEO في نظام إدارة المحتوى؟": { q: "What is an SEO title in a CMS?", opts: ["A search-optimized title separate from the internal heading","A random title","The file name","The image description"] },
  "ما هو مثلث التعريض الضوئي؟": { q: "What is the exposure triangle?", opts: ["ISO, aperture, and shutter speed","Light, shadow, and color","Zoom, focus, and capture","Lens, body, and tripod"] },
  "ما وظيفة الـ ISO في الكاميرا؟": { q: "What does ISO control?", opts: ["The sensor's light sensitivity","The shooting speed","Depth of field","White balance"] },
  "ماذا يحدث عند فتح فتحة العدسة (رقم f أصغر)؟": { q: "What happens with a wider aperture (smaller f-number)?", opts: ["More light enters and the background blurs more","Less light enters","Depth of field increases","Noise decreases"] },
  "ما هي قاعدة الأثلاث في التصوير؟": { q: "What is the rule of thirds in photography?", opts: ["Dividing the frame 3×3 and placing subjects on the intersections","Shooting in groups of three","3 shots of the same scene","Triple exposure"] },
  "ما هو صيغة RAW في التصوير؟": { q: "What is RAW in photography?", opts: ["A format keeping unprocessed sensor data for wider editing","A small image","A ready filter","A quick sharing format"] },
  "ما هو عمق الميدان (Depth of Field)؟": { q: "What is depth of field?", opts: ["The range of sharpness in front of and behind the focus point","The image width","The flash speed","The pixel count"] },
  "ما هي الساعة الذهبية في التصوير؟": { q: "What is the golden hour?", opts: ["Warm, soft natural light before sunset or after sunrise","The fastest shooting time","Peak crowd time","A golden filter"] },
  "ما هو توازن اللون الأبيض (White Balance)؟": { q: "What is white balance?", opts: ["Adjusting color tones so white looks truly white","Weight balancing","Night mode","Camera stabilization"] },
  "ما هو التكوين (Composition) في التصوير؟": { q: "What is composition in photography?", opts: ["Visually arranging the elements inside the frame","Post-processing the image","Choosing the camera","Saving photos"] },
  "ما مميزات عدسة 50mm الثابتة؟": { q: "What is the 50mm prime lens known for?", opts: ["Close to the human eye and excellent for affordable portraits","A macro lens","An ultra-wide lens","A telephoto lens"] },
  "ما هو الـ Timeline في المونتاج؟": { q: "What is the timeline in video editing?", opts: ["The strip where video and audio clips are arranged","The project list","The preview window","The effects library"] },
  "ما الفرق بين Cut و Transition؟": { q: "Cut vs transition?", opts: ["A cut switches directly between clips, a transition is an animated shift","They are the same","A cut is a flashy effect","A transition deletes a clip"] },
  "ما هو الـ Frame Rate؟": { q: "What is frame rate?", opts: ["The number of frames displayed per second","The video resolution","The file size","The video length"] },
  "ماذا نعني بدقة 4K؟": { q: "What does 4K mean?", opts: ["A resolution of about 3840×2160 pixels","4 shots","4 colors","4 minutes long"] },
  "ما هو الـ Color Grading؟": { q: "What is color grading?", opts: ["Adjusting video colors for a unified visual mood","Cutting the video","Adding text","Boosting audio"] },
  "ما هو الـ Keyframe؟": { q: "What is a keyframe?", opts: ["A frame marking the start or end of a change animated automatically between them","The story's main frame","The video's first frame","A corrupted frame"] },
  "ما الفرق بين Render و Export؟": { q: "Render vs export?", opts: ["Rendering processes and generates frames, exporting saves the final file","They are the same","Render saves and export processes","No difference"] },
  "ما هو الـ B-roll؟": { q: "What is B-roll?", opts: ["Supporting footage that backs up the main story","A bad clip","An in-video ad","The closing clip"] },
  "ما هو الـ J-Cut في المونتاج؟": { q: "What is a J-cut?", opts: ["Hearing the next scene's audio before its picture appears","A vertical cut","Speeding up a clip","Removing audio"] },
  "أي صيغة مناسبة للنشر على منصات الفيديو؟": { q: "Which format suits publishing on video platforms?", opts: ["MP4 (H.264)","BMP","WAV","SVG"] },
  "ما الفرق بين الترجمة الحرفية والترجمة المعنوية؟": { q: "Literal vs free translation?", opts: ["Literal transfers the words, free transfers the meaning and style","They are the same","Literal is for literary texts only","No difference"] },
  "ما هي أدوات CAT للمترجمين؟": { q: "What are CAT tools for translators?", opts: ["Software helping translators manage translations and term memories","A paper dictionary","A voice interpreter","A translation blog"] },
  "ما هي ذاكرة الترجمة (Translation Memory)؟": { q: "What is translation memory?", opts: ["A database storing past translations for reuse","The translator's personal memory","A file backup","A glossary only"] },
  "ما هو التوطين (Localization)؟": { q: "What is localization?", opts: ["Adapting content to a specific country's culture and market","Fast literal translation","Summarizing the text","Legal drafting"] },
  "ما هو النص المصدر (Source Text)؟": { q: "What is the source text?", opts: ["The original text to be translated","The translated text","The glossary","The project file"] },
  "ما الفرق بين الترجمة الشفهية والتحريرية؟": { q: "Interpretation vs written translation?", opts: ["Interpretation is live and spoken, written translation is crafted text","They are the same","Interpretation is written","Both are written"] },
  "ما هو معجم المصطلحات (Glossary) في الترجمة؟": { q: "What is a glossary in translation?", opts: ["A list of standardized terms for a project or client","A text summary","A style guide","An error log"] },
  "ماذا نعني بالنص الاصطلاحي (Idiomatic)؟": { q: "What is an idiomatic text?", opts: ["A text with expressions that cannot be translated literally and need cultural equivalents","A legal text","A technical text only","A poem"] },
  "ما هو التدقيق اللغوي (Proofreading)؟": { q: "What is proofreading?", opts: ["A final language review of the translation before delivery","Initial translation","Summarizing","A full rewrite"] },
  "ما هي ترجمة واجهات المستخدم (UI)؟": { q: "What is UI translation?", opts: ["Translating app interfaces with attention to space and context","Book translation","Film translation","Contract translation"] },

  // ─── JavaScript ───
  "ما هو الناتج من: typeof null في JavaScript؟": { q: "What is the output of: typeof null in JavaScript?", opts: ["object", "null", "undefined", "string"] },
  "أي طريقة تُستخدم لإضافة عنصر في نهاية مصفوفة؟": { q: "Which method adds an element to the end of an array?", opts: ["push()", "pop()", "shift()", "splice()"] },
  "ما الفرق بين == و ===؟": { q: "What is the difference between == and ===?", opts: ["=== compares both value and type", "== is faster", "No difference", "=== is slower"] },
  "ما هو الناتج من: 0.1 + 0.2 === 0.3؟": { q: "What is the output of: 0.1 + 0.2 === 0.3?", opts: ["false", "true", "undefined", "error"] },
  "أي من الآتي يُعتبر falsy في JavaScript؟": { q: "Which of the following is falsy in JavaScript?", opts: ["0", "[]", "{}", "\"false\""] },
  "ما الكلمة المفتاحية لتعريف متغير لا يمكن إعادة تعيينه؟": { q: "Which keyword declares a variable that cannot be reassigned?", opts: ["const", "let", "var", "static"] },
  "ما هو Arrow Function؟": { q: "What is an arrow function?", opts: ["A shorter function syntax without its own this", "A faster function", "A type of variable", "A compact class"] },
  "ما الناتج من: [1,2,3].map(x => x*2)؟": { q: "What is the output of: [1,2,3].map(x => x*2)?", opts: ["[2,4,6]", "[1,2,3]", "[3,4,5]", "6"] },
  "ما هو Promise في JavaScript؟": { q: "What is a Promise in JavaScript?", opts: ["An object representing the result of an async operation", "A type of variable", "A special function", "A custom array"] },
  "أي طريقة تُحوّل JSON string إلى object؟": { q: "Which method converts a JSON string into an object?", opts: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"] },

  // ─── Python ───
  "ما هو الناتج من: type([]) في Python؟": { q: "What is the output of: type([]) in Python?", opts: ["<class \"list\">", "<class \"array\">", "list", "array"] },
  "كيف تكتب تعليق في Python؟": { q: "How do you write a comment in Python?", opts: ["# comment", "// comment", "/* comment */", "-- comment"] },
  "ما هو الفرق بين list و tuple في Python؟": { q: "What is the difference between a list and a tuple in Python?", opts: ["A list is mutable, a tuple is not", "No difference", "A tuple is only faster", "A list is larger in size"] },
  "أي دالة تُستخدم لقراءة مدخل المستخدم؟": { q: "Which function reads user input?", opts: ["input()", "read()", "scan()", "get()"] },
  "ما معنى self في class بـ Python؟": { q: "What does self mean in a Python class?", opts: ["A reference to the current class instance", "A global variable", "The class name", "A special function"] },
  "أي طريقة تُضيف عنصر لقائمة؟": { q: "Which method adds an element to a list?", opts: ["append()", "add()", "insert()", "push()"] },
  "ما هو list comprehension؟": { q: "What is a list comprehension?", opts: ["A concise way to create lists", "A type of dictionary", "A regular loop", "A lambda function"] },
  "ما هو ناتج: len(\"Hello\")؟": { q: "What is the output of: len(\"Hello\")?", opts: ["5", "4", "6", "error"] },
  "كيف تستورد مكتبة في Python؟": { q: "How do you import a library in Python?", opts: ["import math", "include math", "use math", "require math"] },
  "ما هو decorator في Python؟": { q: "What is a decorator in Python?", opts: ["A function that modifies another function's behavior", "A variable type", "A user interface", "An external library"] },

  // ─── React ───
  "ما هو JSX في React؟": { q: "What is JSX in React?", opts: ["HTML-like syntax inside JavaScript", "A separate language", "A CSS library", "A file type"] },
  "ما هو useState hook؟": { q: "What is the useState hook?", opts: ["For managing component state", "For fetching data", "For page navigation", "For managing CSS"] },
  "متى يتم تشغيل useEffect مع مصفوفة فارغة []؟": { q: "When does useEffect run with an empty dependency array []?", opts: ["Once after mount only", "On every render", "Never", "On unmount"] },
  "ما هو الـ Virtual DOM؟": { q: "What is the Virtual DOM?", opts: ["A lightweight copy of the DOM that improves performance", "A type of CSS", "A database", "An external library"] },
  "كيف تمرر بيانات من مكوّن أب لابن؟": { q: "How do you pass data from a parent component to a child?", opts: ["Via props", "Via state", "Via context only", "It is impossible directly"] },
  "ما هو key في React Lists؟": { q: "What is a key in React lists?", opts: ["A unique ID per item that helps React track elements", "The item's color", "The item's order", "The item's size"] },
  "ما هو Context API؟": { q: "What is the Context API?", opts: ["For sharing data without props drilling", "For managing the router", "For API requests", "For styling CSS"] },
  "ما الفرق بين controlled وuncontrolled components؟": { q: "What is the difference between controlled and uncontrolled components?", opts: ["React controls the value of controlled components", "No difference", "Uncontrolled components are faster", "Controlled components use the DOM only"] },
  "ما هو React.memo؟": { q: "What is React.memo?", opts: ["Prevents a component from re-rendering when its props have not changed", "It saves to localStorage", "It speeds up the network", "A type of hook"] },
  "ما هو الـ Fragment في React؟": { q: "What is a Fragment in React?", opts: ["Lets you return multiple elements without an extra wrapper", "A type of state", "An external component", "A design pattern"] },

  // ─── HTML/CSS ───
  "ما الفرق بين id و class في CSS؟": { q: "What is the difference between id and class in CSS?", opts: ["id is unique to one element, class fits many", "No difference", "class is stronger", "id is slower"] },
  "ما هو CSS Flexbox؟": { q: "What is CSS Flexbox?", opts: ["A layout system for arranging items along one axis", "A type of color", "A separate language", "A framework"] },
  "ما وظيفة وسم <semantic> مثل article, section؟": { q: "What do semantic tags like article and section do?", opts: ["They improve SEO and accessibility", "They add automatic styling", "They speed up loading", "They switch the font"] },
  "ما هو CSS Grid؟": { q: "What is CSS Grid?", opts: ["A layout system for arranging items in rows and columns", "A type of image", "An external library", "An HTML tag"] },
  "ما وظيفة z-index في CSS؟": { q: "What does z-index do in CSS?", opts: ["Controls the stacking order of elements on top of each other", "Sets the size", "Changes the color", "Moves elements"] },
  "ما هو Box Model في CSS؟": { q: "What is the CSS Box Model?", opts: ["margin + border + padding + content", "A type of element", "A design pattern", "A CSS engine"] },
  "ما هو media query؟": { q: "What is a media query?", opts: ["Applies CSS based on the screen size", "A type of image", "A JavaScript function", "A type of color"] },
  "ما الفرق بين display:block وdisplay:inline؟": { q: "What is the difference between display:block and display:inline?", opts: ["block takes a full line, inline does not", "No difference", "inline is faster", "block is bigger"] },
  "ما هو position:absolute في CSS؟": { q: "What does position:absolute do in CSS?", opts: ["Positions the element relative to its nearest positioned ancestor", "Always fixes the element in place", "Hides the element", "Moves the element automatically"] },
  "ما وظيفة CSS transition؟": { q: "What does a CSS transition do?", opts: ["Adds a smooth effect when a CSS property changes", "Moves the element continuously", "A type of animation", "Changes the font"] },

  // ─── UI/UX Design ───
  "ما هو مبدأ \"Fitts Law\" في UI؟": { q: "What is Fitts's Law in UI?", opts: ["Larger and closer targets are easier to reach", "Users read from the left", "Colors affect emotions", "Design must be simple"] },
  "ما هو Wireframe؟": { q: "What is a wireframe?", opts: ["A low-detail sketch that defines the structure", "A type of color", "A high-quality image", "A Figma file"] },
  "ما هو الفرق بين UX وUI؟": { q: "What is the difference between UX and UI?", opts: ["UX is the overall user experience, UI is the visual interface", "No difference", "UI is broader than UX", "UX is about code"] },
  "ما هي قاعدة الثلاثة في التصميم؟": { q: "What is the rule of thirds in design?", opts: ["Dividing the screen into a 3×3 grid to place elements attractively", "Using only 3 colors", "3 seconds to grab attention", "No rule by that name exists"] },
  "ما هو contrast في التصميم؟": { q: "What is contrast in design?", opts: ["A clear difference between two elements that makes reading easier", "A type of shape", "A design style", "A Figma feature"] },
  "ما هو User Persona؟": { q: "What is a user persona?", opts: ["A fictional character representing the target user", "Designing the home page", "A type of test", "A user database"] },
  "ما هو Usability Testing؟": { q: "What is usability testing?", opts: ["Testing the product with real users to discover problems", "Testing the code", "Checking colors", "Reviewing the design without users"] },
  "ما هو Gestalt Principle: Proximity؟": { q: "What is the Gestalt principle of proximity?", opts: ["Elements placed close together appear as one group", "Similar colors are associated", "Moving elements grab attention", "Simple design is better"] },
  "ما هو F-Pattern في قراءة المستخدمين للشاشة؟": { q: "What is the F-pattern in how users read a screen?", opts: ["The user reads in an F shape starting from the top", "The user reads everything equally", "The user focuses on the center", "The user starts from the bottom of the screen"] },
  "ما هي مرحلة Prototype في Design Thinking؟": { q: "What is the prototype stage in Design Thinking?", opts: ["Building a quick model to test and validate", "The final design", "The research stage", "Gathering requirements"] },

  // ─── التسويق الرقمي / Digital Marketing ───
  "ما هو الـ CTR في التسويق الرقمي؟": { q: "What is CTR in digital marketing?", opts: ["Click-through rate: clicks divided by impressions", "The ad cost", "The follower count", "The conversion rate"] },
  "ما هو الـ SEO؟": { q: "What is SEO?", opts: ["Search engine optimization to increase free visibility", "A type of paid advertising", "A social media platform", "A data analysis tool"] },
  "ما هو A/B Testing في التسويق؟": { q: "What is A/B testing in marketing?", opts: ["Testing two versions to see which performs better", "A type of ad", "A performance report", "An ad design pattern"] },
  "ما هو Customer Journey؟": { q: "What is the customer journey?", opts: ["The stages of a customer's interaction with a brand", "An employee's path inside the company", "A payment method", "A type of ad"] },
  "ما هو الـ Conversion Rate؟": { q: "What is the conversion rate?", opts: ["The share of visitors who complete a desired action", "The number of likes", "The content publishing rate", "The ad cost"] },
  "ما هو الـ Funnel في التسويق؟": { q: "What is a marketing funnel?", opts: ["The stages that turn a visitor into a customer", "A type of content", "Competitor analysis", "A design tool"] },
  "ما هو Remarketing؟": { q: "What is remarketing?", opts: ["Re-targeting people who previously visited your site with ads", "Email marketing", "Influencer marketing", "TV advertising"] },
  "ما الفرق بين Organic وPaid traffic؟": { q: "What is the difference between organic and paid traffic?", opts: ["Organic is free from search engines, paid comes from ads", "No quality difference", "Paid is always faster", "Organic is more expensive"] },
  "ما هو Email Marketing Automation؟": { q: "What is email marketing automation?", opts: ["Sending messages automatically based on user behavior", "Sending messages manually", "A type of ad", "An email template design tool"] },
  "ما هو الـ KPI في التسويق؟": { q: "What is a KPI in marketing?", opts: ["A key performance indicator for measuring success", "A type of content", "A marketing strategy", "The campaign budget"] },

  // ─── Excel ───
  "ما وظيفة دالة VLOOKUP؟": { q: "What does the VLOOKUP function do?", opts: ["Searches a column for a value and returns a value from another column", "Sums numbers", "Counts cells", "Finds the average"] },
  "ما هو PivotTable؟": { q: "What is a PivotTable?", opts: ["A tool to summarize and analyze data interactively", "A type of chart", "A calculation formula", "A type of table"] },
  "ما وظيفة دالة IF؟": { q: "What does the IF function do?", opts: ["Returns a value based on a given condition", "Sums numbers", "Transforms text", "Counts cells"] },
  "ما الفرق بين المرجع المطلق والنسبي في Excel؟": { q: "What is the difference between absolute and relative references in Excel?", opts: ["Absolute $A$1 stays fixed when copied, relative A1 changes", "No difference", "Relative is faster", "Absolute is bigger"] },
  "ما وظيفة دالة COUNTIF؟": { q: "What does the COUNTIF function do?", opts: ["Counts the cells that meet a given condition", "Sums with a condition", "Searches for a value", "Finds the largest value"] },
  "كيف تُجمّد صفاً أو عمواناً في Excel؟": { q: "How do you freeze a row or column in Excel?", opts: ["View > Freeze Panes", "Format > Freeze", "Insert > Lock", "Data > Pin"] },
  "ما وظيفة دالة INDEX MATCH؟": { q: "What does the INDEX MATCH function do?", opts: ["A more powerful VLOOKUP alternative that searches in any direction", "Sums values", "Formats cells", "Draws a chart"] },
  "ما هو Conditional Formatting؟": { q: "What is conditional formatting?", opts: ["Automatically formats cells based on their value", "A type of chart", "A calculation function", "A printing feature"] },
  "ما هو Data Validation في Excel؟": { q: "What is data validation in Excel?", opts: ["Restricts the type of data entered into a cell", "Validating formulas", "Sorting data", "Filtering data"] },
  "ما وظيفة دالة SUMIFS؟": { q: "What does the SUMIFS function do?", opts: ["Sums values that meet multiple conditions at once", "Sums all values", "Counts with a condition", "Searches with a condition"] },

  // ─── كتابة المحتوى / Content Writing ───
  "ما هو الـ Hook في كتابة المحتوى؟": { q: "What is a hook in content writing?", opts: ["The opening sentence that grabs the reader", "The conclusion", "The article title", "An illustration"] },
  "ما هو الـ CTA في المحتوى؟": { q: "What is a CTA in content?", opts: ["A call to action that prompts the reader to act", "A writing style", "An article section", "A formatting rule"] },
  "ما هو مفهوم Storytelling في المحتوى؟": { q: "What is storytelling in content?", opts: ["Narrating a story to deliver the message in an engaging, human way", "Writing fiction", "A type of ad", "An academic style"] },
  "ما هو الـ Tone of Voice؟": { q: "What is tone of voice?", opts: ["The style and personality reflected in the writing", "The font size", "The article length", "The content type"] },
  "ما هو SEO Writing؟": { q: "What is SEO writing?", opts: ["Writing content optimized for search engines", "Fast writing", "Writing paid ads", "Creative writing"] },
  "ما هي قاعدة AIDA في الكتابة؟": { q: "What is the AIDA rule in writing?", opts: ["Attention, Interest, Desire, Action", "A paragraph organization style", "A type of content", "An analysis tool"] },
  "ما هو Long-form content؟": { q: "What is long-form content?", opts: ["Content over 1,500 words that provides deep value", "Writing novels", "A type of ad", "Video content"] },
  "لماذا تُهم Headings H1,H2,H3 في المقالات؟": { q: "Why do H1, H2, H3 headings matter in articles?", opts: ["They improve SEO and make reading and scanning easier", "They only add styling", "They lengthen the article", "They reduce the word count"] },
  "ما هو الـ Content Calendar؟": { q: "What is a content calendar?", opts: ["A schedule for organizing and publishing content", "A type of content", "A design tool", "A performance report"] },
  "ما أهمية Evergreen Content؟": { q: "Why does evergreen content matter?", opts: ["It stays relevant and keeps its value over time", "Content about nature", "Seasonal content", "Continuous ads"] },

  // ─── Node.js ───
  "ما هو Node.js؟": { q: "What is Node.js?", opts: ["A JavaScript runtime environment for the server", "A front-end framework", "A database", "A new programming language"] },
  "ما هو npm؟": { q: "What is npm?", opts: ["The Node.js package manager", "A file type", "A testing tool", "A database"] },
  "ما هو Express.js؟": { q: "What is Express.js?", opts: ["A lightweight framework for building APIs with Node.js", "A type of database", "A testing tool", "A CSS library"] },
  "ما هو Event Loop في Node.js؟": { q: "What is the event loop in Node.js?", opts: ["The mechanism that handles asynchronous operations", "A regular for loop", "A type of event", "An external library"] },
  "ما هو الفرق بين require وimport؟": { q: "What is the difference between require and import?", opts: ["require is for CommonJS, import is for ES Modules", "No difference", "import is newer but slower", "require is always faster"] },
  "ما هو Middleware في Express؟": { q: "What is middleware in Express?", opts: ["A function that processes the request before it reaches the route", "A type of database", "The front-end layer", "A type of test"] },
  "ما هو dotenv؟": { q: "What is dotenv?", opts: ["A library that loads environment variables from a .env file", "A type of database", "A testing tool", "A framework"] },
  "ما هو الـ Callback في Node.js؟": { q: "What is a callback in Node.js?", opts: ["A function executed after an asynchronous operation finishes", "A loop", "A variable type", "An external library"] },
  "ما هو process.env؟": { q: "What is process.env?", opts: ["An object holding the current environment variables", "A file type", "A debug tool", "A built-in function"] },
  "ما وظيفة fs module في Node.js؟": { q: "What does the fs module do in Node.js?", opts: ["Works with the file system (reading and writing)", "Manages networking", "Creates APIs", "Manages databases"] },

  // ─── Figma ───
  "ما هو Auto Layout في Figma؟": { q: "What is Auto Layout in Figma?", opts: ["A feature that arranges elements automatically, like Flexbox", "A type of component", "A drawing tool", "A printing feature"] },
  "ما هو الفرق بين Frame وGroup في Figma؟": { q: "What is the difference between a Frame and a Group in Figma?", opts: ["A Frame has layout and clipping properties, a Group merely groups items", "No difference", "Groups are more powerful", "Frames are slower"] },
  "ما هو Component في Figma؟": { q: "What is a component in Figma?", opts: ["A reusable element with a master and instances", "A type of layer", "An export tool", "A Figma file"] },
  "ما هو Variant في Figma Components؟": { q: "What is a variant in Figma components?", opts: ["Different versions of the same component in one file", "The file version", "An animation property", "A color type"] },
  "ما هو Prototype mode في Figma؟": { q: "What is prototype mode in Figma?", opts: ["For building interactions and transitions between screens", "Design mode", "Export mode", "Comment mode"] },
  "ما هو Design Token؟": { q: "What is a design token?", opts: ["Design variables such as colors and fonts defined in one place", "A type of component", "An export tool", "A Figma-only feature"] },
  "ما هو Boolean Operation في Figma؟": { q: "What is a boolean operation in Figma?", opts: ["Combining or subtracting geometric shapes from one another", "A type of prototype", "An Auto Layout property", "A color type"] },
  "ما هو Handoff في Figma؟": { q: "What is handoff in Figma?", opts: ["Delivering the design to developers with CSS specifications", "Exporting the file", "Sharing the design with the client", "A backup"] },
  "ما هو Cover Art في Figma File؟": { q: "What is cover art in a Figma file?", opts: ["The thumbnail that represents the file in the list", "A type of export", "A special layer", "The first page"] },
  "ما هو Section في Figma؟": { q: "What is a section in Figma?", opts: ["A container that organizes frames and pages", "A type of frame", "A prototype tool", "A collaboration feature"] },

  // ─── إدارة المشاريع / Project Management ───
  "ما هو منهج Agile؟": { q: "What is the Agile methodology?", opts: ["A flexible framework based on iteration and continuous delivery", "Traditional paper-based management", "Fixed long-term planning", "A type of software"] },
  "ما هو Sprint في Scrum؟": { q: "What is a sprint in Scrum?", opts: ["A short work cycle (1-4 weeks) to complete specific tasks", "A daily meeting", "A requirements document", "A type of report"] },
  "ما هو Critical Path في إدارة المشاريع؟": { q: "What is the critical path in project management?", opts: ["The longest task sequence that determines the project's minimum duration", "The hardest tasks", "The urgent tasks", "The critical budget"] },
  "ما هو Kanban Board؟": { q: "What is a Kanban board?", opts: ["A visual board for tracking tasks and workflow", "A type of report", "A calculation tool", "A financial management method"] },
  "ما هو الـ Stakeholder؟": { q: "What is a stakeholder?", opts: ["Any party with an interest or influence in the project", "Only a team member", "Only the client", "The direct manager"] },
  "ما هو Risk Register؟": { q: "What is a risk register?", opts: ["A log for identifying, assessing, and managing project risks", "A daily report", "A task list", "The project budget"] },
  "ما هو WBS (Work Breakdown Structure)؟": { q: "What is a WBS (Work Breakdown Structure)?", opts: ["Breaking the project down into smaller, more manageable tasks", "A type of chart", "A team meeting", "A contract document"] },
  "ما هو الفرق بين Milestone وDeliverable؟": { q: "What is the difference between a milestone and a deliverable?", opts: ["A milestone is a checkpoint, a deliverable is a tangible output", "No difference", "A deliverable is always more important", "A milestone is a common mistake"] },
  "ما هو Daily Standup في Scrum؟": { q: "What is a daily standup in Scrum?", opts: ["A short daily meeting (15 minutes) to discuss progress and blockers", "A long weekly meeting", "A written daily report", "A code review"] },
  "ما هو مثلث القيود في إدارة المشاريع؟": { q: "What is the triple constraint in project management?", opts: ["Time, cost, and quality (scope)", "Team, client, and budget", "Time, risk, and quality", "No such concept exists"] },
};

/* Templates for generateGenericQuestions() — {skill} is replaced with the skill name. */
const GENERIC_TEMPLATES = [
  { ar: "ما هو تعريف {skill}؟", q: "What is {skill}?", opts: ["A field covering specialized skills and tools", "A programming language", "A design tool", "A mobile app"] },
  { ar: "من يحتاج لتعلم {skill}؟", q: "Who needs to learn {skill}?", opts: ["Anyone who wants to advance their career", "Only programmers", "Only designers", "Only managers"] },
  { ar: "ما أبرز مميزات {skill}؟", q: "What are the main advantages of {skill}?", opts: ["It boosts productivity and opens up new job opportunities", "It is hard to learn", "It is useless", "It is old and unused"] },
  { ar: "كم من الوقت يلزم لإتقان {skill}؟", q: "How long does it take to master {skill}?", opts: ["It depends on effort and practice", "Always 10 years", "Only 3 days", "It is impossible to master"] },
  { ar: "ما أفضل طريقة لتعلم {skill}؟", q: "What is the best way to learn {skill}?", opts: ["Continuous practice and real projects", "Reading only", "Watching videos only", "Theoretical study"] },
  { ar: "ما علاقة {skill} بسوق العمل؟", q: "How does {skill} relate to the job market?", opts: ["It is in high demand in the modern job market", "There is no demand for it", "It is in demand in one country only", "It was only in demand in the past"] },
  { ar: "ما أداة مشهورة في مجال {skill}؟", q: "What is a well-known tool in the {skill} field?", opts: ["There are many specialized tools and programs", "No tools exist", "It is done manually only", "Secret, unavailable tools"] },
  { ar: "هل يمكن تعلم {skill} أونلاين؟", q: "Can {skill} be learned online?", opts: ["Yes, there are many free and paid resources and courses", "No, only in a classroom", "Yes, but with very low quality", "Online is always worse"] },
  { ar: "ما قيمة شهادة في {skill}؟", q: "What is the value of a certificate in {skill}?", opts: ["It strengthens your CV and proves competence", "It has no value", "It is sufficient without practice", "It is required for every job"] },
  { ar: "ما نصيحتك لمبتدئ في {skill}؟", q: "What is your advice for a {skill} beginner?", opts: ["Start with the basics, build small projects, and level up", "Read everything before practicing", "Avoid it and move on to something else", "Wait until you find the perfect time"] },
];

function translateQuestion(arabicQuestion, skill) {
  if (!arabicQuestion || typeof arabicQuestion !== "string") return null;
  const exact = EN[arabicQuestion];
  if (exact) return { q: exact.q, opts: [...exact.opts] };
  if (skill) {
    for (const t of GENERIC_TEMPLATES) {
      if (t.ar.replace("{skill}", skill) === arabicQuestion) {
        return { q: t.q.replace(/\{skill\}/g, skill), opts: t.opts.map((o) => o) };
      }
    }
  }
  return null;
}

module.exports = { translateQuestion };
