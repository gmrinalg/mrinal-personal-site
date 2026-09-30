/* =========================================================
   Mrinal Gautam: interactions
   ========================================================= */

// ---- Settings: fill these in to go live ----------------------------
const CONFIG = {
  // Cal.com: your username, or username/event-slug, exactly as it appears after
  // "cal.com/" in your booking link. e.g. "mrinal-gautam" shows all event types,
  // "mrinal-gautam/intro-call" opens one event directly.
  // When set, every "Book a session" button opens Cal.com's booking popup.
  calLink: "mrinalgautam",
  // Alternative: any other booking-page link (Calendly etc.) to embed in the booking modal.
  // Leave both empty to use the built-in demo calendar.
  bookingUrl: "",
  // A form endpoint (e.g. https://formspree.io/f/xxxx) to receive "Connect" messages.
  // Leave empty and messages are only shown as sent (not delivered anywhere).
  formEndpoint: "",
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- nav ---------- */
const nav = $("#nav");
const navLinks = $("#navLinks");
const navToggle = $("#navToggle");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a, button")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

/* ---------- toast ---------- */
const toastEl = $("#toast");
let toastTimer;
function toast(html, ms = 5200) {
  toastEl.innerHTML = html;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), ms);
}

/* ---------- red nose easter egg ---------- */
const noseFacts = [
  "<b>You found the red nose!</b> In clowning it's called the smallest mask in the world. It hides almost nothing, and reveals a lot.",
  "<b>Boop again!</b> A clown doesn't hide their failure. They share it, and everyone feels a little less alone.",
  "<b>Okay, you're officially playful.</b> That's the whole point. Want to play more? The playground is below ↓",
];
let noseCount = 0;
$("#logoNose").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.remove("boop"); void btn.offsetWidth; btn.classList.add("boop");
  toast(noseFacts[noseCount % noseFacts.length]);
  noseCount++;
  if (!reduceMotion) rainNoses();
});
function rainNoses(n = 18) {
  for (let i = 0; i < n; i++) {
    const d = document.createElement("span");
    const size = 14 + Math.random() * 26;
    d.className = "falling-nose";
    Object.assign(d.style, {
      left: Math.random() * 100 + "vw",
      width: size + "px",
      height: size + "px",
      animationDuration: 2.2 + Math.random() * 2.2 + "s",
      animationDelay: Math.random() * 0.8 + "s",
    });
    document.body.appendChild(d);
    d.addEventListener("animationend", () => d.remove());
  }
}

/* ---------- hero buddy ---------- */
const buddy = $("#buddy");
const bubble = $("#buddyBubble");
const pupils = $$(".pupil", buddy);
const buddyLines = [
  "Boop! That's my nose. 🔴",
  "Whatever you're feeling right now is welcome here.",
  "You don't have to be interesting. You're already enough.",
  "Psst. Try breathing out a little longer than you breathe in.",
  "Being a little awkward usually means you're being real.",
  "Your inner critic can take a tea break. I've got this.",
  "Wanna play? The playground is just below ↓",
  "It's okay to go slowly. Really.",
];
let buddyIdx = 0;
buddy.addEventListener("click", () => {
  bubble.textContent = buddyLines[buddyIdx % buddyLines.length];
  buddyIdx++;
  bubble.classList.toggle("again");
  bubble.style.animation = "none"; void bubble.offsetWidth; bubble.style.animation = "";
  buddy.classList.remove("is-happy"); void buddy.offsetWidth; buddy.classList.add("is-happy");
  clearTimeout(buddy._t);
  buddy._t = setTimeout(() => buddy.classList.remove("is-happy"), 1600);
});

let eyeFrame;
window.addEventListener("pointermove", (e) => {
  if (eyeFrame) return;
  eyeFrame = requestAnimationFrame(() => {
    pupils.forEach((p) => {
      const r = p.parentElement.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const a = Math.atan2(e.clientY - cy, e.clientX - cx);
      const dist = Math.min(8, Math.hypot(e.clientX - cx, e.clientY - cy) / 30);
      p.style.transform = `translate(${Math.cos(a) * dist}px, ${Math.sin(a) * dist}px)`;
    });
    eyeFrame = null;
  });
}, { passive: true });

