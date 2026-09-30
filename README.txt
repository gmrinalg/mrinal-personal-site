Mrinal Gautam - website (first draft)

index.html
  The complete site in ONE file (styles, scripts and photo built in).
  Double-click to open it, or upload it as-is to any host
  (Netlify Drop, GitHub Pages, Vercel, etc.).

editable-version/
  The same site split into index.html + styles.css + script.js + img/.
  Easier to edit. Keep all files together in the same folder.

CAL.COM BOOKING (already connected to cal.com/mrinalgautam)
  Open script.js (or search the single-file index.html for  calLink: "" )
  and put Mrinal's Cal.com username between the quotes, e.g.
      calLink: "mrinal-gautam",
  or a single event:
      calLink: "mrinal-gautam/intro-call",
  Every "Book a session" button then opens his Cal.com calendar in a popup.

CONTACT FORM
  Put a Formspree link in  formEndpoint: ""  so messages reach him.

Also replace: placeholder testimonials, Instagram/LinkedIn links,
and the hello@example.com email address.
