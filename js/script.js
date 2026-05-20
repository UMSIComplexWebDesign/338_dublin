/* =========================================================
   Shared site script:
   - Jump-to-top button visibility
   - Click-the-sheep baa sound
   ========================================================= */

(function () {
  "use strict";

  /* ---- Sheep click -> synthesized baa via Web Audio API ---- */
 function setupSheep() {
  var sheep = document.querySelector(".sheep-img") || document.querySelector(".sheep");
  if (!sheep) return;

  sheep.style.cursor = "pointer";

  function baa() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;

      var ctx = new AC();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      var t = ctx.currentTime;

      osc.type = "sawtooth";

      osc.frequency.setValueAtTime(210, t);
      osc.frequency.linearRampToValueAtTime(280, t + 0.07);
      osc.frequency.linearRampToValueAtTime(180, t + 0.30);
      osc.frequency.linearRampToValueAtTime(190, t + 0.55);

      filter.type = "bandpass";
      filter.frequency.value = 900;
      filter.Q.value = 1.2;

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.04);
      gain.gain.linearRampToValueAtTime(0.20, t + 0.40);
      gain.gain.linearRampToValueAtTime(0, t + 0.65);

      osc.connect(filter).connect(gain).connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.7);

      osc.onended = function () {
        if (ctx.close) ctx.close();
      };
    } catch (e) {}
  }

  // sheep.addEventListener("mouseover", function () {
  //   var sound = new Audio('audio/baa.mp3');
  //   sound.play();
  // });

  sheep.addEventListener("click", function () {
    var sound = new Audio('audio/sheep_go_blue.mp3');
    sound.play();
  });
}

  function setupJumpTop() {
    var btn = document.querySelector(".jump-top");
    if (!btn) return;

    function update() {
      if (window.scrollY > 280) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();

    btn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: reduce ? "auto" : "smooth"
      });
      var main = document.getElementById("main");
      if (main && typeof main.focus === "function") {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    });
  }

  function init() {
    setupJumpTop();
    setupSheep();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