/* ---------- safety slider + bloom ---------- */
const petalsG = $("#petals");
const PETALS = 10;
const petalColors = ["#F4AE92", "#EE9277", "#F8C7B5", "#CDBDEB", "#F4AE92", "#E9A1C0"];
for (let i = 0; i < PETALS; i++) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  el.setAttribute("rx", "19"); el.setAttribute("ry", "34");
  el.setAttribute("fill", petalColors[i % petalColors.length]);
  petalsG.appendChild(el);
}
const safety = $("#safety");
const safetyRead = $("#safetyRead");
const bloomStage = $("#bloomStage");
const readings = [
  [20, "Guarded. Closed up. That's completely understandable. Your system is protecting you, and it's doing its job."],
  [40, "A little softer now. The breath deepens a touch. Something inside is checking whether it's okay."],
  [60, "Curiosity peeks out. Maybe the shoulders drop half an inch."],
  [80, "Warmth. Colour comes back. You might even feel like trying something new."],
  [101, "Play, expression and aliveness, unfolding on their own. Nobody forced it. It was there all along."],
];
function updateBloom() {
  const v = +safety.value, o = v / 100;
  bloomStage.style.setProperty("--o", o);
  $$("ellipse", petalsG).forEach((el, i) => {
    const angle = (360 / PETALS) * i;
    el.setAttribute("transform", `rotate(${angle}) translate(0 ${-(6 + 36 * o)}) scale(${0.25 + 0.75 * o})`);
  });
  $("#bud").style.opacity = Math.max(0, 1 - o * 2.2);
  $("#bloomCenter").setAttribute("r", 8 + 12 * o);
  $("#plant").style.transform = `rotate(${(1 - o) * -9}deg)`;
  $("#head").setAttribute("transform", `translate(150 190) rotate(${(1 - o) * 28})`);
  $("#leafL").style.transform = `rotate(${(1 - o) * 14}deg)`;
  $("#leafR").style.transform = `rotate(${(1 - o) * -14}deg)`;
  $("#leafL").style.transformOrigin = "150px 300px";
  $("#leafR").style.transformOrigin = "151px 268px";
  $("#sparks").classList.toggle("on", v >= 80);
  safetyRead.textContent = readings.find(([max]) => v < max)[1];
}
safety.addEventListener("input", updateBloom);
updateBloom();

/* ---------- influences ---------- */
const roots = {
  improv: "<strong>Transformational improv</strong> uses improvisation not to perform, but to grow. We practise saying “yes” to ourselves, to each other, and to whatever the moment brings.",
  meisner: "<strong>The Meisner technique</strong> is an acting practice built on truthful, moment-to-moment responding to another person. In other words, deep listening you can feel in your body.",
  clown: "<strong>Sacred clowning</strong> honours the clown as someone gloriously, openly vulnerable. The red nose is the smallest mask there is. It reveals far more than it hides.",
  navarasa: "<strong>The Navarasa</strong>, from Bharata's Natyashastra, names nine essential flavours of emotion: love, laughter, compassion, anger, courage, fear, disgust, wonder and peace. It's a map for feeling fully.",
  shaivism: "<strong>Kashmiri Shaivism</strong> is a non-dual tradition that sees consciousness itself as creative and playful, with life as a pulse (<em>spanda</em>) of aliveness to be recognised rather than earned.",
  design: "<strong>Design thinking</strong>, from training at the National Institute of Design, means crafting experiences with empathy, iteration and care, starting from what people actually need.",
  psych: "<strong>Psychology</strong> offers ways to understand the nervous system, inner parts and shame, so that play rests on real safety and not on pushing through.",
};
const rootDesc = $("#rootDesc");
$$("#rootChips .chip").forEach((chip) => {
  chip.setAttribute("aria-selected", "false");
  chip.addEventListener("click", () => {
    $$("#rootChips .chip").forEach((c) => c.setAttribute("aria-selected", String(c === chip)));
    rootDesc.style.opacity = 0;
    setTimeout(() => { rootDesc.innerHTML = roots[chip.dataset.root]; rootDesc.style.opacity = 1; }, 180);
  });
});

