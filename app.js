const DATA_URL = 'data.json';
let DATA = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));

async function load(){
  const response = await fetch(DATA_URL, {cache:'no-store'});
  if(!response.ok) throw new Error('Impossible de charger data.json');
  DATA = await response.json();
  render();
}

function icon(name){
  const icons = {
    phone:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.9Z"/></svg>',
    pin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'
  };
  return icons[name] || '';
}

function shell(title, active, content){
  document.title = `${title} — New Age Travel France`;
  return `
  <a class="skip-link" href="#main">Aller au contenu</a>
  <div class="topbar"><div class="container inner">
    <span>✈️ Voyages au départ de Marseille</span>
    <span>${icon('phone')} ${esc(DATA.agency.phone)} · ${icon('pin')} ${esc(DATA.agency.city)}</span>
  </div></div>
  <nav class="nav" aria-label="Navigation principale"><div class="container inner">
    <a class="brand" href="index.html" aria-label="New Age Travel France — Accueil"><img src="assets/logo.jpg" alt="Logo New Age Travel France"><span>New Age Travel France<small>Agence de voyage · Marseille</small></span></a>
    <div class="links" id="mainNav">
      ${navLink('Accueil','index.html',active==='home')}
      ${navLink('Destinations','destinations.html',active==='dest')}
      ${navLink('Offres','offres.html',active==='offers')}
      ${navLink('Actualités','publications.html',active==='posts')}
      ${navLink('L’agence','agence.html',active==='agency')}
      ${navLink('Contact','contact.html',active==='contact')}
      <a class="btn btn-primary" href="contact.html">Demander un devis ${icon('arrow')}</a>
    </div>
    <button class="menu" type="button" aria-label="Ouvrir le menu" aria-expanded="false" onclick="toggleMenu(this)">☰</button>
  </div></nav>
  <main id="main">${content}</main>
  <footer class="footer"><div class="container footer-grid">
    <div><div class="brand"><img src="assets/logo.jpg" alt="Logo"><span>New Age Travel France<small>Marseille</small></span></div><p>Une agence de voyage à Marseille pour vous accompagner dans vos projets de départ.</p></div>
    <div><h4>Explorer</h4><a href="destinations.html">Destinations</a><a href="offres.html">Offres</a><a href="publications.html">Actualités</a></div>
    <div><h4>L’agence</h4><a href="agence.html">Notre agence</a><a href="contact.html">Demander un devis</a></div>
    <div><h4>Contact</h4><a href="tel:+33465859350">${esc(DATA.agency.phone)}</a><p>${esc(DATA.agency.address)}</p></div>
  </div><div class="container footer-bottom">© ${new Date().getFullYear()} New Age Travel France · Prix, dates et disponibilités à confirmer auprès de l’agence.</div></footer>`;
}

function navLink(label, href, active){return `<a class="${active?'active':''}" ${active?'aria-current="page"':''} href="${href}">${label}</a>`;}

function cards(items, kind='default'){
  if(!items?.length) return '<div class="empty">Aucun résultat ne correspond à votre recherche.</div>';
  return items.map((item,index)=>{
    const title = item.name || item.title;
    const desc = item.description || item.text || '';
    const tag = item.region || item.date || '';
    return `<article class="card reveal ${kind==='post'?'post':''}" style="animation-delay:${Math.min(index*60,300)}ms">
      <div class="card-media"><span class="tag">${esc(tag)}</span><img src="${esc(item.image)}" alt="${esc(title)}" loading="lazy"></div>
      <div class="card-body"><h3>${esc(title)}</h3><p class="meta">${esc(desc)}</p>
      ${item.price?`<div class="price">${esc(item.price)}</div>`:''}
      <a class="btn btn-dark" href="contact.html?destination=${encodeURIComponent(title)}">Demander les détails ${icon('arrow')}</a></div>
    </article>`;
  }).join('');
}

function pageHero(kicker,title,text){
  return `<header class="page-hero"><div class="container"><div class="kicker">${esc(kicker)}</div><h1>${esc(title)}</h1><p class="lead">${esc(text)}</p></div></header>`;
}

function render(){
  const path = location.pathname.split('/').pop() || 'index.html';
  if(path === 'index.html' || path === '') renderHome();
  else if(path === 'destinations.html') renderDestinations();
  else if(path === 'offres.html') renderOffers();
  else if(path === 'publications.html') renderPosts();
  else if(path === 'agence.html') renderAgency();
  else renderContact();
}

