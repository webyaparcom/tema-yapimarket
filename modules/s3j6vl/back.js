/* team-3 — ekip liste satırları. data[] = { ad, unvan:{tr,en}, bio:{tr,en}, img, eposta, url, urlLabel:{tr,en} }
   img yoksa ad baş harfleri. Statik: ağ isteği yok. */
var tm3D = json && json.desing && typeof json.desing === "object" ? json.desing : {};
var tm3L = json && json.lang ? String(json.lang) : "tr";
/* dil seçimi: motorun wmPickLang'i (aktif dil → tr → en → ilk anahtar) */
function tm3T(v) {
  return String(wmPickLang(v, tm3L) || "").trim();
}
/* HTML kaçışı — HTML'e giren HER değer buradan geçer */
function tm3E(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* çok satırlı metin: kaçış + satır sonu → <br> */
function tm3Br(s) {
  return tm3E(s).replace(/\r?\n/g, "<br>");
}
/* bağlantı: yalın slug → aktif dil önekli iç yol; javascript:/data: reddedilir */
function tm3U(raw) {
  var s = String(raw == null ? "" : raw).trim();
  if (!s || /^(javascript|vbscript|data|file):/i.test(s)) {
    return "";
  }
  if (s.charAt(0) === "#" || /^(https?:)?\/\//i.test(s) || /^(mailto:|tel:)/i.test(s)) {
    return s;
  }
  s = s.replace(/^\/[a-z]{2}(\/|$)/i, "/");
  return wxLangInternalHref(s);
}
/* görsel: yalın ad → /img/<modül id>/<ad>; kök yol / tam URL olduğu gibi */
function tm3Img(v) {
  var s = String(v == null ? "" : v).trim();
  if (!s || /^(javascript|vbscript|file):/i.test(s)) {
    return "";
  }
  if (/^data:/i.test(s)) {
    return /^data:image\//i.test(s) ? s : "";
  }
  if (s.charAt(0) === "/" || /^https?:\/\//i.test(s)) {
    return s;
  }
  return "/img/" + json.id + "/" + s;
}
/* Material Symbols ikon adı: yalnız [a-z0-9_] */
function tm3Ic(v) {
  return String(v == null ? "" : v).toLowerCase().replace(/[^a-z0-9_]/g, "");
}
function tm3Bool(v, d) {
  if (v === undefined || v === null || v === "") {
    return d;
  }
  return !(v === false || v === "false" || v === 0 || v === "0");
}
/* yer tutucu değişimi (split/join: değerdeki $ desenleri yorumlanmaz) */
function tm3R(k, v) {
  html = html.split("{{" + k + "}}").join(v);
}
/* bölüm başlığı: eyebrow + h2 + açıklama; boşsa hiç basılmaz */
function tm3Head(cls, tid) {
  var eb = tm3T(tm3D.eyebrow);
  var ti = tm3T(tm3D.title);
  var de = tm3T(tm3D.description);
  if (!eb && !ti && !de) {
    return "";
  }
  return '<header class="' + cls + '__head">' +
    (eb ? '<p class="' + cls + '__eyebrow">' + tm3E(eb) + "</p>" : "") +
    (ti ? '<h2 class="' + cls + '__h2" id="' + tid + '">' + tm3E(ti) + "</h2>" : "") +
    (de ? '<p class="' + cls + '__desc">' + tm3Br(de) + "</p>" : "") +
    "</header>";
}
/* section erişilebilir adı: başlık varsa aria-labelledby, yoksa aria-label */
function tm3Label(tid, yedek) {
  if (tm3T(tm3D.title)) {
    return 'aria-labelledby="' + tid + '"';
  }
  return 'aria-label="' + tm3E(yedek) + '"';
}

var tm3Tid = "tm3-" + json.id + "-t";
var tm3Rows = Array.isArray(json.data) ? json.data : [];
function tm3Bas(ad) {
  var p = String(ad).trim().split(/\s+/).filter(Boolean);
  if (!p.length) {
    return "";
  }
  var s = p[0].charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "");
  return s.toLocaleUpperCase(tm3L === "tr" ? "tr" : undefined);
}
var tm3Out = "";
for (var tm3i = 0; tm3i < tm3Rows.length; tm3i++) {
  var tm3It = tm3Rows[tm3i] || {};
  var tm3Ad = tm3T(tm3It.ad || tm3It.name);
  if (!tm3Ad) {
    continue;
  }
  var tm3Unvan = tm3T(tm3It.unvan || tm3It.role);
  var tm3Bio = tm3T(tm3It.bio);
  var tm3Foto = tm3Img(tm3It.img);
  var tm3Mail = String(tm3It.eposta || "").trim();
  if (!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(tm3Mail)) {
    tm3Mail = "";
  }
  var tm3Url = tm3U(tm3It.url);
  var tm3UrlLabel = tm3T(tm3It.urlLabel) || "Profil";
  var tm3Links = "";
  if (tm3Mail) {
    tm3Links += '<a class="modulex-tm3__link" href="mailto:' + tm3E(tm3Mail) + '" aria-label="' + tm3E((tm3T(tm3D.epostaLabel) || "E-posta") + ": " + tm3Ad) + '"><span class="material-symbols-outlined" aria-hidden="true">mail</span></a>';
  }
  if (tm3Url) {
    var tm3Dis = /^(https?:)?\/\//i.test(tm3Url);
    tm3Links += '<a class="modulex-tm3__link" href="' + tm3E(tm3Url) + '"' + (tm3Dis ? ' target="_blank" rel="noopener noreferrer"' : "") + ' aria-label="' + tm3E(tm3UrlLabel + ": " + tm3Ad) + '"><span class="material-symbols-outlined" aria-hidden="true">' + (tm3Dis ? "open_in_new" : "arrow_forward") + "</span></a>";
  }
  tm3Out += '<li class="modulex-tm3__row">' +
    '<div class="modulex-tm3__av" aria-hidden="true">' + (tm3Foto ? '<img src="' + tm3E(tm3Foto) + '" alt="" loading="lazy" decoding="async" width="64" height="64">' : tm3E(tm3Bas(tm3Ad))) + "</div>" +
    '<div class="modulex-tm3__who"><h3 class="modulex-tm3__name">' + tm3E(tm3Ad) + "</h3>" + (tm3Unvan ? '<p class="modulex-tm3__role">' + tm3E(tm3Unvan) + "</p>" : "") + "</div>" +
    (tm3Bio ? '<p class="modulex-tm3__bio">' + tm3Br(tm3Bio) + "</p>" : '<span aria-hidden="true"></span>') +
    (tm3Links ? '<div class="modulex-tm3__links">' + tm3Links + "</div>" : "") +
    "</li>";
}
tm3R("tm3label", tm3Label(tm3Tid, tm3T(tm3D.listeLabel) || "Ekip"));
tm3R("tm3head", tm3Head("modulex-tm3", tm3Tid));
tm3R("tm3listelabel", tm3E(tm3T(tm3D.listeLabel) || "Ekip üyeleri"));
tm3R("tm3rows", tm3Out);
