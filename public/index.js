(document.addEventListener("DOMContentLoaded", function () {
    /* بحث الصفحة الرئيسية -> صفحة الاكتشاف */
    const heroSearch = document.querySelector(".hero-search");
    if (heroSearch) {
      const input = document.getElementById("site-search");
      const btn = heroSearch.querySelector(".search-btn");
      const go = function () {
        const q = (input && input.value || "").trim();
        window.location.href = "/app/discover.html" + (q ? "?q=" + encodeURIComponent(q) : "");
      };
      if (btn) btn.addEventListener("click", go);
      if (input) input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); go(); }
      });
    }

    const t = document.getElementById("btn");
    if (!t) return;
    (window.addEventListener(
        "scroll",
        function () {
            t.style.display = window.scrollY >= 600 ? "flex" : "none";
        },
        { passive: !0 },
    ),
        t.addEventListener("click", function () {
            !(function () {
                const t = window.pageYOffset;
                let e = null;
                requestAnimationFrame(function n(o) {
                    null === e && (e = o);
                    const r = o - e,
                        s = (function (t, e, n) {
                            return (t /= 600) < 1
                                ? (n / 2) * t * t * t + e
                                : (n / 2) * ((t -= 2) * t * t + 2) + e;
                        })(r, t, -t);
                    (window.scrollTo(0, s),
                        r < 1200 ? requestAnimationFrame(n) : window.scrollTo(0, 0));
                });
            })();
        }));
    const e = document.querySelectorAll(".stat-item span"),
        n = new IntersectionObserver(
            function (t) {
                t.forEach(function (t) {
                    t.isIntersecting &&
                        ((function (t) {
                            const e = t.getAttribute("data-target");
                            let n = 0,
                                o = "",
                                r = "";
                            e.startsWith("+") && (r = "+");
                            const s = e.match(/\d+/);
                            if (!s) return void (t.textContent = e);
                            n = parseInt(s[0]);
                            const c = e.match(/[a-zA-Z]+/);
                            c && (o = c[0]);
                            let a = 0;
                            const i = Math.abs(Math.floor(2e3 / 60)),
                                l = n / 60,
                                u = setInterval(function () {
                                    ((a += l),
                                        a >= n
                                            ? ((t.textContent = r + n + o), clearInterval(u))
                                            : (t.textContent = r + Math.floor(a) + o));
                                }, i);
                        })(t.target),
                            n.unobserve(t.target));
                });
            },
            { threshold: 0.5 },
        );
    e.forEach(function (t) {
        const raw = t.textContent.trim();
        if (!/^\+?\d+[a-zA-Z]*$/.test(raw)) return;
        t.setAttribute("data-target", raw);
        const o = raw.startsWith("+") ? "+" : "",
            r = raw.match(/[a-zA-Z]+/),
            s = r ? r[0] : "";
        ((t.textContent = o + "0" + s), n.observe(t));
    });
}));
