// Ahmed Hassan Mohamed - Portfolio
// Theme toggle, mobile nav, scroll effects, reveal animations,
// scroll-spy, back-to-top, contact form.

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme toggle (persisted) ---------- */
  var THEME_KEY = "ahmedhassan-theme";
  var themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* noop */ }
  }

  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* noop */ }
  applyTheme(saved === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Navbar scrolled state + back-to-top ---------- */
  var navbar = document.getElementById("navbar");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    navbar.classList.toggle("scrolled", y > 10);
    backToTop.classList.toggle("visible", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Scroll spy (active nav link) ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navAnchors = navLinks.querySelectorAll("a[href^='#']");

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navAnchors.forEach(function (a) {
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + id
            );
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- EmailJS configuration ----------
     1. Create a free account: https://www.emailjs.com
     2. Connect your Yahoo email (Email Services) -> note the Service ID
     3. Create an email template with these variables:
        <p>{{message}}</p>
        From: {{name}}  ({{reply_to}})
        and set "To Email Field" to:  {{to_email}}
        -> note the Template ID
     4. Account -> General -> copy your Public Key
     Paste all three below, replacing the placeholders.               */
  var EMAILJS_PUBLIC_KEY = "oi1SrDvLKVlT-tmqp";
  var EMAILJS_SERVICE_ID = "default_service";
  var EMAILJS_TEMPLATE_ID = "template_qbzar65";
  var TO = "ahmedhassan115103@yahoo.com";

  /* ---------- Contact form (EmailJS, mailto fallback) ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("cname");
    var email = document.getElementById("cemail");
    var subject = document.getElementById("csubject");
    var message = document.getElementById("cmessage");

    if (!name.value.trim() || !email.value.trim() ||
        !subject.value.trim() || !message.value.trim()) {
      status.textContent = "Please fill in all fields.";
      status.className = "form-status err";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      status.textContent = "Please enter a valid email address.";
      status.className = "form-status err";
      return;
    }

    var btn = form.querySelector('button[type="submit"]');

    /* Fallback: open the visitor's mail client pre-filled */
    function fallbackMailto() {
      var body = encodeURIComponent(
        "Name: " + name.value.trim() +
        "\nEmail: " + email.value.trim() +
        "\n\n" + message.value.trim()
      );
      window.location.href =
        "mailto:" + TO +
        "?subject=" + encodeURIComponent("[Portfolio] " + subject.value.trim()) +
        "&body=" + body;
      status.textContent =
        "Your email client should open - your message is ready to send.";
      status.className = "form-status ok";
    }

    if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" ||
        window.emailjs === undefined) {
      status.textContent =
        "EmailJS is not configured yet. Opening your email client instead...";
      status.className = "form-status";
      fallbackMailto();
      return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";
    status.textContent = "Sending your message...";
    status.className = "form-status";

    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: TO,
        from_name: name.value.trim(),
        reply_to: email.value.trim(),
        message: message.value.trim(),
        subject: subject.value.trim()
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    )
      .then(function () {
        status.textContent =
          "Thank you! Your message has been sent to my email.";
        status.className = "form-status ok";
        form.reset();
      })
      .catch(function (err) {
        console.error("EmailJS error:", err);
        status.textContent =
          "Sending failed. Opening your email client instead...";
        status.className = "form-status err";
        fallbackMailto();
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = "Send Message";
      });
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