/* ---------- resonance ---------- */
const resItems = $$(".res-item");
const resText = $("#resText");
const resCta = $("#resCta");
function updateRes() {
  const n = resItems.filter((b) => b.getAttribute("aria-pressed") === "true").length;
  const msgs = [
    "Tap anything that feels true, or nothing at all. Both are okay.",
    "Thank you for noticing that. Naming it is already a small act of courage.",
    "Thank you for noticing that. Naming it is already a small act of courage.",
    "You're in good company. So many of us carry these quietly.",
    "You're in good company. So many of us carry these quietly.",
    "That's a lot to hold. You don't have to hold it alone.",
  ];
  resText.textContent = msgs[Math.min(n, msgs.length - 1)];
  resCta.hidden = n === 0;
}
resItems.forEach((b) => b.addEventListener("click", () => {
  b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
  updateRes();
}));
updateRes();

/* ---------- game tabs ---------- */
const tabs = $$(".game-tab");
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.classList.toggle("is-active", on);
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = $("#" + t.getAttribute("aria-controls"));
    panel.hidden = !on;
    panel.classList.toggle("is-active", on);
  });
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(next); next.focus();
  });
});

/* ---------- Game 1: Inner Weather ---------- */
const weather = {
  sunny: { t: "Lovely. Let it land.", m: "Notice where the brightness lives in your body. You don't have to do anything with it. Just let yourself have it.", p: "Tiny practice: smile at something ordinary for three seconds. Yes, even a chair." },
  cloudy: { t: "A bit of both. That's very human.", m: "Some parts of you feel light and some are carrying something. Both get to be here at the same time.", p: "Tiny practice: name one light thing and one heavy thing, without fixing either." },
  rain: { t: "Rain needs room, not repair.", m: "Sadness is often love with nowhere to go. You don't need to cheer up for me.", p: "Tiny practice: rest a hand on your chest and breathe out a little longer than you breathe in." },
  storm: { t: "Big weather. And you're still here.", m: "Anger, overwhelm and panic are often parts working very hard to protect you. They can be loud and still be welcome.", p: "Tiny practice: press your feet into the floor and feel something solid holding you up." },
  fog: { t: "Not knowing is a feeling too.", m: "Numbness or blur is often the system saying “this is a lot.” We can wait together until it lifts.", p: "Tiny practice: name five things you can see, slowly, like a very curious alien." },
  rainbow: { t: "Something has softened.", m: "After hard weather there's often a strange tenderness. Let yourself notice what made it through.", p: "Tiny practice: quietly thank one part of you that got you here." },
};
const sky = $("#weatherSky");
const skyFx = $("#skyFx");
const weatherMsg = $("#weatherMsg");
function drops(n) {
  return Array.from({ length: n }, () =>
    `<span class="drop" style="left:${Math.random() * 100}%;animation-duration:${0.6 + Math.random() * 0.6}s;animation-delay:${-Math.random()}s"></span>`
  ).join("");
}
function clouds(n) {
  return Array.from({ length: n }, (_, i) =>
    `<span class="cloud" style="top:${10 + i * 22}%;animation-duration:${26 + i * 9}s;animation-delay:${-i * 8}s;transform:scale(${0.7 + i * 0.2})"></span>`
  ).join("");
}
const fx = {
  sunny: () => `<span class="sunray"></span>`,
  cloudy: () => `<span class="sunray" style="opacity:.6"></span>${clouds(3)}`,
  rain: () => clouds(2) + drops(46),
  storm: () => `<span class="flash"></span>` + clouds(3) + drops(70),
  fog: () => `<span class="fogband" style="top:15%"></span><span class="fogband" style="top:45%;animation-delay:-3s"></span><span class="fogband" style="top:72%;animation-delay:-6s"></span>`,
  rainbow: () => `<span class="rainbow"></span>`,
};
$$(".weather").forEach((b) => b.addEventListener("click", () => {
  $$(".weather").forEach((x) => x.classList.toggle("is-on", x === b));
  const w = b.dataset.w, d = weather[w];
  sky.dataset.w = w;
  skyFx.innerHTML = reduceMotion ? "" : fx[w]();
  weatherMsg.innerHTML = `
    <h4>${d.t}</h4>
    <p>${d.m}</p>
    <span class="practice">${d.p}</span>
    <p style="margin-top:16px"><button class="link-btn" data-open="connect">Whatever the weather, you're welcome to talk about it →</button></p>`;
  weatherMsg.style.animation = "none"; void weatherMsg.offsetWidth; weatherMsg.style.animation = "";
}));

