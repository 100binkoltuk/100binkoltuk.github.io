/* Kartallar FC amblemi (özgün çizim): uçuşta kartal, kanatlar açık, baş sağa, beyaz baş ve kuyruk.
   window.amblemCiz(ctx, cx, cy, R, {mozaik})  · mozaik: tek renk siluet (koltuk deseni için) */
(function (g) {
  var C = [278, 282];                         // çizim uzayının merkezi (yaklaşık 550 birimlik kutu)
  function tuval(w, h) { if (g.__tuval) return g.__tuval(w, h); var c = g.document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function boyunca(a, b, n) { var r = []; for (var i = 0; i < n; i++) r.push(lerp(a, b, n === 1 ? 0 : i / (n - 1))); return r; }
  // tüy: tabandan uca, kenarları hafif kavisli sivri bıçak
  function tuy(c, b, t, w) {
    var dx = t[0] - b[0], dy = t[1] - b[1], L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2;
    c.moveTo(b[0] + nx, b[1] + ny);
    c.quadraticCurveTo(b[0] + dx * .7 + nx * 1.1, b[1] + dy * .7 + ny * 1.1, t[0], t[1]);
    c.quadraticCurveTo(b[0] + dx * .7 - nx * 1.1, b[1] + dy * .7 - ny * 1.1, b[0] - nx, b[1] - ny);
    c.closePath();
  }
  function yumusak(c, P) {   // noktalardan geçen yumuşak kapalı eğri
    var n = P.length, m = function (i) { var a = P[i % n], b = P[(i + 1) % n]; return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; };
    var s = m(n - 1); c.moveTo(s[0], s[1]);
    for (var i = 0; i < n; i++) { var e = m(i); c.quadraticCurveTo(P[i][0], P[i][1], e[0], e[1]); }
    c.closePath();
  }
  function keskin(c, P) { c.moveTo(P[0][0], P[0][1]); for (var i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.closePath(); }

  var K = {
    yakinPrim: { taban: [[232, 192], [214, 140]], uc: [[26, 172], [28, 130], [46, 91], [74, 58], [108, 33], [146, 19], [184, 24]], w: 30 },
    yakinIkin: { taban: [[322, 318], [238, 205]], uc: [[302, 392], [256, 392], [210, 380], [165, 357], [122, 326], [84, 288], [52, 242]], w: 36 },
    uzakPrim:  { taban: [[438, 198], [470, 208]], uc: [[398, 102], [426, 85], [457, 73], [489, 68], [514, 80], [527, 116]], w: 24 },
    uzakIkin:  { taban: [[352, 298], [452, 214]], uc: [[392, 296], [424, 272], [456, 244], [488, 212], [516, 172]], w: 28 },
    kuyruk:    { taban: [[282, 404], [302, 440]], uc: [[104, 466], [108, 494], [128, 516], [162, 528], [198, 526], [232, 514]], w: 32 },
    yakinOmuz: [[356, 342], [318, 304], [268, 248], [230, 184], [204, 118], [222, 114], [252, 160], [294, 214], [342, 262], [374, 294]],
    uzakOmuz:  [[338, 304], [382, 250], [432, 204], [474, 178], [486, 196], [444, 238], [394, 288], [356, 314]],
    govde: [[300, 300], [345, 284], [382, 300], [402, 336], [406, 382], [396, 426], [368, 452], [330, 450], [298, 420], [278, 375], [280, 330]],
    but: [[346, 418], [394, 410], [418, 462], [400, 482], [362, 470]],
    bas: [[350, 306], [366, 290], [400, 283], [434, 290], [458, 306], [466, 322], [458, 344], [442, 352], [428, 364], [414, 376], [406, 362], [397, 380], [388, 364], [377, 381], [369, 362], [358, 372], [352, 344]],
    gaga: [[452, 308], [471, 314], [484, 327], [490, 344], [484, 360], [477, 347], [466, 341], [450, 343]],
    pence: [[[402, 474], [436, 492], [446, 506]], [[410, 482], [426, 510], [424, 524]], [[396, 484], [392, 510], [384, 520]], [[392, 470], [374, 486], [366, 494]]]
  };
  function grup(c, G, rnk, cizgi, cw) {   // tüy grubu: her tüy dolgu + ayrım çizgisi
    var tb = boyunca(G.taban[0], G.taban[1], G.uc.length);
    for (var i = 0; i < G.uc.length; i++) { c.beginPath(); tuy(c, tb[i], G.uc[i], G.w); c.fillStyle = rnk; c.fill(); if (cizgi) { c.strokeStyle = cizgi; c.lineWidth = cw; c.stroke(); } }
  }
  function ortu(c, G, oran, w, rnk, cizgi, cw) {   // örtü tüyleri: ana tüylerin kısa kopyası
    var tb = boyunca(G.taban[0], G.taban[1], G.uc.length);
    for (var i = G.uc.length - 1; i >= 0; i--) { c.beginPath(); tuy(c, tb[i], lerp(tb[i], G.uc[i], oran), w); c.fillStyle = rnk; c.fill(); if (cizgi) { c.strokeStyle = cizgi; c.lineWidth = cw; c.stroke(); } }
  }
  function pul(c, a, b, yon, L, w, rnk, cizgi) {   // kanat ön kenarı boyunca küçük örtü tüyleri
    var n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / (w * .8));
    for (var i = 0; i < n; i++) { var p = lerp(a, b, i / (n - 1)); c.beginPath(); tuy(c, p, [p[0] + yon[0] * L, p[1] + yon[1] * L], w); c.fillStyle = rnk; c.fill(); c.strokeStyle = cizgi; c.lineWidth = 1.6; c.stroke(); }
  }
  function sekil(c, P, rnk, cizgi, cw, sert) { c.beginPath(); (sert ? keskin : yumusak)(c, P); c.fillStyle = rnk; c.fill(); if (cizgi) { c.strokeStyle = cizgi; c.lineWidth = cw; c.lineJoin = 'round'; c.stroke(); } }

  // tam renk: koyu tüyler + açık ayrım çizgileri, beyaz baş ve kuyruk koyu konturlu
  function kartalTam(c, KOYU, ACIK) {
    var ac = ACIK, kz = KOYU;
    grup(c, K.uzakIkin, kz, ac, 2.2); grup(c, K.uzakPrim, kz, ac, 2.2); sekil(c, K.uzakOmuz, kz);
    ortu(c, K.uzakIkin, .55, 26, kz, ac, 1.8); ortu(c, K.uzakPrim, .3, 22, kz, ac, 1.6);
    pul(c, [474, 184], [350, 300], [ .55, .85], 34, 24, kz, ac);
    grup(c, K.kuyruk, ac, kz, 3);
    grup(c, K.yakinIkin, kz, ac, 2.4); grup(c, K.yakinPrim, kz, ac, 2.4); sekil(c, K.yakinOmuz, kz);
    ortu(c, K.yakinIkin, .62, 32, kz, ac, 2); ortu(c, K.yakinPrim, .4, 28, kz, ac, 1.8); ortu(c, K.yakinIkin, .36, 28, kz, ac, 1.8);
    pul(c, [214, 120], [352, 322], [-.75, .62], 46, 30, kz, ac);
    sekil(c, K.govde, kz, ac, 1.8);
    for (var y = 330, j = 0; y < 440; y += 26, j++) for (var x = 300 + (j % 2) * 14; x < 392; x += 28) {   // göğüs tüyleri
      c.beginPath(); c.moveTo(x - 10, y - 6); c.quadraticCurveTo(x, y + 8, x + 10, y - 6); c.strokeStyle = ac; c.lineWidth = 1.6; c.stroke(); }
    sekil(c, K.but, kz, ac, 1.8);
    c.lineCap = 'round';
    K.pence.forEach(function (p) { c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.quadraticCurveTo(p[1][0], p[1][1], p[2][0], p[2][1]); c.strokeStyle = kz; c.lineWidth = 12; c.stroke(); c.strokeStyle = '#d9dce0'; c.lineWidth = 7; c.stroke(); });
    K.pence.forEach(function (p) { var dx = p[2][0] - p[1][0], dy = p[2][1] - p[1][1], L = Math.hypot(dx, dy); dx /= L; dy /= L;   // siyah tırnak
      c.beginPath(); c.moveTo(p[2][0] - dy * 5, p[2][1] + dx * 5); c.quadraticCurveTo(p[2][0] + dx * 14, p[2][1] + dy * 14, p[2][0] + dx * 8 + dy * 10, p[2][1] + dy * 8 - dx * 10);
      c.lineTo(p[2][0] + dy * 5, p[2][1] - dx * 5); c.closePath(); c.fillStyle = kz; c.fill(); });
    sekil(c, K.bas, ac, kz, 4, true);
    sekil(c, K.gaga, ac, kz, 4, true);
    c.beginPath(); c.moveTo(452, 336); c.quadraticCurveTo(466, 334, 476, 342); c.strokeStyle = kz; c.lineWidth = 3; c.stroke();
    c.beginPath(); c.moveTo(424, 322); c.quadraticCurveTo(436, 314, 448, 322); c.quadraticCurveTo(436, 328, 424, 322); c.fillStyle = kz; c.fill();   // göz
    c.beginPath(); c.moveTo(416, 312); c.lineTo(452, 316); c.lineWidth = 4; c.stroke();                                                          // kaş
  }
  // mozaik: tek renk siluet; kanat tüyleri arasında kesik boşluk, baş çevresinde ince boşluk
  function kartalMozaik(c, R) {
    var r = c.fillStyle, kes = function (f) { c.save(); c.globalCompositeOperation = 'destination-out'; f(); c.restore(); };
    [K.uzakIkin, K.uzakPrim, K.kuyruk, K.yakinIkin, K.yakinPrim].forEach(function (G) { grup(c, { taban: G.taban, uc: G.uc, w: G.w * 1.35 }, r); });
    sekil(c, K.uzakOmuz, r); sekil(c, K.yakinOmuz, r); sekil(c, K.govde, r); sekil(c, K.but, r);
    K.pence.forEach(function (p) { c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.quadraticCurveTo(p[1][0], p[1][1], p[2][0], p[2][1]); c.strokeStyle = r; c.lineWidth = 14; c.lineCap = 'round'; c.stroke(); });
    // baş: kontur boşluğu + dolgu + göz
    kes(function () { c.beginPath(); keskin(c, K.bas); c.lineWidth = 16; c.lineJoin = 'round'; c.stroke(); });
    c.beginPath(); keskin(c, K.bas); c.strokeStyle = r; c.lineWidth = 17; c.lineJoin = 'round'; c.stroke();
    sekil(c, K.gaga, r, null, 0, true);
    c.beginPath(); c.arc(434, 320, 10, 0, 7); c.fillStyle = r; c.fill();
  }
  function kartalCiz(ctx, cx, cy, olcek, mozaik, dolgu, koyu, acik) {
    var w = Math.ceil(600 * olcek) + 4, t = tuval(w, w), c = t.getContext('2d');
    c.translate(w / 2, w / 2); c.scale(olcek, olcek); c.translate(-C[0], -C[1]);
    if (mozaik) { c.fillStyle = dolgu; kartalMozaik(c); } else kartalTam(c, koyu, acik);
    ctx.drawImage(t, cx - w / 2, cy - w / 2);
  }
  function halka(c, cx, cy, r, w) { c.lineWidth = w; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke(); }
  function yayYazi(c, txt, cx, cy, r, orta, ara, alt) {
    var i, w = [], top = 0; for (i = 0; i < txt.length; i++) { w[i] = c.measureText(txt[i]).width + ara; top += w[i]; } top -= ara;
    var yon = alt ? -1 : 1, a = orta - yon * top / r / 2;
    for (i = 0; i < txt.length; i++) { var ang = a + yon * (w[i] - ara) / r / 2;
      c.save(); c.translate(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r); c.rotate(ang + (alt ? -Math.PI / 2 : Math.PI / 2)); c.fillText(txt[i], 0, 0); c.restore();
      a += yon * w[i] / r; }
  }
  function tam(c, cx, cy, R) {
    var KOYU = '#0b0b0d', BEYAZ = '#ffffff';
    c.fillStyle = KOYU; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill();
    var gm = c.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    gm.addColorStop(0, '#ffffff'); gm.addColorStop(.5, '#b9bdc4'); gm.addColorStop(1, '#f2f3f5');
    c.strokeStyle = gm; halka(c, cx, cy, R * .965, R * .028); halka(c, cx, cy, R * .905, R * .008);
    // iç beyaz alan
    var ic = R * .69, ig = c.createRadialGradient(cx - ic * .3, cy - ic * .4, ic * .1, cx, cy, ic);
    ig.addColorStop(0, '#ffffff'); ig.addColorStop(1, '#dfe2e6');
    c.fillStyle = ig; c.beginPath(); c.arc(cx, cy, ic, 0, Math.PI * 2); c.fill();
    c.strokeStyle = gm; halka(c, cx, cy, ic, R * .022);
    c.fillStyle = BEYAZ; c.textAlign = 'center'; c.textBaseline = 'middle';
    var ry = R * .80;
    c.font = Math.round(R * .15) + "px Anton, Impact, 'Arial Black', sans-serif"; yayYazi(c, 'KARTALLAR FC', cx, cy, ry, -Math.PI / 2, R * .03, false);
    c.font = Math.round(R * .095) + "px Anton, Impact, 'Arial Black', sans-serif"; yayYazi(c, '100.000', cx, cy, ry, Math.PI / 2, R * .05, true);
    // kartal: kanat uçları iç alanın dışına taşar (iç halkanın üstüne)
    c.save(); c.beginPath(); c.arc(cx, cy, R * .74, 0, Math.PI * 2); c.clip();
    kartalCiz(c, cx - R * .02, cy + R * .03, R * 1.3 / 600, false, null, KOYU, BEYAZ);
    c.restore();
  }
  function mozaik(c, cx, cy, R) {
    c.beginPath(); c.arc(cx, cy, R * .98, 0, Math.PI * 2); c.arc(cx, cy, R * .87, 0, Math.PI * 2, true); c.fill('evenodd');
    kartalCiz(c, cx, cy + R * .02, R * 1.62 / 600, true, c.fillStyle);
  }
  g.amblemCiz = function (ctx, cx, cy, R, opts) { opts = opts || {}; ctx.save(); if (opts.mozaik) mozaik(ctx, cx, cy, R); else tam(ctx, cx, cy, R); ctx.restore(); };
})(typeof window !== 'undefined' ? window : globalThis);
