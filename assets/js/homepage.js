(function () {
  document.body.classList.add("js-ready");

  var topNav = document.querySelector(".top-nav");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main .section"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));

  if (!sections.length) {
    return;
  }

  function updateNavState() {
    if (topNav) {
      topNav.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    var activeOffset = topNav ? topNav.offsetHeight + 32 : 96;
    var passed = sections.filter(function (section) {
      return section.offsetTop <= window.scrollY + activeOffset;
    });
    var activeSection = passed[passed.length - 1] || sections[0];

    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + activeSection.id);
    });
  }

  updateNavState();
  window.addEventListener("scroll", updateNavState, { passive: true });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    sections.forEach(function (section) {
      revealObserver.observe(section);
    });
  } else {
    sections.forEach(function (section) {
      section.classList.add("is-visible");
    });
  }
})();
