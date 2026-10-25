/* Ibris — script del sito. Niente librerie: menu del telefono, "aperto adesso", mappa a due click. */
(function () {
  "use strict";

  /* ---------- menu sul telefono ---------- */
  var bottone = document.querySelector(".apri-menu");
  if (bottone) {
    var chiudi = function () {
      document.body.classList.remove("menu-aperto");
      bottone.setAttribute("aria-expanded", "false");
      bottone.textContent = "Menu";
    };
    bottone.addEventListener("click", function () {
      var aperto = document.body.classList.toggle("menu-aperto");
      bottone.setAttribute("aria-expanded", aperto ? "true" : "false");
      bottone.textContent = aperto ? "Chiudi" : "Menu";
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") chiudi(); });
    document.querySelectorAll(".navigazione a").forEach(function (a) { a.addEventListener("click", chiudi); });
  }

  /* ---------- aperto adesso / chiuso (ora di Trento, anche se chi guarda e' altrove) ---------- */
  var ORARI = window.IBRIS_ORARI || {};
  var GIORNI = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

  function adessoATrento() {
    try {
      var parti = new Intl.DateTimeFormat("it-IT", {
        timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var v = {};
      parti.forEach(function (p) { v[p.type] = p.value; });
      var g = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"].indexOf(v.weekday.slice(0, 3).toLowerCase());
      var h = parseInt(v.hour, 10) % 24;
      if (g < 0) throw new Error("giorno");
      return { giorno: g, minuti: h * 60 + parseInt(v.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { giorno: d.getDay(), minuti: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function ora(m) {
    m = m % 1440;
    var h = Math.floor(m / 60), mm = m % 60;
    if (m === 0) return "mezzanotte";
    return (mm ? h + ":" + (mm < 10 ? "0" : "") + mm : String(h));
  }

  function statoDi(orari, adesso) {
    var oggi = orari[adesso.giorno] || [];
    var ieri = orari[(adesso.giorno + 6) % 7] || [];
    var i, f;
    // fasce di ieri che vanno oltre mezzanotte (venerdi' fino alle 2)
    for (i = 0; i < ieri.length; i++) {
      f = ieri[i];
      if (f[1] > 1440 && adesso.minuti < f[1] - 1440) return { aperto: true, fino: f[1] };
    }
    for (i = 0; i < oggi.length; i++) {
      f = oggi[i];
      if (adesso.minuti >= f[0] && adesso.minuti < f[1]) return { aperto: true, fino: f[1] };
    }
    for (i = 0; i < oggi.length; i++) {
      if (oggi[i][0] > adesso.minuti) return { aperto: false, riapre: "alle " + ora(oggi[i][0]) };
    }
    for (var k = 1; k <= 7; k++) {
      var g = (adesso.giorno + k) % 7, fasce = orari[g] || [];
      if (fasce.length) return { aperto: false, riapre: (k === 1 ? "domani" : GIORNI[g]) + " alle " + ora(fasce[0][0]) };
    }
    return { aperto: false, riapre: "" };
  }

  var adesso = adessoATrento();
  document.querySelectorAll("[data-stato]").forEach(function (el) {
    var loc = ORARI[el.getAttribute("data-stato")];
    if (!loc) return;
    var s = statoDi(loc.orari, adesso);
    var testo = el.querySelector(".stato-testo");
    if (s.aperto) {
      el.classList.add("aperto");
      testo.textContent = "Aperto adesso, fino " + (s.fino % 1440 === 0 ? "a mezzanotte" : "alle " + ora(s.fino));
    } else {
      testo.textContent = "Chiuso adesso" + (s.riapre ? ", riapre " + s.riapre : "");
    }
  });
  document.querySelectorAll(".orari tr[data-giorno='" + adesso.giorno + "']").forEach(function (tr) {
    tr.classList.add("oggi");
  });

  /* ---------- mappa a due click: Google si carica solo se la persona lo chiede ---------- */
  document.querySelectorAll("[data-mappa]").forEach(function (b) {
    b.addEventListener("click", function () {
      var box = b.closest(".mappa-due-click");
      var f = document.createElement("iframe");
      f.src = b.getAttribute("data-mappa");
      f.title = "Mappa di Google con i due locali Ibris in via Cavour";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.querySelector(".mappa-spazio").replaceChildren(f);
      b.remove();
    });
  });
})();
