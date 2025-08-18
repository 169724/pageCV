// Remove no-js class
document.documentElement.classList.remove('no-js');

// =====================
// Drawer (hamburger)
// =====================
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const open = !drawer.classList.contains('open');
    drawer.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }));
}

// =====================
// Scroll reveal
// =====================
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  })
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// =====================
// Scroll spy
// =====================
const sections = [...document.querySelectorAll('main section[id]')];
const menu = document.getElementById('menu');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = menu && menu.querySelector(`a[href="#${id}"]`);
    if (link && entry.isIntersecting) {
      menu.querySelectorAll('a').forEach(a => { a.classList.remove('active'); a.setAttribute('aria-current', 'false'); });
      link.classList.add('active');
      link.setAttribute('aria-current', 'true');
    }
  })
}, { rootMargin: "-50% 0px -45% 0px", threshold: 0 });
sections.forEach(sec => spy.observe(sec));

// =====================
// WEB3FORMS submit (instead of mailto)
// =====================
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!statusEl) return;
    statusEl.textContent = 'Wysyłanie…';
    statusEl.classList.remove('ok', 'err');

    const fd = new FormData(form);
    // Build subject dynamically
    const name = (form.elements['name']?.value || '').trim();
    fd.append('subject', `Wiadomość ze strony — ${name || 'Kontakt'}`);

    // Convert to JSON for Web3Forms
    const json = Object.fromEntries(fd.entries());

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(json)
      });
      const data = await res.json();
      if (data.success) {
        statusEl.textContent = 'Dziękuję! Wiadomość została wysłana.';
        statusEl.classList.add('ok');
        form.reset();
      } else {
        throw new Error(data.message || 'Błąd wysyłki');
      }
    } catch (err) {
      statusEl.textContent = 'Nie udało się wysłać. Spróbuj ponownie lub napisz: dawidmalek80@gmail.com';
      statusEl.classList.add('err');
    }
  });
}

// =====================
// Footer year
// =====================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =====================
// Clock
// =====================
const clockEl = document.getElementById('clockFloat');
function tick(){ const d=new Date(); const h=String(d.getHours()).padStart(2,'0'); const m=String(d.getMinutes()).padStart(2,'0'); const s=String(d.getSeconds()).padStart(2,'0'); if(clockEl) clockEl.textContent=`🕒 ${h}:${m}:${s}`; }
setInterval(tick,1000); tick();

// =====================
// Views counter for GitHub Pages
// Robust: CountAPI (hit→get) → proxy → SeeYouFarm (SVG) → proxy SVG
// =====================
(async function(){
  const wrap = document.getElementById('views');
  if(!wrap) return;

  const elText = document.getElementById('viewsText');
  const elImg  = document.getElementById('viewsImg');

  const NS  = 'pagecv_169724';
  const KEY = 'index';

  const hitURL = `https://api.countapi.xyz/hit/${NS}/${KEY}`;
  const getURL = `https://api.countapi.xyz/get/${NS}/${KEY}`;

  const renderText = (v) => { if (elText) elText.textContent = String(v); };

  // Fallback IMG (działa zawsze, bo <img> nie podlega CORS)
  const useImageFallback = () => {
    if (!elImg) return;
    const pageURL = 'https://169724.github.io/pageCV/'; // URL strony
    const badge = `https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${encodeURIComponent(pageURL)}&count_bg=%232F80ED&title_bg=%2356CCF2&icon=&icon_color=%23E8ECF1&title=Views&edge_flat=false&time=${Date.now()}`;
    elImg.src = badge;
    elImg.style.display = 'inline-block';
    if (elText) elText.style.display = 'none';
  };

  // Spróbuj CountAPI (increment na starcie)
  try {
    const res = await fetch(hitURL, { cache: 'no-store', mode: 'cors' });
    const data = await res.json();                 // jeśli CORS/DNS zawiedzie → wyleci w catch
    if (typeof data.value === 'number') {
      renderText(data.value);
    } else {
      throw new Error('Bad payload');
    }
  } catch (e) {
    // DNS/CORS/Adblock → przełącz na obrazek
    useImageFallback();
    return; // kończymy – obrazek już pokazuje licznik
  }

  // Live refresh co 30 s (bez nabijania)
  setInterval(async () => {
    try {
      const r = await fetch(getURL, { cache: 'no-store', mode: 'cors' });
      const j = await r.json();
      if (typeof j.value === 'number') renderText(j.value);
    } catch (_) {
      // jeśli w trakcie sesji zacznie blokować – przełącz się na obrazek
      useImageFallback();
    }
  }, 30000);
})();

