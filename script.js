/* NAUMAN — LUXURY PERSONAL PORTFOLIO | script.js (vanilla JavaScript) */
document.documentElement.classList.add("js");

function initializePortfolio() {
  "use strict";

  /* Contact details: email is assembled from separate parts */
  var emailAddress = ["0naumanali", "98"].join("") + "@" + ["gmail", "com"].join(".");
  document.querySelectorAll(".email-link").forEach(function (link) {
    link.href = "mailto:" + emailAddress;
  });

  /* WhatsApp links use their own data-message */
  var whatsappNumber = "923164387851";
  document.querySelectorAll(".whatsapp-link").forEach(function (link) {
    link.href = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(link.getAttribute("data-message") || "");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  /* Preselect the service in the form */
  var serviceDropdown = document.querySelector("#visitor-service");
  document.querySelectorAll(".service-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (!serviceDropdown) return;
      var name = (link.getAttribute("data-service") || link.textContent).trim().toLowerCase();
      var match = Array.from(serviceDropdown.options).find(function (o) {
        return o.value.trim().toLowerCase() === name;
      });
      if (match) serviceDropdown.value = match.value;
    });
  });

  /* Email copy of the contact form (Web3Forms). Paste your free access key below. */
  var web3formsKey = "ee0b50f6-4a5c-4903-88f0-e446ddd022ad";
  var emailEnabled = /^[0-9a-f-]{30,}$/i.test(web3formsKey);
  var formNote = document.querySelector(".form-note");
  if (emailEnabled && formNote) {
    formNote.textContent = "Your enquiry is also emailed to me, and a message is prepared in WhatsApp.";
  }

  /* Contact form opens WhatsApp */
  var contactForm = document.querySelector("#contact-form");
  var visitorName = document.querySelector("#visitor-name");
  var visitorMessage = document.querySelector("#visitor-message");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = visitorName ? visitorName.value.trim() : "";
      var service = serviceDropdown ? serviceDropdown.value.trim() : "";
      var message = visitorMessage ? visitorMessage.value.trim() : "";
      if (!name || !service || !message) { contactForm.reportValidity(); return; }
      var text = ["Hello Nauman!", "", "I would like to discuss a project.", "", "Name: " + name, "Service: " + service, "", "Message:", message].join("\n");
      /* Open WhatsApp first (must happen directly on the tap), then email the same enquiry in the background */
      window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
      var botField = contactForm.querySelector("[name=botcheck]");
      if (emailEnabled && !(botField && botField.checked)) {
        try {
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            keepalive: true,
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
              access_key: web3formsKey,
              subject: "New portfolio enquiry: " + service,
              from_name: "Portfolio Website",
              name: name,
              service: service,
              message: message
            })
          }).catch(function () {});
        } catch (err) { /* email is optional; WhatsApp already opened */ }
      }
    });
  }

  /* Mobile navigation */
  var menuToggle = document.querySelector("#menu-toggle");
  var nav = document.querySelector("#primary-navigation");
  function setMenu(open) {
    if (!menuToggle || !nav) return;
    nav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function menuIsOpen() { return menuToggle.getAttribute("aria-expanded") === "true"; }
  if (menuToggle && nav) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.addEventListener("click", function () { setMenu(!menuIsOpen()); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuIsOpen()) { setMenu(false); menuToggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (menuIsOpen() && !nav.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
    });
  }

  /* Active navigation link while scrolling */
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("#home, #about, #skills, #projects, #services, #reviews, #contact");
  function setActive(id) {
    navLinks.forEach(function (link) {
      var on = link.getAttribute("href") === "#" + id;
      link.classList.toggle("active", on);
      if (on) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (!visible.length) return;
      visible.sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      setActive(visible[0].target.id);
    }, { root: null, rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  } else {
    var update = function () {
      var current = "home", pos = window.scrollY + window.innerHeight * 0.35;
      sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
      setActive(current);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* Scroll reveal (respects reduced motion) */
  var revealEls = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  function showAll() { revealEls.forEach(function (el) { el.classList.add("reveal-visible"); }); }
  if (reduced.matches || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("reveal-visible"); obs.unobserve(entry.target); }
      });
    }, { root: null, rootMargin: "0px 0px -60px 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
    var onMotionChange = function (e) { if (e.matches) { revealObserver.disconnect(); showAll(); } };
    if (typeof reduced.addEventListener === "function") reduced.addEventListener("change", onMotionChange);
    else if (typeof reduced.addListener === "function") reduced.addListener(onMotionChange);
  }

  /* Footer year */
  var year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  /* Safe rel on external links */
  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    var rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener"); rel.add("noreferrer");
    link.setAttribute("rel", Array.from(rel).join(" "));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePortfolio, { once: true });
} else {
  initializePortfolio();
}