function renderHome(){
  const featured = DATA.destinations.slice(0,3);
  $('#app').innerHTML = shell('Accueil','home',`
    <header class="hero"><div class="container">
      <div class="reveal"><span class="eyebrow">New Age Travel France · Marseille</span><h1>Votre prochain départ commence ici.</h1><p>Des destinations sélectionnées, des offres inspirantes et un accompagnement humain pour préparer votre voyage sereinement.</p>
        <div class="hero-actions"><a class="btn btn-primary" href="offres.html">Découvrir les offres ${icon('arrow')}</a><a class="btn btn-light" href="contact.html">Parler à l’agence</a></div>
      </div>
      <div class="hero-card reveal"><img src="assets/cairo.jpg" alt="Le Caire et les pyramides" loading="eager"></div>
    </div></header>
    <div class="container searchbox" aria-label="Recherche de voyage">
      <div class="field"><label for="q">Destination</label><input id="q" placeholder="Ex. Le Caire, Tunisie…" autocomplete="off"></div>
      <div class="field"><label for="type">Type</label><select id="type"><option value="">Tout type de voyage</option><option value="afrique">Afrique</option><option value="spirituel">Spirituel</option><option value="mediterranee">Méditerranée</option></select></div>
      <div class="field"><label for="departure">Départ</label><select id="departure"><option>Marseille</option></select></div>
      <button class="btn btn-dark" type="button" onclick="search()">${icon('search')} Rechercher</button>
    </div>
    <section class="section"><div class="container"><div class="section-head"><div><div class="kicker">À la une</div><h2>Des destinations qui donnent envie de partir.</h2><p class="lead">Découvrez une sélection de voyages inspirés des publications fournies.</p></div><a class="btn btn-light" href="destinations.html">Toutes les destinations ${icon('arrow')}</a></div><div class="grid grid-3" id="featured">${cards(featured)}</div><p class="meta" style="margin-top:16px">* Prix et conditions à confirmer auprès de l’agence.</p></div></section>
    <section class="section" style="padding-top:0"><div class="container"><div class="banner"><div><h3>Une envie précise ?</h3><p>Destination, période et budget : racontez-nous votre projet.</p></div><a class="btn btn-light" href="contact.html">Demander un devis ${icon('arrow')}</a></div></div></section>`);
  document.addEventListener('keydown', e=>{if(e.key==='Enter' && (e.target.id==='q'||e.target.id==='type')) search();});
}

function renderDestinations(){
  $('#app').innerHTML = shell('Destinations','dest',`${pageHero('Explorer','Où souhaitez-vous partir ?','Recherchez une destination et filtrez les voyages par univers.')}
  <section class="section"><div class="container"><div class="filters" role="group" aria-label="Filtrer les destinations">
    <button class="filter active" onclick="filterDest('all',this)">Toutes</button><button class="filter" onclick="filterDest('afrique',this)">Afrique</button><button class="filter" onclick="filterDest('spirituel',this)">Spirituel</button><button class="filter" onclick="filterDest('mediterranee',this)">Méditerranée</button>
  </div><div class="grid grid-3" id="destGrid">${cards(DATA.destinations)}</div><p class="meta" style="margin-top:16px">Les prix et disponibilités sont indicatifs et doivent être confirmés.</p></div></section>`);
  const params = new URLSearchParams(location.search); const q=(params.get('q')||'').toLowerCase(); const type=params.get('type')||'';
  if(q||type){const filtered=filterItems(DATA.destinations,q,type); $('#destGrid').innerHTML=cards(filtered); $$('.filter').forEach(btn=>btn.classList.toggle('active',type?btn.textContent.toLowerCase().includes(type):btn.textContent==='Toutes'));}
}

function renderOffers(){
  $('#app').innerHTML = shell('Offres','offers',`${pageHero('Séjours','Les offres à la une.','Des programmes présentés dans l’univers de New Age Travel France.')}
  <section class="section"><div class="container"><div class="grid grid-3">${cards(DATA.offers)}</div><p class="meta" style="margin-top:16px">* Prix, dates et prestations à confirmer auprès de l’agence.</p></div></section>`);
}

function renderPosts(){
  $('#app').innerHTML = shell('Actualités','posts',`${pageHero('Publications','Les dernières inspirations.','Retrouvez une sélection de publications et d’idées de voyage.')}
  <section class="section"><div class="container"><div class="grid grid-3">${cards(DATA.posts,'post')}</div></div></section>`);
}

