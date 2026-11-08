/* Tasarım önizlemeleri için temsili "eski fotoğraf" çizimleri.
   Gerçek sitede bunların yerine Instagram'daki fotoğraf ve videolarınız gelecek. */
(function () {
  var K = "#3b2c20", K2 = "#5a4532", KR = "#efe2c4", KIR = "#8e3a27";
  var S = {};

  S.vapur =
    '<rect width="400" height="300" fill="#e6d3ab"/>' +
    '<circle cx="305" cy="78" r="34" fill="#f3e6c8"/>' +
    '<path d="M0 186 C60 166 120 160 200 168 C260 172 320 160 400 172 V192 H0Z" fill="#bea57b"/>' +
    '<path d="M112 174h76v-14h-76z M122 160 A28 26 0 0 1 178 160Z M112 162 A10 9 0 0 1 132 162Z M168 162 A10 9 0 0 1 188 162Z M148 134h4v-10h-4z M98 174V112h6v62z M97 112l4-18 4 18z M196 174V112h6v62z M195 112l4-18 4 18z" fill="#8f7552"/>' +
    '<path d="M262 176h56v-10h-56z M270 166 A20 18 0 0 1 310 166Z M254 176v-46h5v46z M253 130l3-13 3 13z M321 176v-46h5v46z M320 130l3-13 3 13z" fill="#9a7f5a"/>' +
    '<path d="M352 178v-54h18v54z M349 124l12-22 12 22z" fill="#8f7552"/>' +
    '<rect y="188" width="400" height="112" fill="#a88a5f"/>' +
    '<path d="M20 205h60M120 214h80M262 207h70M60 280h90M300 282h80M10 270h40" stroke="#c9ad80" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M60 228 L330 228 L310 258 L85 258 Z" fill="' + K + '"/>' +
    '<rect x="95" y="196" width="190" height="32" fill="' + KR + '"/>' +
    '<path d="M106 207h168" stroke="' + K + '" stroke-width="9" stroke-dasharray="11 7"/>' +
    '<rect x="125" y="182" width="120" height="14" fill="#e3d2ad"/>' +
    '<path d="M95 196h190" stroke="' + K + '" stroke-width="2"/>' +
    '<rect x="175" y="148" width="22" height="34" fill="' + K + '"/><rect x="175" y="156" width="22" height="7" fill="' + KR + '"/>' +
    '<path d="M186 144c-10-12 6-18-4-32c-8-10 4-16 0-26" stroke="#cbb48a" stroke-width="8" fill="none" stroke-linecap="round" opacity=".75"/>' +
    '<path d="M285 196v-24l15 5-15 5" fill="' + KIR + '" stroke="' + K + '" stroke-width="1.5"/>' +
    '<path d="M95 266h200" stroke="#8a6f4a" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M60 70q8-8 16 0q8-8 16 0M228 48q6-6 12 0q6-6 12 0M110 112q5-5 10 0q5-5 10 0" stroke="' + K2 + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';

  S.tramvay =
    '<rect width="400" height="300" fill="#e8d7b2"/>' +
    '<path d="M90 118h220v110H90z" fill="#cdb68c"/>' +
    '<path d="M104 132h14v18h-14zM132 132h14v18h-14zM254 132h14v18h-14zM282 132h14v18h-14zM104 164h14v18h-14zM282 164h14v18h-14z" fill="#a98d63"/>' +
    '<path d="M0 36h92v240H0z" fill="#b69b72"/>' +
    '<path d="M14 56h22v30H14zM54 56h22v30H54zM14 108h22v30H14zM54 108h22v30H54zM14 160h22v30H14zM54 160h22v30H54z" fill="#7d6344"/>' +
    '<path d="M308 16h92v260h-92z" fill="#a98d63"/>' +
    '<path d="M322 36h22v30h-22zM362 36h22v30h-22zM322 90h22v30h-22zM362 90h22v30h-22zM322 144h22v30h-22zM362 144h22v30h-22z" fill="#6f563a"/>' +
    '<path d="M0 64L400 58M0 72L400 66" stroke="' + K2 + '" stroke-width="1.5"/>' +
    '<rect y="262" width="400" height="38" fill="#8f7655"/>' +
    '<path d="M150 300L188 236M250 300L212 236" stroke="' + K2 + '" stroke-width="3"/>' +
    '<path d="M188 128L200 62L212 128" stroke="' + K + '" stroke-width="2.5" fill="none"/>' +
    '<rect x="130" y="138" width="140" height="98" rx="14" fill="#7a3f2c"/>' +
    '<rect x="164" y="124" width="72" height="16" rx="3" fill="' + K + '"/>' +
    '<text x="200" y="136.5" font-size="10.5" fill="' + KR + '" text-anchor="middle" font-family="Georgia,serif" letter-spacing="1.5">TAKSİM</text>' +
    '<rect x="145" y="152" width="110" height="40" rx="6" fill="' + KR + '"/>' +
    '<path d="M200 152v40" stroke="#7a3f2c" stroke-width="5"/>' +
    '<rect x="130" y="204" width="140" height="10" fill="#e3c88f"/>' +
    '<circle cx="200" cy="224" r="7" fill="#f3e6c8"/>' +
    '<rect x="140" y="236" width="120" height="10" fill="' + K + '"/>' +
    '<circle cx="60" cy="236" r="6" fill="#4a382a"/><path d="M53 270v-26q7-6 14 0v26z" fill="#4a382a"/>' +
    '<circle cx="340" cy="232" r="6" fill="#4a382a"/><path d="M331 226h18v-3h-18z" fill="#4a382a"/><path d="M333 270v-30q7-6 14 0v30z" fill="#4a382a"/>';

  S.mahalle =
    '<rect width="400" height="300" fill="#ead9b5"/>' +
    '<rect y="250" width="400" height="50" fill="#a58a63"/>' +
    '<rect x="20" y="110" width="150" height="140" fill="#c7ab7e"/>' +
    '<path d="M8 112L95 58L182 112z" fill="#6e5238"/>' +
    '<rect x="60" y="128" width="72" height="52" fill="#b29469" stroke="#6e5238" stroke-width="3"/>' +
    '<path d="M72 138h16v32H72zM104 138h16v32h-16z" fill="' + KR + '"/>' +
    '<rect x="38" y="194" width="28" height="56" fill="#6e5238"/>' +
    '<rect x="100" y="200" width="42" height="30" fill="' + KR + '" stroke="#6e5238" stroke-width="3"/>' +
    '<rect x="230" y="90" width="160" height="160" fill="#b89c70"/>' +
    '<path d="M220 92L310 44L400 92z" fill="#5f4630"/>' +
    '<path d="M250 110h30v40h-30zM300 110h30v40h-30zM350 110h26v40h-26zM250 176h30v40h-30zM350 176h26v40h-26z" fill="' + KR + '"/>' +
    '<rect x="300" y="190" width="32" height="60" fill="#5f4630"/>' +
    '<path d="M170 124Q200 142 230 124" stroke="' + K2 + '" stroke-width="1.5" fill="none"/>' +
    '<path d="M181 130h11v15h-11zM199 135h12v12h-12zM216 131h9v16h-9z" fill="' + KR + '" stroke="' + K2 + '"/>' +
    '<path d="M200 250V164M200 164q0-14 15-14" stroke="' + K + '" stroke-width="4" fill="none"/>' +
    '<path d="M209 150h14l-3 9h-8z" fill="' + K + '"/>' +
    '<circle cx="160" cy="231" r="6" fill="' + K + '"/><path d="M154 252v-15q6-5 12 0v15z" fill="' + K + '"/>' +
    '<circle cx="240" cy="236" r="5" fill="' + K + '"/><path d="M235 252v-11q5-4 10 0v11z" fill="' + K + '"/>' +
    '<circle cx="206" cy="246" r="5" fill="' + KR + '" stroke="' + K + '" stroke-width="2"/>';

  S.televizyon =
    '<rect width="400" height="300" fill="#dcc79f"/>' +
    '<path d="M20 0V200M60 0V200M100 0V200M140 0V200M180 0V200M220 0V200M260 0V200M300 0V200M340 0V200M380 0V200" stroke="#d1b98d" stroke-width="12"/>' +
    '<rect y="200" width="400" height="100" fill="#8a6c49"/>' +
    '<rect x="70" y="196" width="260" height="14" fill="#6b5034"/>' +
    '<rect x="86" y="210" width="228" height="80" fill="#7d6040"/>' +
    '<path d="M200 214v72" stroke="' + K2 + '" stroke-width="3"/>' +
    '<circle cx="190" cy="250" r="3" fill="#d9c49b"/><circle cx="210" cy="250" r="3" fill="#d9c49b"/>' +
    '<path d="M200 80L170 30M200 80L236 24" stroke="' + K + '" stroke-width="3"/>' +
    '<circle cx="170" cy="30" r="3.5" fill="' + K + '"/><circle cx="236" cy="24" r="3.5" fill="' + K + '"/>' +
    '<rect x="115" y="80" width="170" height="118" rx="14" fill="' + K2 + '"/>' +
    '<rect x="128" y="93" width="118" height="92" rx="16" fill="#cdbb99"/>' +
    '<path d="M136 110h102M136 125h102M136 140h102M136 155h102M136 170h102" stroke="#b8a37f" stroke-width="3"/>' +
    '<circle cx="266" cy="110" r="7" fill="#d9c49b"/><circle cx="266" cy="134" r="7" fill="#d9c49b"/>' +
    '<path d="M258 155h16M258 162h16M258 169h16M258 176h16" stroke="' + K + '" stroke-width="2"/>' +
    '<rect x="127" y="75" width="146" height="6" fill="#f3e9d2"/>' +
    '<path d="M127 80q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0q6 9 12 0" fill="#f3e9d2"/>' +
    '<path d="M146 76c0-16 20-16 20 0z" fill="#b9a37a"/><path d="M166 70l8-5v12z" fill="#b9a37a"/>' +
    '<path d="M300 196c-8-10-8-24 0-30h10c8 6 8 20 0 30z" fill="#a8452f"/>' +
    '<path d="M305 166v-24M305 150l-9-8M305 146l9-10" stroke="#5f6b3a" stroke-width="2.5" fill="none"/>' +
    '<circle cx="296" cy="141" r="5" fill="#d4a03c"/><circle cx="314" cy="135" r="5" fill="#d4a03c"/><circle cx="305" cy="139" r="5" fill="#e8d1a6"/>';

  S.kaset =
    '<rect width="400" height="300" fill="#d9c39a"/>' +
    '<path d="M40 262C100 200 140 300 200 252S300 228 340 276" stroke="' + K2 + '" stroke-width="5" fill="none"/>' +
    '<g transform="rotate(-8 200 150)">' +
    '<rect x="95" y="80" width="210" height="135" rx="10" fill="' + K + '"/>' +
    '<rect x="110" y="93" width="180" height="72" rx="5" fill="' + KR + '"/>' +
    '<path d="M122 108h96" stroke="#a8452f" stroke-width="5"/>' +
    '<path d="M122 122h150M122 132h120" stroke="#b8a37f" stroke-width="2.5"/>' +
    '<rect x="140" y="138" width="120" height="26" rx="13" fill="#8a6c49"/>' +
    '<circle cx="160" cy="151" r="15" fill="' + KR + '"/><circle cx="240" cy="151" r="15" fill="' + KR + '"/>' +
    '<circle cx="160" cy="151" r="6" fill="' + K + '"/><circle cx="240" cy="151" r="6" fill="' + K + '"/>' +
    '<path d="M135 215l10-28h110l10 28z" fill="' + K2 + '"/>' +
    '<circle cx="168" cy="204" r="4" fill="' + K + '"/><circle cx="232" cy="204" r="4" fill="' + K + '"/>' +
    '</g>' +
    '<g transform="rotate(32 320 236)"><rect x="252" y="228" width="128" height="14" fill="#d4a03c"/><path d="M380 228l18 7-18 7z" fill="#e8d1a6"/><path d="M392 233l6 2-6 2z" fill="' + K + '"/><rect x="242" y="228" width="12" height="14" fill="#a8452f"/></g>';

  S.bakkal =
    '<rect width="400" height="300" fill="#e8d7b2"/>' +
    '<rect x="30" y="40" width="340" height="232" fill="#c2a679"/>' +
    '<rect x="60" y="58" width="280" height="46" fill="' + K + '"/>' +
    '<text x="200" y="91" text-anchor="middle" font-family="Georgia,serif" font-size="30" font-weight="700" letter-spacing="7" fill="' + KR + '">BAKKAL</text>' +
    '<path d="M50 112h300l-12 30H62z" fill="#a8452f"/>' +
    '<path d="M80 112h24l-3 30H77zM130 112h24l-2 30h-24zM180 112h24v30h-24zM230 112h24l2 30h-24zM280 112h24l3 30h-24z" fill="' + KR + '"/>' +
    '<rect x="60" y="154" width="142" height="82" fill="' + KR + '" stroke="' + K + '" stroke-width="4"/>' +
    '<path d="M64 186h134M64 214h134" stroke="#8a6c49" stroke-width="3"/>' +
    '<rect x="72" y="166" width="14" height="19" rx="3" fill="#d4a03c"/><rect x="94" y="163" width="14" height="22" rx="3" fill="#a8452f"/><rect x="116" y="167" width="14" height="18" rx="3" fill="#8a6c49"/><rect x="138" y="164" width="14" height="21" rx="3" fill="#d4a03c"/><rect x="160" y="166" width="14" height="19" rx="3" fill="#a8452f"/>' +
    '<rect x="76" y="196" width="22" height="17" fill="#b29469"/><rect x="106" y="194" width="22" height="19" fill="#d4a03c"/><rect x="136" y="196" width="22" height="17" fill="#8a6c49"/><rect x="166" y="193" width="22" height="20" fill="#b29469"/>' +
    '<rect x="230" y="150" width="72" height="122" fill="' + K2 + '"/><rect x="240" y="160" width="52" height="54" fill="#e3d2ad"/><circle cx="292" cy="236" r="3.5" fill="#d9c49b"/>' +
    '<rect y="272" width="400" height="28" fill="#9a7f5a"/>' +
    '<rect x="70" y="244" width="62" height="30" fill="#8a6c49" stroke="' + K + '" stroke-width="2"/>' +
    '<path d="M80 244v-16h7v16zM96 244v-19h7v19zM112 244v-16h7v16z" fill="' + K + '"/>' +
    '<circle cx="326" cy="258" r="17" stroke="' + K + '" stroke-width="3" fill="none"/><circle cx="378" cy="258" r="17" stroke="' + K + '" stroke-width="3" fill="none"/>' +
    '<path d="M326 258L346 232L378 258M346 232h16M340 240h30M362 232l4-8h8" stroke="' + K + '" stroke-width="3" fill="none" stroke-linejoin="round"/>';

  S.telefon =
    '<rect width="400" height="300" fill="#d6bf94"/>' +
    '<circle cx="200" cy="180" r="112" fill="#efe5cf"/>' +
    '<circle cx="200" cy="180" r="100" fill="none" stroke="#d8c8a6" stroke-width="3" stroke-dasharray="4 6"/>' +
    '<circle cx="200" cy="180" r="84" fill="none" stroke="#e1d3b4" stroke-width="2" stroke-dasharray="2 5"/>' +
    '<g transform="rotate(-12 70 262)"><rect x="18" y="230" width="104" height="72" fill="#a8452f"/><rect x="24" y="236" width="92" height="60" fill="' + KR + '"/><path d="M34 250h70M34 262h58M34 274h66" stroke="#b8a37f" stroke-width="2"/></g>' +
    '<path d="M120 228L140 140H260L280 228Z" fill="' + K + '"/>' +
    '<circle cx="200" cy="186" r="37" fill="' + KR + '"/>' +
    '<g fill="' + K + '"><circle cx="224" cy="186" r="5"/><circle cx="220.8" cy="198" r="5"/><circle cx="212" cy="206.8" r="5"/><circle cx="200" cy="210" r="5"/><circle cx="188" cy="206.8" r="5"/><circle cx="179.2" cy="198" r="5"/><circle cx="176" cy="186" r="5"/><circle cx="179.2" cy="174" r="5"/><circle cx="188" cy="165.2" r="5"/><circle cx="200" cy="162" r="5"/></g>' +
    '<circle cx="200" cy="186" r="9" fill="#a8452f"/>' +
    '<path d="M108 136q0-24 24-24h136q24 0 24 24v8h-32v-9h-120v9h-32z" fill="#2e2219"/>' +
    '<path d="M280 214c30 10 10 30 40 40c30 10 10 30 40 30" stroke="#2e2219" stroke-width="4" fill="none"/>';

  S.araba =
    '<rect width="400" height="300" fill="#e7d5ae"/>' +
    '<circle cx="40" cy="120" r="42" fill="#a38a60"/><circle cx="84" cy="96" r="36" fill="#9c8259"/><circle cx="20" cy="80" r="30" fill="#a38a60"/>' +
    '<rect x="50" y="130" width="10" height="110" fill="#6e5238"/>' +
    '<circle cx="356" cy="104" r="44" fill="#9c8259"/><circle cx="320" cy="130" r="30" fill="#a38a60"/>' +
    '<rect x="352" y="130" width="10" height="110" fill="#6e5238"/>' +
    '<rect y="236" width="400" height="64" fill="#8f7655"/>' +
    '<path d="M0 240h400" stroke="#c2a679" stroke-width="5"/>' +
    '<path d="M30 276h50M130 276h50M230 276h50M330 276h50" stroke="#c2a679" stroke-width="4"/>' +
    '<path d="M126 194q12-44 56-46h44q40 2 58 46z" fill="' + KIR + '"/>' +
    '<path d="M142 192q10-32 42-34h18v34zM212 192v-34h16q30 2 44 34z" fill="' + KR + '"/>' +
    '<rect x="68" y="190" width="274" height="42" rx="18" fill="' + KIR + '"/>' +
    '<path d="M74 212h262" stroke="' + KR + '" stroke-width="3"/>' +
    '<rect x="60" y="222" width="22" height="8" rx="3" fill="#cdbb99"/><rect x="330" y="222" width="22" height="8" rx="3" fill="#cdbb99"/>' +
    '<circle cx="336" cy="202" r="7" fill="#f3e6c8"/>' +
    '<circle cx="126" cy="234" r="22" fill="#2e2219"/><circle cx="126" cy="234" r="9" fill="#cdbb99"/>' +
    '<circle cx="288" cy="234" r="22" fill="#2e2219"/><circle cx="288" cy="234" r="9" fill="#cdbb99"/>';

  window.SAHNELER = S;

  /* Canlı renk paleti: <html data-renk="canli"> olan sayfalarda sepya yerine kullanılır */
  var CANLI = {
    "#e6d3ab":"#8fd0e8","#e8d7b2":"#8fd0e8","#ead9b5":"#9ad7ec","#e7d5ae":"#8fd0e8",
    "#f3e6c8":"#ffd166","#bea57b":"#6fb07f","#8f7552":"#4f6d9a","#9a7f5a":"#7a8ca8",
    "#a88a5f":"#1f8fc4","#c9ad80":"#9fdcf2","#3b2c20":"#26304a","#efe2c4":"#fff8e7",
    "#e3d2ad":"#ffe3a3","#cbb48a":"#e9e9e9","#8e3a27":"#e63946","#8a6f4a":"#17699a",
    "#5a4532":"#3a3f5c","#cdb68c":"#f4b860","#a98d63":"#e76f51","#b69b72":"#f2a65a",
    "#7d6344":"#2a6f97","#6f563a":"#264653","#8f7655":"#6c757d","#7a3f2c":"#d62828",
    "#e3c88f":"#fcbf49","#4a382a":"#343a40","#a58a63":"#8ab17d","#c7ab7e":"#f6bd60",
    "#6e5238":"#9c3d2e","#b29469":"#f28482","#b89c70":"#84a59d","#5f4630":"#6d2e46",
    "#dcc79f":"#f7d6a6","#d1b98d":"#f2c48d","#8a6c49":"#a0522d","#6b5034":"#7a3e1d",
    "#7d6040":"#8b4513","#d9c49b":"#ffd166","#cdbb99":"#bfe3e0","#b8a37f":"#9cc9c4",
    "#f3e9d2":"#ffffff","#b9a37a":"#4cc9f0","#a8452f":"#e63946","#5f6b3a":"#2d6a4f",
    "#d4a03c":"#ffb703","#e8d1a6":"#ffe8c2","#d9c39a":"#e9c46a","#c2a679":"#f4a261",
    "#d6bf94":"#2a9d8f","#efe5cf":"#ffffff","#d8c8a6":"#e0e0e0","#e1d3b4":"#ececec",
    "#2e2219":"#1d1d1d","#a38a60":"#52b788","#9c8259":"#40916c"
  };
  function canliMi() { return document.documentElement.getAttribute("data-renk") === "canli"; }

  window.sahneSvg = function (ad) {
    var ic = S[ad] || S.mahalle;
    if (canliMi()) ic = ic.replace(/#[0-9a-f]{6}/gi, function (r) { return CANLI[r.toLowerCase()] || r; });
    return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + ic + "</svg>";
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-sahne]").forEach(function (el) {
      el.insertAdjacentHTML("afterbegin", window.sahneSvg(el.getAttribute("data-sahne")));
    });
  });
})();