/* ---------- Game 2: Navarasa Spin ---------- */
const rasas = [
  { n: "Shringara", e: "love & beauty", c: "#F8C7D4", d: "The rasa of love, attraction and delight in beauty.", cue: "let it soften your eyes" },
  { n: "Hasya", e: "laughter & joy", c: "#F9DC8A", d: "The rasa of humour, lightness and joy.", cue: "let it tickle your cheeks" },
  { n: "Karuna", e: "compassion & sorrow", c: "#BFD9E6", d: "The rasa of tenderness, grief and deep care.", cue: "let it rest in your chest" },
  { n: "Raudra", e: "anger & fury", c: "#F2A08F", d: "The rasa of fire, anger and fierce energy.", cue: "let it into your jaw and fists (gently!)" },
  { n: "Veera", e: "courage & valour", c: "#F4B97A", d: "The rasa of courage, confidence and heroic spirit.", cue: "let it lift your chin and chest" },
  { n: "Bhayanaka", e: "fear", c: "#C9C3D9", d: "The rasa of fear, anxiety and trembling.", cue: "let it widen your eyes" },
  { n: "Bibhatsa", e: "disgust", c: "#C8D7A6", d: "The rasa of aversion and disgust.", cue: "let it wrinkle your nose" },
  { n: "Adbhuta", e: "wonder & awe", c: "#D9CBF0", d: "The rasa of wonder, surprise and amazement.", cue: "let it raise your eyebrows" },
  { n: "Shanta", e: "peace", c: "#DDE8D8", d: "The rasa of stillness, calm and inner peace.", cue: "let it slow your breath" },
];
const mundane = [
  "I had toast for breakfast.",
  "The bus is running five minutes late.",
  "Could you please pass the salt?",
  "My socks don't match today.",
  "I think it might rain later.",
  "I still need to reply to that email.",
  "The fridge is humming again.",
  "We're out of milk.",
];
const wheel = $("#wheel");
const seg = 360 / rasas.length;
wheel.style.background = `conic-gradient(${rasas.map((r, i) => `${r.c} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})`;
rasas.forEach((r, i) => {
  const l = document.createElement("div");
  const rot = i * seg + seg / 2 - 90;
  l.className = "wheel-label" + (rot > 90 && rot < 270 ? " flip" : "");
  l.style.transform = `rotate(${rot}deg)`;
  l.innerHTML = `<span>${r.n}</span>`;
  wheel.appendChild(l);
});
let wheelRot = 0;
const spinBtn = $("#spinBtn");
const rasaCard = $("#rasaCard");
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  const k = Math.floor(Math.random() * rasas.length);
  const center = k * seg + seg / 2;
  const jitter = (Math.random() - 0.5) * (seg * 0.6);
  const target = Math.ceil(wheelRot / 360) * 360 + 360 * 5 + (360 - center) + jitter;
  wheelRot = target;
  wheel.style.transform = `rotate(${target}deg)`;
  rasaCard.innerHTML = `<p class="hand big">round and round it goes…</p>`;
  setTimeout(() => {
    const r = rasas[k];
    rasaCard.innerHTML = `
      <div class="rasa-reveal">
        <p class="rasa-name">${r.n}</p>
        <p class="rasa-en">${r.e}</p>
        <p>${r.d}</p>
        <div class="challenge">Your challenge: say <q>${rand(mundane)}</q> out loud, filled with <em>${r.n}</em>. ${r.cue[0].toUpperCase() + r.cue.slice(1)}.</div>
        <p class="tiny muted" style="margin-top:14px">Every feeling has a flavour, and none of them are wrong. Spin again?</p>
      </div>`;
    rasaCard.style.background = r.c + "66";
    spinBtn.disabled = false;
  }, reduceMotion ? 50 : 4300);
});

/* ---------- Game 3: Befriend the Critic ---------- */
const critics = [
  { c: "You're too much.", k: "The people who are right for you will be glad you brought all of you.", g: "This part may be trying to protect you from rejection." },
  { c: "You're not good enough yet.", k: "You can be a work in progress and worthy of love at the same time.", g: "This part may be trying to protect you from disappointment." },
  { c: "Don't speak up. You'll embarrass yourself.", k: "Your voice is allowed to wobble. It still deserves to be heard.", g: "This part may be trying to protect you from shame." },
  { c: "Everyone else has it figured out.", k: "Most people are quietly figuring it out too. You're in good company.", g: "This part may be trying to protect you from feeling left behind." },
  { c: "You should be over this by now.", k: "Healing doesn't run on a schedule. Take the time you need.", g: "This part may be trying to hurry you out of pain." },
  { c: "Play is childish. Be serious.", k: "Play is how humans learn, heal and connect. Your inner child is wise.", g: "This part may be trying to keep you from looking foolish." },
];
const kindGeneric = [
  "Thank you for trying to protect me. I hear you. And I'm choosing to be gentle with myself anyway.",
  "I know you're scared. You don't have to run the show today. We're safe enough right now.",
  "You've worked so hard to keep me safe. Let's try a softer way together.",
];
const criticCards = $("#criticCards");
function makeCard({ c, k, g }, isNew = false) {
  const b = document.createElement("button");
  b.className = "ccard" + (isNew ? " is-new" : "");
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = `
    <div class="ccard-face ccard-front"><p></p><small>the critic says… (tap)</small></div>
    <div class="ccard-face ccard-back"><div><p class="kind"></p><p class="guard"></p></div><small>a kinder voice ♡</small></div>`;
  $(".ccard-front p", b).textContent = `“${c}”`;
  $(".kind", b).textContent = k;
  $(".guard", b).textContent = g;
  b.setAttribute("aria-label", `Critic says: ${c}. Tap to hear a kinder voice.`);
  b.addEventListener("click", () => {
    const f = b.classList.toggle("is-flipped");
    b.setAttribute("aria-pressed", String(f));
    b.setAttribute("aria-label", f ? `Kinder voice: ${k} ${g}` : `Critic says: ${c}. Tap to hear a kinder voice.`);
  });
  return b;
}
critics.forEach((x) => criticCards.appendChild(makeCard(x)));
$("#criticForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#criticInput");
  const text = input.value.trim().replace(/^["“]|["”]$/g, "");
  if (!text) { input.focus(); return; }
  const card = makeCard({ c: text, k: rand(kindGeneric), g: "Ask this part: what are you afraid would happen if you stopped?" }, true);
  criticCards.prepend(card);
  input.value = "";
  setTimeout(() => card.click(), 600);
});

/* ---------- Game 4: Yes, And ---------- */
const starters = [
  "A tiny cloud was afraid of raining in public.",
  "A shy teacup decided to join the circus.",
  "One morning, the moon simply forgot to set.",
  "The office plant started giving everyone compliments.",
  "A very serious accountant found a red clown nose in a desk drawer.",
];
const yesAnds = [
  "at that exact moment, a very polite pigeon asked if it could join in.",
  "everyone started speaking only in whispers, which somehow made it ten times funnier.",
  "it turned out to be the bravest thing anyone had done all week.",
  "a marching band appeared out of nowhere, playing slightly out of tune.",
  "the ground began to hum a soft little lullaby.",
  "a grandmother nearby nodded as if she'd seen this coming for years.",
  "it began to rain confetti, but only on people who were being honest.",
  "someone laughed so hard they snorted, and then everybody was laughing.",
  "a small dog took this as a personal invitation to dance.",
  "for one strange second, nobody felt embarrassed about anything at all.",
  "the sun peeked out just to see what all the fuss was about.",
  "a secret door swung open, revealing a room full of very soft pillows.",
];
const nudges = ["Suddenly…", "Nobody expected that…", "Just then, a giraffe…", "But the problem was…", "So they decided to…", "And then someone started singing…", "Meanwhile, in the kitchen…"];
const story = $("#story");
const storyInput = $("#storyInput");
let pool = [], turns = 0, busy = false;
function addLine(cls, html) {
  const d = document.createElement("div");
  d.className = "line " + cls;
  d.innerHTML = html;
  story.appendChild(d);
  story.scrollTop = story.scrollHeight;
  return d;
}
function newStory() {
  story.innerHTML = "";
  pool = [...yesAnds].sort(() => Math.random() - 0.5);
  turns = 0;
  addLine("m", `Okay, I'll start: <b>${rand(starters)}</b> Your turn!`);
}
$("#storyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = storyInput.value.trim();
  if (!text || busy) return;
  const u = addLine("u", "");
  u.textContent = text;
  storyInput.value = "";
  busy = true;
  const typing = addLine("m typing", "<i></i><i></i><i></i>");
  setTimeout(() => {
    typing.remove();
    if (!pool.length) pool = [...yesAnds].sort(() => Math.random() - 0.5);
    addLine("m", `<b>Yes, and</b> ${pool.pop()}`);
    turns++;
    if (turns === 4) {
      addLine("cheer", "Look at that. You just improvised a whole story, with no rehearsal and no right answer. That's the secret: say yes to what's here, then add a little of yourself.");
    }
    busy = false;
  }, reduceMotion ? 100 : 900);
});
$("#stuckBtn").addEventListener("click", () => {
  storyInput.value = rand(nudges) + " ";
  storyInput.focus();
});
$("#newStory").addEventListener("click", newStory);
newStory();

