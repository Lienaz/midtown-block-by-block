// Share buttons shared by the Midtown prototypes. Plain links only: no social SDKs or trackers.
// Shows Share… (phones), X, Facebook and Copy link; "More" reveals the rest.
// Usage: <div class="share" data-share-title="…" data-share-text="…"></div>, then <script src="share.js"></script>.
// Set window.SHARE_URL before loading to share a canonical URL; defaults to the current page.
(function () {
  var NETWORKS = [
    ["X", function (u, t) { return "https://x.com/intent/post?text=" + t + "&url=" + u; }],
    ["Facebook", function (u) { return "https://www.facebook.com/sharer/sharer.php?u=" + u; }],
    ["LinkedIn", function (u) { return "https://www.linkedin.com/sharing/share-offsite/?url=" + u; }],
    ["Bluesky", function (u, t) { return "https://bsky.app/intent/compose?text=" + t + "%20" + u; }],
    ["Threads", function (u, t) { return "https://www.threads.net/intent/post?text=" + t + "%20" + u; }],
    ["Reddit", function (u, t) { return "https://www.reddit.com/submit?url=" + u + "&title=" + t; }],
    ["WhatsApp", function (u, t) { return "https://wa.me/?text=" + t + "%20" + u; }],
    ["Email", function (u, t, title) { return "mailto:?subject=" + title + "&body=" + t + "%0A%0A" + u; }]
  ];

  var css =
    ".share{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:16px 0}" +
    ".share-label{font-family:\"GT America\",Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--blue,#2C48DC);margin-right:4px;flex-basis:100%}" +
    ".share a,.share button{font-family:\"GT America\",Arial,Helvetica,sans-serif;font-size:15px;line-height:1;color:var(--ink,#20222E);background:var(--paper,#fff);border:1px solid var(--line,#AEB0B7);border-radius:3px;padding:0 14px;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}" +
    ".share a:hover,.share button:hover{border-color:var(--blue,#2C48DC);color:var(--blue,#2C48DC)}" +
    ".share a:focus-visible,.share button:focus-visible{outline:2px solid var(--blue,#2C48DC);outline-offset:2px}" +
    ".share .share-native{background:var(--blue,#2C48DC);border-color:var(--blue,#2C48DC);color:var(--on-blue,#fff)}" +
    ".share-status{font-family:\"GT America\",Arial,Helvetica,sans-serif;font-size:14px;color:var(--muted,#5A5D6B);min-height:1em}" +
    ".share-more{display:flex;flex-wrap:wrap;gap:8px;flex-basis:100%}.share-more[hidden]{display:none}" +
    "@media (max-width:480px){.share a,.share button{flex:1 1 calc(50% - 8px);justify-content:center}}";

  function addStyle() {
    var s = document.createElement("style");
    s.id = "share-style";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function render(box) {
    var url = window.SHARE_URL || location.href.split("#")[0];
    var title = box.getAttribute("data-share-title") || document.title;
    var text = box.getAttribute("data-share-text") || title;
    var u = encodeURIComponent(url), t = encodeURIComponent(text), ti = encodeURIComponent(title);

    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Share this page");
    box.innerHTML = "";
    var label = document.createElement("span");
    label.className = "share-label";
    label.textContent = "Share";
    box.appendChild(label);

    if (navigator.share) {
      var nb = document.createElement("button");
      nb.type = "button";
      nb.className = "share-native";
      nb.textContent = "Share…";
      nb.addEventListener("click", function () {
        navigator.share({ title: title, text: text, url: url }).catch(function () {});
      });
      box.appendChild(nb);
    }

    var PRIMARY = { "X": 1, "Facebook": 1 };
    var more = document.createElement("div");
    more.className = "share-more";
    more.hidden = true;
    NETWORKS.forEach(function (n) {
      var a = document.createElement("a");
      a.href = n[1](u, t, ti);
      a.textContent = n[0];
      if (n[0] !== "Email") { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      a.setAttribute("aria-label", "Share on " + n[0]);
      if (n[0] === "Email") a.setAttribute("aria-label", "Share by email");
      (PRIMARY[n[0]] ? box : more).appendChild(a);
    });

    var copy = document.createElement("button");
    copy.type = "button";
    copy.textContent = "Copy link";
    var status = document.createElement("span");
    status.className = "share-status";
    status.setAttribute("aria-live", "polite");
    copy.addEventListener("click", function () {
      function done(ok) { status.textContent = ok ? "Link copied." : "Copy failed. Select the address bar to copy."; }
      try {
        navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
      } catch (e) { done(false); }
    });
    box.appendChild(copy);
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = "More";
    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      more.hidden = !more.hidden;
      toggle.setAttribute("aria-expanded", String(!more.hidden));
      toggle.textContent = more.hidden ? "More" : "Fewer";
    });
    box.appendChild(toggle);
    box.appendChild(more);
    box.appendChild(status);
  }

  function init() {
    var boxes = document.querySelectorAll(".share");
    if (!boxes.length) return;
    if (!document.getElementById("share-style")) addStyle();
    for (var i = 0; i < boxes.length; i++) render(boxes[i]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