function renderAgency(){
  $('#app').innerHTML = shell('L’agence','agency',`${pageHero('New Age Travel France','Une agence ancrée à Marseille.','Retrouvez les informations publiques et l’univers visuel transmis.')}
  <section class="section"><div class="container contact"><div class="info-box"><img src="assets/logo.jpg" alt="Logo New Age Travel France" style="width:130px;border-radius:50%;margin-bottom:20px"><div class="kicker">Notre identité</div><h2>Voyager avec un accompagnement humain.</h2><p>New Age Travel France est présentée comme une agence de voyage située à Marseille.</p><p><strong>Adresse</strong><br>${esc(DATA.agency.address)}</p><p><strong>Téléphone</strong><br><a href="tel:+33465859350">${esc(DATA.agency.phone)}</a></p><a class="btn btn-primary" href="tel:+33465859350">${icon('phone')} Appeler l’agence</a></div>
  <div class="info-box"><div class="kicker">Univers visuel</div><h2>Des départs depuis Marseille.</h2><img src="assets/companies.jpg" alt="Visuel des compagnies présentées par l’agence" style="border-radius:18px;margin:16px 0"><p class="meta">Les logos visibles sur ce visuel sont présentés comme éléments graphiques, sans déduire de relation contractuelle.</p><div class="stat-strip"><div class="stat"><strong>Marseille</strong><span>Ville de départ mise en avant</span></div><div class="stat"><strong>${esc(DATA.destinations.length)}</strong><span>Destinations de démonstration</span></div><div class="stat"><strong>${esc(DATA.posts.length)}</strong><span>Publications reprises</span></div></div></div></div></section>`);
}

function renderContact(){
  $('#app').innerHTML = shell('Contact','contact',`${pageHero('Contact','Construisons votre voyage.','Décrivez votre projet et préparez une demande personnalisée.')}
  <section class="section"><div class="container contact"><div class="info-box"><div class="kicker">Parlons de votre projet</div><h2>Une question ? Une destination ?</h2><p>Appelez directement l’agence ou utilisez le formulaire pour préparer votre demande.</p><p>${icon('pin')} <strong>${esc(DATA.agency.address)}</strong></p><p>${icon('phone')} <a href="tel:+33465859350">${esc(DATA.agency.phone)}</a></p><a class="btn btn-primary" href="tel:+33465859350">${icon('phone')} Appeler maintenant</a></div>
  <div class="info-box"><form id="form"><div class="form-row"><div class="input"><label for="name">Nom</label><input id="name" name="name" required autocomplete="name"></div><div class="input"><label for="phone">Téléphone</label><input id="phone" name="phone" autocomplete="tel"></div></div><div class="input"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email"></div><div class="form-row"><div class="input"><label for="destination">Destination</label><input id="destination" name="destination" placeholder="Ex. Le Caire"></div><div class="input"><label for="period">Période</label><input id="period" name="period" placeholder="Ex. Novembre 2026"></div></div><div class="input"><label for="message">Votre projet</label><textarea id="message" name="message" required placeholder="Nombre de voyageurs, envies, budget indicatif…"></textarea></div><button class="btn btn-primary" type="submit">Préparer ma demande ${icon('arrow')}</button><p class="meta">Le formulaire ouvre votre messagerie avec les informations saisies. Aucun envoi automatique n’est effectué par GitHub Pages.</p></form></div></div></section>`);
  const destination = new URLSearchParams(location.search).get('destination'); if(destination) $('#destination').value=destination;
  $('#form').addEventListener('submit', handleFormSubmit);
}

function filterItems(items,q,type){return items.filter(x=>{const hay=[x.name,x.title,x.description,x.text,x.region].join(' ').toLowerCase();return (!q||hay.includes(q))&&(!type||x.category===type);});}
function filterDest(cat,btn){$$('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#destGrid').innerHTML=cards(cat==='all'?DATA.destinations:DATA.destinations.filter(x=>x.category===cat));}
function search(){const q=($('#q')?.value||'').trim();const type=$('#type')?.value||'';const params=new URLSearchParams();if(q)params.set('q',q);if(type)params.set('type',type);location.href='destinations.html'+(params.toString()?`?${params.toString()}`:'');}
function toggleMenu(button){const nav=$('#mainNav');const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.textContent=open?'×':'☰';document.body.classList.toggle('menu-open',open);}
function handleFormSubmit(event){event.preventDefault();const data=new FormData(event.currentTarget);const body=[...data.entries()].map(([key,value])=>`${key}: ${value}`).join('\n');const subject='Demande de voyage — New Age Travel France';location.href='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);}

load().catch(error=>{console.error(error);document.getElementById('app').innerHTML=`<main class="section"><div class="container empty"><h1>Le site n’a pas pu charger ses données.</h1><p>Vérifiez que <strong>data.json</strong> est bien à la racine du projet et ouvrez le site via GitHub Pages ou un serveur local.</p></div></main>`;});