/* =========================================================
   Modals
   ========================================================= */
/* ---------- Cal.com booking popup ---------- */
if (CONFIG.calLink) {
  // Official Cal.com embed loader (from Cal.com → Event type → Embed)
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", "mrinal", { origin: "https://app.cal.com" });
  Cal.ns.mrinal("ui", {
    theme: "light",
    cssVarsPerTheme: { light: { "cal-brand": "#C9553D" } },
    hideEventTypeDetails: false,
    layout: "month_view",
  });
  // Hand every booking button over to Cal.com instead of the demo calendar
  $$('[data-open="booking"]').forEach((btn) => {
    btn.removeAttribute("data-open");
    btn.setAttribute("data-cal-link", CONFIG.calLink);
    btn.setAttribute("data-cal-namespace", "mrinal");
    btn.setAttribute("data-cal-config", JSON.stringify({ layout: "month_view", theme: "light" }));
  });
}

const connectModal = $("#connectModal");
const bookingModal = $("#bookingModal");

document.addEventListener("click", (e) => {
  const opener = e.target.closest("[data-open]");
  if (opener) {
    e.preventDefault();
    if (opener.dataset.open === "connect") openConnect(opener.dataset.interest);
    if (opener.dataset.open === "booking") openBooking();
  }
  if (e.target.closest("[data-close]")) e.target.closest("dialog")?.close();
});
// click on the backdrop closes the dialog
[connectModal, bookingModal].forEach((dlg) => {
  dlg.addEventListener("click", (e) => {
    if (e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
  });
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(form, errEl) {
  let firstBad = null;
  $$("[required]", form).forEach((f) => {
    const bad = !f.value.trim() || (f.type === "email" && !EMAIL_RE.test(f.value.trim()));
    f.classList.toggle("invalid", bad);
    if (bad && !firstBad) firstBad = f;
  });
  errEl.textContent = firstBad ? "A couple of fields still need a little love." : "";
  firstBad?.focus();
  return !firstBad;
}

/* ---------- connect ---------- */
const connectForm = $("#connectForm");
function openConnect(interest) {
  $("#connectBody").hidden = false;
  $("#connectSuccess").hidden = true;
  $("#connectError").textContent = "";
  if (interest) {
    const r = $(`input[name="interest"][value="${interest}"]`, connectForm);
    if (r) r.checked = true;
  }
  connectModal.showModal();
}
connectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate(connectForm, $("#connectError"))) return;
  const data = new FormData(connectForm);
  const btn = $("button[type=submit]", connectForm);
  btn.disabled = true;
  btn.textContent = "Sending…";
  try {
    if (CONFIG.formEndpoint) {
      const res = await fetch(CONFIG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("send failed");
    } else {
      await new Promise((r) => setTimeout(r, 700));
    }
    const name = String(data.get("name")).trim().split(" ")[0];
    $("#connectThanks").textContent = `Thank you, ${name}. Reaching out takes courage, and it's been received with care. Mrinal will write back to you soon.`;
    $("#connectBody").hidden = true;
    $("#connectSuccess").hidden = false;
    connectForm.reset();
  } catch {
    $("#connectError").textContent = "Hmm, that didn't go through. Could you try again in a moment?";
  } finally {
    btn.disabled = false;
    btn.textContent = "Send with care ♡";
  }
});
$$("input, textarea", connectForm).forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));