// =====================
// i18n — store Polish originals
// =====================
const originals = {};
document.querySelectorAll('[data-i18n]').forEach(el=>{ originals[el.getAttribute('data-i18n')] = el.innerHTML; });
const phOriginals = {};
document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ phOriginals[el.getAttribute('data-i18n-ph')] = el.getAttribute('placeholder'); });

// Full EN dictionary
const i18n = {
  en:{
    'menu.about':'About', 'menu.skills':'Skills', 'menu.exp':'Experience', 'menu.edu':'Education', 'menu.certs':'Certificates', 'menu.projects':'Projects', 'menu.contact':'Contact',
    'hero.title':'Hi, I\'m <span style="background:linear-gradient(135deg,var(--brand),var(--brand-2)); -webkit-background-clip:text; background-clip:text; color:transparent">Dawid Małek</span> 👋',
    'hero.lead':'B.Eng. in Electronics & Telecommunications (PRz, 10.2021–02.2025). Currently M.Sc. in Electrical Engineering — RES (since 02.2025). I connect <strong>hardware</strong> with <strong>code</strong> and design.',
    'hero.lang':'<strong>🗣️ Languages</strong><span>Polish — native<br>English — intermediate</span>',

    'about.h2':'🧑‍💻 About me',
    'about.p1':'Electronics & IT engineer with hands‑on experience in IT departments and computer service. I combine practical hardware skills with programming and rapid prototyping, which helps me approach problems end‑to‑end — from schematic, through code, to user interface.',
    'about.p2':'At Rzeszów University of Technology I completed projects involving microcontrollers (STM32), measurement & simulation (LabVIEW, LTspice, Matlab) and simple web apps. Since 02.2025 I have been pursuing an M.Sc. in Electrical Engineering (RES) with a focus on energy efficiency and system integration.',
    'about.p3':'I value clean code, clear UI and hardware DIY. In my free time I create graphics, play chess & strategy games, and ski in winter ⛷️.',
    'about.hl1':'<div class="title">✅ Strengths</div><div class="meta">analytical thinking, prototyping, collaboration & communication, patient customer service</div>',
    'about.hl2':'<div class="title">🧩 Tech interests</div><div class="meta">microcontrollers, automation, energy systems, web apps, data visualization</div>',
    'about.birth':'Date of birth', 'about.loc':'Location', 'about.phone':'Phone', 'about.lang':'Languages', 'about.langval':'Polish — native<br>English — intermediate',

    'skills.h2':'🛠️ Skills', 'skills.code':'Programming', 'skills.web':'Web & Databases', 'skills.sql':'SQL (basics)', 'skills.elec':'Electronics', 'skills.pc':'PC service', 'skills.net':'Network admin', 'skills.soft':'Soft skills', 'skills.team':'Teamwork', 'skills.cust':'Customer support', 'skills.plan':'Planning',

    'exp.h2':'💼 Experience',
    'exp.it':'IT Department', 'exp.devices':'Electrical devices', 'exp.pc':'PC service', 'exp.net':'Network administration', 'exp.db':'Database editing', 'exp.cust':'Customer support', 'exp.cash':'Cash register',
    'exp.bury.t':'Intern — Bury Sp. z o.o. (IT)', 'exp.bury.meta':'07.2023 – 08.2023 · Rzeszów', 'exp.bury.d':'Professional internship in the IT department, including work on electrical devices.',
    'exp.inkom.t':'IT Trainee — F.U.H. INKOM Piotr Łacko', 'exp.inkom.meta':'01.2020 – 01.2020 · Janów Lubelski', 'exp.inkom.d':'Computer service, network administration and teamwork with the store staff.',
    'exp.lck.t':'Intern — Lubelskie Centrum Komputerowe Sp. z o.o.', 'exp.lck.meta':'11.2018 & 09.2019 · Janów Lubelski', 'exp.lck.d':'Computer service, network administration, work with a cash register and customer support.',

    'edu.h2':'🎓 Education',
    'edu.msc':'Rzeszów University of Technology — Electrical Engineering (M.Sc.), specialization: Renewable Energy Sources', 'edu.msc.meta':'02.2025 – present',
    'edu.beng':'Rzeszów University of Technology — Electronics & Telecommunications (B.Eng.)', 'edu.beng.meta':'10.2021 – 02.2025',
    'edu.tech':'Zespół Szkół Zawodowych in Janów Lubelski — IT Technician', 'edu.tech.meta':'09.2017 – 05.2021',

    'certs.h2':'🏅 Certificates & courses',
    'certs.gfx':'Computer Graphic Designer', 'certs.gfx.meta':'07.2021 — International Competence Verification Centre',
    'certs.ee09':'EE.09 — Programming, building and administering websites & databases', 'certs.ee09.meta':'04.2021 — OKE Kraków',
    'certs.ee08':'EE.08 — Assembly and operation of computer systems, peripherals and networks', 'certs.ee08.meta':'08.2020 — OKE Kraków',
    'certs.extra':'Additional activity', 'certs.vol':'01.2016 – 12.2016 — Volunteer, Janów Lubelski (World Youth Day 2016)',

    'projects.h2':'🖼️ Projects & Graphics', 'projects.p':'Selected artwork and projects are published on Imgur and GitHub repositories. Click to see more:',

    'contact.h2':'✉️ Contact', 'contact.name':'Full name', 'contact.mail':'E‑mail', 'contact.msg':'Message', 'contact.send':'Send', 'contact.pref':'Prefer traditional contact? Call or email me.', 'contact.phoneShort':'Phone:', 'contact.follow':'Follow me:',

    'footer.rights':'All rights reserved.'
  },
  ph_en:{ 'ph.name':'Your name', 'ph.mail':'name@domain.com', 'ph.msg':'Type your message...' }
};

