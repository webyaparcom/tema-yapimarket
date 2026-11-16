/* faq-2 — iki sütun SSS, yerel <details>. data[] = { soru:{tr,en}, cevap:{tr,en} }. Statik: ağ isteği yok. */
var fq2D = json && json.desing && typeof json.desing === "object" ? json.desing : {};
var fq2L = json && json.lang ? String(json.lang) : "tr";
/* dil seçimi: motorun wmPickLang'i (aktif dil → tr → en → ilk anahtar) */
function fq2T(v) {
  return String(wmPickLang(v, fq2L) || "").trim();
}
/* HTML kaçışı — HTML'e giren HER değer buradan geçer */
function fq2E(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/* çok satırlı metin: kaçış + satır sonu → <br> */
function fq2Br(s) {
  return fq2E(s).replace(/\r?\n/g, "<br>");
}
/* bağlantı: yalın slug → aktif dil önekli iç yol; javascript:/data: reddedilir */
function fq2U(raw) {
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
function fq2Img(v) {
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
function fq2Ic(v) {
  return String(v == null ? "" : v).toLowerCase().replace(/[^a-z0-9_]/g, "");
}
function fq2Bool(v, d) {
  if (v === undefined || v === null || v === "") {
    return d;
  }
  return !(v === false || v === "false" || v === 0 || v === "0");
}
/* yer tutucu değişimi (split/join: değerdeki $ desenleri yorumlanmaz) */
function fq2R(k, v) {
  html = html.split("{{" + k + "}}").join(v);
}
/* bölüm başlığı: eyebrow + h2 + açıklama; boşsa hiç basılmaz */
function fq2Head(cls, tid) {
  var eb = fq2T(fq2D.eyebrow);
  var ti = fq2T(fq2D.title);
  var de = fq2T(fq2D.description);
  if (!eb && !ti && !de) {
    return "";
  }
  return '<header class="' + cls + '__head">' +
    (eb ? '<p class="' + cls + '__eyebrow">' + fq2E(eb) + "</p>" : "") +
    (ti ? '<h2 class="' + cls + '__h2" id="' + tid + '">' + fq2E(ti) + "</h2>" : "") +
    (de ? '<p class="' + cls + '__desc">' + fq2Br(de) + "</p>" : "") +
    "</header>";
}
/* section erişilebilir adı: başlık varsa aria-labelledby, yoksa aria-label */
function fq2Label(tid, yedek) {
  if (fq2T(fq2D.title)) {
    return 'aria-labelledby="' + tid + '"';
  }
  return 'aria-label="' + fq2E(yedek) + '"';
}

var fq2Tid = "fq2-" + json.id + "-t";
var fq2Rows = Array.isArray(json.data) ? json.data : [];
var fq2Ilk = fq2Bool(fq2D.ilkAcik, true);
var fq2Items = "";
var fq2n = 0;
for (var fq2i = 0; fq2i < fq2Rows.length; fq2i++) {
  var fq2It = fq2Rows[fq2i] || {};
  var fq2Soru = fq2T(fq2It.soru);
  var fq2Cevap = fq2T(fq2It.cevap);
  if (!fq2Soru || !fq2Cevap) {
    continue;
  }
  fq2Items += '<details class="modulex-fq2__item"' + (fq2Ilk && fq2n === 0 ? " open" : "") + ">" +
    '<summary class="modulex-fq2__q"><span>' + fq2E(fq2Soru) + '</span><span class="modulex-fq2__ic" aria-hidden="true"><span class="material-symbols-outlined">add</span></span></summary>' +
    '<div class="modulex-fq2__a"><p>' + fq2Br(fq2Cevap) + "</p></div>" +
    "</details>";
  fq2n++;
}
var fq2CtaUrl = fq2U(fq2D.ctaUrl);
var fq2CtaText = fq2T(fq2D.ctaText);
fq2R("fq2label", fq2Label(fq2Tid, "SSS"));
fq2R("fq2head", fq2Head("modulex-fq2", fq2Tid));
fq2R("fq2cta", fq2CtaUrl && fq2CtaText ? '<a class="modulex-fq2__cta" href="' + fq2E(fq2CtaUrl) + '">' + fq2E(fq2CtaText) + ' <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span></a>' : "");
fq2R("fq2items", fq2Items);