/* ---------- booking ---------- */
const book = { step: 1, type: null, mins: 20, date: null, time: null, view: null };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SLOT_BASE = ["10:00", "11:30", "14:00", "16:00", "18:30", "20:00"];
const today = new Date(); today.setHours(0, 0, 0, 0);
const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 60);

// Demo availability. Replace with real availability (or set CONFIG.bookingUrl).
const hash = (d) => (d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) * 2654435761 % 1000;
function isAvailable(d) {
  const dow = d.getDay();
  return d > today && d <= maxDate && dow !== 0 && dow !== 3 && hash(d) % 5 !== 0;
}
function slotsFor(d) {
  const h = hash(d);
  const open = SLOT_BASE.filter((_, i) => ((h >> i) & 3) !== 0);
  return open.length ? open : ["11:30", "16:00"];
}
const fmtTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const fmtDate = (d) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;

function openBooking() {
  const embed = $("#bookEmbed");
  if (CONFIG.bookingUrl) {
    $$(".book-step, .book-steps", bookingModal).forEach((el) => (el.hidden = true));
    embed.hidden = false;
    if (!embed.firstChild) {
      const f = document.createElement("iframe");
      f.src = CONFIG.bookingUrl;
      f.title = "Book a session with Mrinal";
      embed.appendChild(f);
    }
  } else {
    book.date = null; book.time = null;
    // open on the month of the first available day (e.g. on the last day of a month)
    const first = new Date(today);
    do first.setDate(first.getDate() + 1); while (!isAvailable(first) && first <= maxDate);
    book.view = new Date(first.getFullYear(), first.getMonth(), 1);
    showStep(1);
  }
  bookingModal.showModal();
}
function showStep(n) {
  book.step = n;
  $$(".book-step", bookingModal).forEach((s) => (s.hidden = +s.dataset.step !== n));
  $$(".book-steps li", bookingModal).forEach((li, i) => {
    li.classList.toggle("is-on", i + 1 === n);
    li.classList.toggle("is-done", i + 1 < n);
  });
  $(".book-steps", bookingModal).hidden = n === 4;
  if (n === 2) renderCal();
  if (n === 3) renderSummary();
  bookingModal.scrollTop = 0;
}
bookingModal.addEventListener("click", (e) => {
  if (e.target.closest("[data-next]")) {
    if (book.step === 1) {
      const r = $('input[name="stype"]:checked', bookingModal);
      book.type = r.value; book.mins = +r.dataset.mins;
    }
    showStep(book.step + 1);
  }
  if (e.target.closest("[data-back]")) showStep(book.step - 1);
});