const langBtn = document.getElementById('langBtn');
// Inline SVG flags
const SVG_PL = '<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="8" fill="#ffffff"/><rect y="8" width="24" height="8" fill="#dc143c"/></svg>';
const SVG_GB = '<svg viewBox="0 0 24 16" aria-hidden="true"><defs><clipPath id="uk"><rect width="24" height="16" rx="2"/></clipPath></defs><g clip-path="url(#uk)"><rect width="24" height="16" fill="#012169"/><path d="M0,0 L24,16 M24,0 L0,16" stroke="#ffffff" stroke-width="3"/><path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" stroke-width="2"/><path d="M12,0 V16 M0,8 H24" stroke="#ffffff" stroke-width="5"/><path d="M12,0 V16 M0,8 H24" stroke="#C8102E" stroke-width="3"/></g></svg>';

function setLang(lang){
  const isEN = lang==='en';
  document.documentElement.lang = isEN ? 'en' : 'pl';
  if(isEN){
    Object.entries(i18n.en).forEach(([k,v])=>{ document.querySelectorAll(`[data-i18n="${k}"]`).forEach(el=>{ el.innerHTML=v; }); });
    Object.entries(i18n.ph_en).forEach(([k,v])=>{ document.querySelectorAll(`[data-i18n-ph="${k}"]`).forEach(el=>{ el.setAttribute('placeholder', v); }); });
    if (langBtn){ langBtn.innerHTML = SVG_PL; langBtn.title='Zmień język na polski'; langBtn.setAttribute('aria-label','Zmień język na polski'); }
  }else{
    Object.entries(originals).forEach(([k,v])=>{ document.querySelectorAll(`[data-i18n="${k}"]`).forEach(el=>{ el.innerHTML=v; }); });
    Object.entries(phOriginals).forEach(([k,v])=>{ document.querySelectorAll(`[data-i18n-ph="${k}"]`).forEach(el=>{ el.setAttribute('placeholder', v); }); });
    if (langBtn){ langBtn.innerHTML = SVG_GB; langBtn.title='Switch language to English'; langBtn.setAttribute('aria-label','Switch language to English'); }
  }
  try{ localStorage.setItem('dm_lang', lang); }catch(e){}
}
window.setLang = setLang;

if (langBtn){
  langBtn.addEventListener('click',()=>{
    const current = (typeof localStorage!=='undefined' && localStorage.getItem('dm_lang')) || document.documentElement.lang || 'pl';
    document.body.classList.add('i18n-anim','i18n-dim');
    setTimeout(()=>{
      const next = current==='pl' ? 'en' : 'pl';
      setLang(next);
      requestAnimationFrame(()=>{ document.body.classList.remove('i18n-dim'); });
    }, 150);
  });
}

