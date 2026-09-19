/* Quiz — Part 1 del libro "Clingy No More!" (capitolo "Quiz: Discover Your Attachment Style"), testo VERBATIM.
   Scoring a maggioranza A/B/C/D; pareggi: C > D > B > A. Nessun risultato a schermo: il risultato viaggia nel campo nascosto del form. */
(function () {
  "use strict";

  var QUESTIONS = [
    { q: "When you’re in a relationship, how often do you worry about your partner’s feelings for you?",
      a: ["Rarely, I feel secure in my partner's feelings.",
          "Sometimes, but I usually trust my partner.",
          "Often, I frequently need reassurance.",
          "Very often, I constantly worry about being abandoned."] },
    { q: "How do you feel when your partner is emotionally distant or unresponsive?",
      a: ["Concerned, but I try to give them space.",
          "A bit worried, but I understand it happens.",
          "Anxious and scared, I feel like I’ve done something wrong.",
          "Angry or very hurt, I fear they are pulling away from me."] },
    { q: "How comfortable are you with expressing your needs and feelings to your partner?",
      a: ["Very comfortable, I believe in open communication.",
          "Comfortable, but I pick my moments.",
          "Sometimes comfortable, but I often hesitate for fear of rejection.",
          "Uncomfortable, I usually keep my feelings to myself."] },
    { q: "When you’re in a conflict with your partner, how do you usually respond?",
      a: ["I address the issue calmly and try to resolve it.",
          "I discuss it, but sometimes I avoid the topic if it’s too stressful.",
          "I get very emotional and find it hard to focus on anything else until it’s resolved.",
          "I tend to shut down or withdraw to avoid further conflict."] },
    { q: "How do you feel when your partner is away or busy with other things?",
      a: ["Fine, I enjoy my own time and trust in the relationship.",
          "Sometimes I miss them, but I know we’re okay.",
          "I start to feel anxious and wonder if they’re losing interest.",
          "I feel neglected or rejected, and it bothers me a lot."] },
    { q: "How would you describe your need for intimacy in a relationship?",
      a: ["I enjoy closeness but also value independence.",
          "I appreciate intimacy but sometimes need space.",
          "I crave closeness and often feel lonely when I don’t have it.",
          "I’m conflicted; I want intimacy but fear getting too close."] },
    { q: "When your partner doesn’t respond to your calls or messages right away, how do you react?",
      a: ["I’m okay with it, knowing they’ll respond when they can.",
          "I might get a little concerned but can wait.",
          "I start to feel anxious and wonder if they’re upset with me.",
          "I feel ignored and start to worry that something is wrong."] },
    { q: "How do you view your past relationships?",
      a: ["Mostly positive; I’ve learned and grown from them.",
          "Mixed, with some good and some difficult experiences.",
          "Filled with anxiety, I often felt insecure and worried.",
          "Confusing, I’ve had trouble finding stability in relationships."] },
    { q: "How do you feel about dependence in relationships?",
      a: ["I believe in interdependence, where both partners support each other.",
          "I’m comfortable with a balance of dependence and independence.",
          "I often feel too dependent on my partner for emotional support.",
          "I avoid dependence; I prefer to keep my distance emotionally."] },
    { q: "Reflecting on your childhood, how did your primary caregivers respond to your emotional needs?",
      a: ["They were consistently supportive and responsive.",
          "They were generally supportive, though not always perfect.",
          "They were inconsistent, sometimes they were there for me, other times not.",
          "They were often unavailable, distant, or unresponsive."] }
  ];
  var LETTERS = ["A", "B", "C", "D"];
  var TIE_ORDER = ["C", "D", "B", "A"];

  /* ---------- source tracking (?from=yt|ig) ---------- */
  var params = new URLSearchParams(location.search);
  var source = params.get("from") || "";
  try {
    if (source) sessionStorage.setItem("gg_source", source);
    else source = sessionStorage.getItem("gg_source") || "";
  } catch (e) {}
  if (!source) source = "direct";

  function track(name) {
    /* GoatCounter custom event (no cookies). Attivo solo quando lo script GoatCounter è caricato (C2). */
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true }); } catch (e) {}
  }
  track("landing:" + source);

  /* ---------- DOM ---------- */
  var $ = function (s) { return document.querySelector(s); };
  var intro = $("#q-intro"), stage = $("#q-stage"), gate = $("#q-gate");
  var bar = $("#q-bar"), num = $("#q-num"), qtext = $("#q-text"), answers = $("#q-answers"), back = $("#q-back");
  var form = $("#ml-form");
  var picks = [];
  var i = 0;

  function show(el) { [intro, stage, gate].forEach(function (x) { x.hidden = (x !== el); }); }

  function render() {
    var item = QUESTIONS[i];
    bar.style.width = ((i) / QUESTIONS.length * 100) + "%";
    num.textContent = "question " + (i + 1) + " of " + QUESTIONS.length;
    qtext.textContent = item.q;
    answers.innerHTML = "";
    item.a.forEach(function (text, k) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "ans" + (picks[i] === LETTERS[k] ? " picked" : "");
      b.setAttribute("data-letter", LETTERS[k]);
      b.innerHTML = "<b>" + LETTERS[k] + "</b><span></span>";
      b.querySelector("span").textContent = text;
      b.addEventListener("click", function () { pick(LETTERS[k], b); });
      answers.appendChild(b);
    });
    back.style.visibility = i === 0 ? "hidden" : "visible";
    stage.scrollIntoView({ block: "nearest" });
  }

  function pick(letter, btn) {
    picks[i] = letter;
    Array.prototype.forEach.call(answers.children, function (c) { c.classList.remove("picked"); });
    btn.classList.add("picked");
    setTimeout(function () {
      if (i < QUESTIONS.length - 1) { i++; render(); }
      else finish();
    }, 260);
  }

  function score() {
    var count = { A: 0, B: 0, C: 0, D: 0 };
    picks.forEach(function (l) { count[l]++; });
    var best = null, max = -1;
    TIE_ORDER.forEach(function (l) { if (count[l] > max) { max = count[l]; best = l; } });
    return best;
  }

  function finish() {
    var result = score();
    bar.style.width = "100%";
    $("#f-result").value = result;
    $("#f-source").value = source;
    show(gate);
    track("quiz-complete");
    gate.scrollIntoView({ block: "start" });
  }

  $("#q-start").addEventListener("click", function () {
    i = 0; picks = [];
    show(stage); render();
    track("quiz-start");
  });
  back.addEventListener("click", function () { if (i > 0) { i--; render(); } });

  /* Auto-start quando si arriva su /quiz (o con #start) */
  if (location.hash === "#start" || document.body.getAttribute("data-autostart") === "1") {
    $("#q-start").click();
  }

  /* ---------- form ---------- */
  var emailEl = $("#f-email"), consentEl = $("#f-consent"), errEl = $("#f-error"), btn = form.querySelector(".btn");
  var thankYou = "thank-you.html?from=" + encodeURIComponent(source);

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    errEl.hidden = true;
    if (!emailEl.checkValidity()) { emailEl.focus(); emailEl.reportValidity(); return; }
    if (!consentEl.checked) { consentEl.focus(); consentEl.reportValidity(); return; }
    track("email-submitted:" + source);
    btn.disabled = true;

    /* Invio a MailerLite senza caricare i suoi script: POST dei campi del form, poi thank-you.
       Se la richiesta fallisce (rete/CORS), invio nativo del form come fallback. */
    var body = new FormData(form);
    fetch(form.action, { method: "POST", body: body, mode: "cors", credentials: "omit" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.success === false) throw new Error("ml-rejected");
        location.href = thankYou;
      })
      .catch(function (e) {
        if (e && e.message === "ml-rejected") { btn.disabled = false; errEl.hidden = false; return; }
        form.submit();
      });
  });
})();