function renderCal() {
  const v = book.view;
  $("#calMonth").textContent = `${MONTHS[v.getMonth()]} ${v.getFullYear()}`;
  $("#calPrev").disabled = v <= new Date(today.getFullYear(), today.getMonth(), 1);
  $("#calNext").disabled = new Date(v.getFullYear(), v.getMonth() + 1, 1) > maxDate;
  const grid = $("#calGrid");
  grid.innerHTML = "";
  const lead = (v.getDay() + 6) % 7; // Monday-first
  for (let i = 0; i < lead; i++) grid.appendChild(document.createElement("span"));
  const days = new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const date = new Date(v.getFullYear(), v.getMonth(), d);
    const b = document.createElement("button");
    b.className = "cal-day";
    b.textContent = d;
    const ok = isAvailable(date);
    b.disabled = !ok;
    if (ok) b.classList.add("avail");
    if (+date === +today) b.classList.add("today");
    if (book.date && +date === +book.date) b.classList.add("is-sel");
    b.setAttribute("aria-label", fmtDate(date) + (ok ? ", available" : ", unavailable"));
    b.addEventListener("click", () => { book.date = date; book.time = null; renderCal(); });
    grid.appendChild(b);
  }
  renderSlots();
}
function renderSlots() {
  const list = $("#slotList");
  list.innerHTML = "";
  $("#toDetails").disabled = !(book.date && book.time);
  if (!book.date) { $("#slotsTitle").textContent = "Pick a date to see open times"; list.innerHTML = `<p class="slots-empty">the green dots are open days ✿</p>`; return; }
  $("#slotsTitle").textContent = fmtDate(book.date);
  slotsFor(book.date).forEach((t) => {
    const b = document.createElement("button");
    b.className = "slot" + (book.time === t ? " is-sel" : "");
    b.textContent = fmtTime(t);
    b.addEventListener("click", () => { book.time = t; renderSlots(); });
    list.appendChild(b);
  });
}
$("#calPrev").addEventListener("click", () => { book.view = new Date(book.view.getFullYear(), book.view.getMonth() - 1, 1); renderCal(); });
$("#calNext").addEventListener("click", () => { book.view = new Date(book.view.getFullYear(), book.view.getMonth() + 1, 1); renderCal(); });

function renderSummary() {
  $("#bookSummary").innerHTML = `<div><span>Session</span><br>${book.type} · ${book.mins} min</div><div><span>When</span><br>${fmtDate(book.date)}, ${fmtTime(book.time)} IST</div>`;
}
const bookForm = $("#bookForm");
$$("input, textarea", bookForm).forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate(bookForm, $("#bookError"))) return;
  const name = new FormData(bookForm).get("name").trim().split(" ")[0];
  $("#bookDone").textContent = `See you on ${fmtDate(book.date)} at ${fmtTime(book.time)} IST, ${name}. A confirmation will follow by email. Until then, go gently.`;
  $("#gcalLink").href = gcalUrl();
  bookForm.reset();
  showStep(4);
});
function gcalUrl() {
  const [h, m] = book.time.split(":").map(Number);
  const startUtc = Date.UTC(book.date.getFullYear(), book.date.getMonth(), book.date.getDate(), h, m) - 330 * 60000; // IST → UTC
  const f = (ms) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${book.type} with Mrinal Gautam`,
    dates: `${f(startUtc)}/${f(startUtc + book.mins * 60000)}`,
    details: "A space to arrive as you are.",
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

/* ---------- misc ---------- */
$("#year").textContent = new Date().getFullYear();