// init lang — respect saved; default PL
const saved = (typeof localStorage!=='undefined' && localStorage.getItem('dm_lang')) || 'pl';
setLang(saved);

// =====================
// Add-ons: progress bar, stars, parallax, circles, tilt, typewriter
// =====================
(function(){
  // Progress bar
  const progressBar = document.getElementById('scrollProgress');
  function setProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop)/(h.scrollHeight - h.clientHeight) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';
  }
  document.addEventListener('scroll', setProgress, {passive:true});
  setProgress();

  // Stars canvas background (disabled if prefers-reduced-motion)
  const starsCanvas = document.getElementById('stars');
  if (starsCanvas) {
    const ctx = starsCanvas.getContext('2d');
    let stars = [];
    function resizeStars(){ starsCanvas.width = innerWidth; starsCanvas.height = innerHeight; }
    function initStars(){ stars = Array.from({length:90},()=>({x:Math.random()*starsCanvas.width,y:Math.random()*starsCanvas.height,r:Math.random()*0.8+0.2, s:Math.random()*0.3+0.1})); }
    function drawStars(){
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      ctx.clearRect(0,0,starsCanvas.width,starsCanvas.height);
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      for(const st of stars){ ctx.globalAlpha = Math.random()*0.4+0.2; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2); ctx.fill(); st.y += st.s; if(st.y > starsCanvas.height) st.y = -2; }
      requestAnimationFrame(drawStars);
    }
    function bootStars(){ resizeStars(); initStars(); drawStars(); }
    bootStars();
    addEventListener('resize', ()=>{ resizeStars(); initStars(); });
  }

  // Parallax portrait image (ultra subtle, never crops)
  const parallaxImg = document.querySelector('.portrait img');
  function slowParallax(){
    if(!parallaxImg) return;
    if (matchMedia('(max-width: 900px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches){ parallaxImg.style.transform='translateY(0)'; return; }
    const rect = parallaxImg.getBoundingClientRect();
    const center = innerHeight / 2;
    let offset = (rect.top + rect.height/2 - center) * -0.01; // 1%
    if(offset > 6) offset = 6; if(offset < -6) offset = -6;
    parallaxImg.style.transform = `translateY(${offset}px)`;
  }
  addEventListener('scroll', slowParallax, {passive:true});
  addEventListener('resize', slowParallax, {passive:true});
  slowParallax();

  // Circular skills animation
  const circleObserver = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target; const pct = +el.dataset.pct || 0;
      const ring = el.querySelector('.ring'); const label = el.querySelector('.ring span');
      let p=0; const anim = setInterval(()=>{ p += 2; if(p>pct) p=pct; ring.style.background = `conic-gradient(var(--brand) 0% ${p}%, rgba(255,255,255,.08) ${p}% 100%)`; label.textContent = `${p}%`; if(p>=pct) clearInterval(anim); }, 16);
      circleObserver.unobserve(el);
    });
  },{threshold:.4});
  document.querySelectorAll('.circle').forEach(c=>circleObserver.observe(c));

  // 3D tilt for buttons/badges
  function addTilt(el){
    el.addEventListener('mousemove', (e)=>{ const r = el.getBoundingClientRect(); const x = (e.clientX - r.left)/r.width - .5; const y = (e.clientY - r.top)/r.height - .5; el.style.transform = `perspective(700px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`; });
    el.addEventListener('mouseleave', ()=>{ el.style.transform='perspective(700px) rotateX(0) rotateY(0)'; });
  }
  document.querySelectorAll('.tilt, .badge.tilt').forEach(addTilt);

  // Typewriter for greeting prefix + react to language switch
  const prefixEl = document.getElementById('typePrefix');
  function typewrite(text){ if(!prefixEl) return; prefixEl.textContent=''; let i=0; const timer=setInterval(()=>{ prefixEl.textContent=text.slice(0,++i); if(i>=text.length) clearInterval(timer); },30); }
  const current = (typeof localStorage!=='undefined' && localStorage.getItem('dm_lang')) || 'pl';
  typewrite(prefixEl?.dataset[current==='en'?'en':'pl'] || '');

  const origSetLang = window.setLang;
  if(typeof origSetLang === 'function'){
    window.setLang = function(lang){ origSetLang(lang); typewrite(prefixEl?.dataset[lang==='en'?'en':'pl'] || ''); };
  }
})();

