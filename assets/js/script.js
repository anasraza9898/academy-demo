/* ============================================================
   SUNNY ACADEMY — assets/js/script.js
   Single script file for all pages. Loaded with defer.
   ============================================================ */

/* ============================================================
   SITE CONFIGURATION — update these values when going live
   ============================================================ */
const SITE_CONFIG = {
  whatsappNumber: "923001234567",
  phoneDisplay: "+92 300 1234567",
  academyName: "Sunny Academy"
};

/* ============================================================
   HELPERS
   ============================================================ */
function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}
function qsa(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

/* ============================================================
   DYNAMIC FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  var el = qs("#footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
function initActiveNav() {
  var page = window.location.pathname.split("/").pop() || "index.html";
  if (!page) page = "index.html";
  qsa(".navbar__link, .navbar__link, .mobile-menu__link").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("?")[0].split("#")[0];
    if (href === page) {
      a.setAttribute("aria-current", "page");
      a.classList.add("active");
    } else {
      a.removeAttribute("aria-current");
      a.classList.remove("active");
    }
  });
}

/* ============================================================
   NAVBAR SCROLL STATE
   ============================================================ */
function initNavbarScroll() {
  var navbar = qs("#navbar");
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
function initMobileNav() {
  var toggle = qs("#menu-toggle");
  var menu   = qs("#mobile-menu");
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    menu.classList.add("is-open");
    menu.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", function () {
    var expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu(); else openMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
  });

  document.addEventListener("click", function (e) {
    if (
      menu.classList.contains("is-open") &&
      !menu.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  qsa(".mobile-menu__link", menu).forEach(function (link) {
    link.addEventListener("click", function () { closeMenu(); });
  });
}

/* ============================================================
   INTERSECTION OBSERVER REVEAL
   ============================================================ */
function initReveal() {
  var items = qsa(".reveal");
  if (!items.length) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { observer.observe(el); });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  var counters = qsa(".stat-card__number[data-target]");
  if (!counters.length) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      observer.unobserve(el);

      if (prefersReduced) {
        el.textContent = target;
        return;
      }

      var start = 0;
      var duration = 900;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var value = Math.floor(progress * target);
        el.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    if (!isNaN(target)) el.textContent = target;
    observer.observe(el);
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFaq() {
  var questions = qsa(".faq-question");
  if (!questions.length) return;

  questions.forEach(function (btn) {
    var answerId = btn.getAttribute("aria-controls");
    var answer   = answerId ? qs("#" + answerId) : null;
    if (!answer) return;

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) {
        btn.setAttribute("aria-expanded", "false");
        answer.hidden = true;
      } else {
        btn.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ============================================================
   COURSE FILTERS (courses.html)
   ============================================================ */
function initCourseFilters() {
  var filterBar = qs("#course-filters");
  if (!filterBar) return;

  var buttons = qsa(".filter-btn", filterBar);
  var cards   = qsa(".course-card-detail");
  if (!buttons.length || !cards.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      var filter = btn.getAttribute("data-filter") || "all";
      cards.forEach(function (card) {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    });
  });
}

/* ============================================================
   URL COURSE PRESELECTION (admissions.html)
   ============================================================ */
function initCoursePreselect() {
  var select = qs("#course-interest");
  if (!select) return;

  var params = new URLSearchParams(window.location.search);
  var course = params.get("course");
  if (!course) return;

  var decoded = decodeURIComponent(course);
  var options = Array.from(select.options);
  for (var i = 0; i < options.length; i++) {
    if (options[i].value.toLowerCase() === decoded.toLowerCase()) {
      select.value = options[i].value;
      break;
    }
  }
}

/* ============================================================
   ADMISSION FORM VALIDATION & WHATSAPP (admissions.html)
   ============================================================ */
function initAdmissionForm() {
  var form = qs("#admission-form");
  if (!form) return;

  var liveRegion = qs("#form-live-region");
  var successMsg = qs("#form-success");
  var submitBtn  = qs("#form-submit");
  var submitted  = false;

  function getField(id) { return qs("#" + id, form); }
  function getError(id) { return qs("#" + id + "-error", form); }

  function showError(id, msg) {
    var field = getField(id);
    var err   = getError(id);
    if (field) field.classList.add("has-error");
    if (err) {
      err.textContent = msg;
      err.classList.add("is-visible");
    }
  }

  function clearError(id) {
    var field = getField(id);
    var err   = getError(id);
    if (field) field.classList.remove("has-error");
    if (err) {
      err.textContent = "";
      err.classList.remove("is-visible");
    }
  }

  function clearAllErrors() {
    var ids = ["student-name", "parent-name", "phone", "email", "current-class", "course-interest", "timing", "mode", "consent"];
    ids.forEach(function (id) { clearError(id); });
  }

  function validate() {
    clearAllErrors();
    var valid = true;

    var studentName = getField("student-name");
    if (!studentName || studentName.value.trim().length < 2) {
      showError("student-name", "Please enter the student's full name.");
      valid = false;
    }

    var parentName = getField("parent-name");
    if (!parentName || parentName.value.trim().length < 2) {
      showError("parent-name", "Please enter the parent or guardian's name.");
      valid = false;
    }

    var phone = getField("phone");
    if (!phone || phone.value.trim().length < 7) {
      showError("phone", "Please enter a valid phone number (at least 7 digits).");
      valid = false;
    }

    var email = getField("email");
    if (email && email.value.trim() !== "") {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        showError("email", "Please enter a valid email address or leave this blank.");
        valid = false;
      }
    }

    var currentClass = getField("current-class");
    if (!currentClass || !currentClass.value) {
      showError("current-class", "Please select the student's current class or level.");
      valid = false;
    }

    var courseInterest = getField("course-interest");
    if (!courseInterest || !courseInterest.value) {
      showError("course-interest", "Please select a course of interest.");
      valid = false;
    }

    var timing = getField("timing");
    if (!timing || !timing.value) {
      showError("timing", "Please select a preferred class timing.");
      valid = false;
    }

    var mode = getField("mode");
    if (!mode || !mode.value) {
      showError("mode", "Please select a learning mode.");
      valid = false;
    }

    var consent = getField("consent");
    if (!consent || !consent.checked) {
      showError("consent", "Please confirm your consent to continue.");
      valid = false;
    }

    return valid;
  }

  function buildWhatsAppMessage() {
    var name    = (getField("student-name") || {}).value || "";
    var parent  = (getField("parent-name")  || {}).value || "";
    var phone   = (getField("phone")        || {}).value || "";
    var email   = (getField("email")        || {}).value || "";
    var level   = (getField("current-class")  ? getField("current-class").options[getField("current-class").selectedIndex].text : "");
    var course  = (getField("course-interest") ? getField("course-interest").options[getField("course-interest").selectedIndex].text : "");
    var timing  = (getField("timing")  ? getField("timing").options[getField("timing").selectedIndex].text : "");
    var mode    = (getField("mode")    ? getField("mode").options[getField("mode").selectedIndex].text : "");
    var message = (getField("message") || {}).value || "";

    var text = [
      "Hello, I would like to enquire about admission to " + SITE_CONFIG.academyName + ".",
      "",
      "Student Name: " + name.trim(),
      "Parent/Guardian: " + parent.trim(),
      "Phone: " + phone.trim(),
      email.trim() ? "Email: " + email.trim() : "",
      "Current Class/Level: " + level,
      "Course of Interest: " + course,
      "Preferred Timing: " + timing,
      "Learning Mode: " + mode,
      message.trim() ? "Message: " + message.trim() : ""
    ].filter(function (line) { return line !== ""; }).join("\n");

    return text;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitted) return;

    if (!validate()) {
      var firstError = qs(".field-error.is-visible", form);
      if (firstError && liveRegion) {
        liveRegion.textContent = "Please correct the errors in the form before continuing.";
      }
      if (firstError) {
        var parent = firstError.closest(".form-group, .consent-row");
        if (parent) parent.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    submitted = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Opening WhatsApp…";
    }

    var msg = buildWhatsAppMessage();
    var url = "https://wa.me/" + SITE_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener,noreferrer");

    if (successMsg) successMsg.classList.add("is-visible");
    if (liveRegion) liveRegion.textContent = "Your enquiry has been prepared. WhatsApp has been opened.";

    form.reset();

    setTimeout(function () {
      submitted = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Enquiry via WhatsApp";
      }
    }, 6000);
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  var btn = qs("#back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  initFooterYear();
  initActiveNav();
  initNavbarScroll();
  initMobileNav();
  initReveal();
  initCounters();
  initFaq();
  initCourseFilters();
  initCoursePreselect();
  initAdmissionForm();
  initBackToTop();
});