/*
 * Anonymous visit tracker
 * - visitor_id : random ID saved in the browser, same on every return visit
 * - session_id : random ID for this visit only (new each time the tab is opened)
 * It does NOT collect names, Instagram accounts, phone numbers or IP addresses.
 */
(function () {
    // 1) Paste your Google Apps Script Web App URL here (see setup steps)
    var ENDPOINT = "https://script.google.com/macros/s/AKfycbxTURn39T3mPTyFUgbsy2-8lJwA3kzozXPvtPYdKPFUxndBbU6Dc7uiy_hnb11Ffp9L/exec";

    function makeId() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
    }

    function getStored(store, key) {
        try {
            var v = store.getItem(key);
            if (!v) { v = makeId(); store.setItem(key, v); }
            return v;
        } catch (e) {
            return "no-storage-" + makeId();
        }
    }

    var visitorId = getStored(window.localStorage, "visitor_id");
    var sessionId = getStored(window.sessionStorage, "session_id");

    var ua = navigator.userAgent || "";
    var device = /Mobi|Android|iPhone|iPad/i.test(ua) ? "Mobile" : "Desktop";
    var browser =
        /Edg\//.test(ua) ? "Edge" :
        /OPR\//.test(ua) ? "Opera" :
        /Chrome\//.test(ua) ? "Chrome" :
        /Firefox\//.test(ua) ? "Firefox" :
        /Safari\//.test(ua) ? "Safari" : "Other";

    var data = {
        time: new Date().toISOString(),
        visitor_id: visitorId,
        session_id: sessionId,
        page: location.pathname,
        referrer: document.referrer || "direct",
        device: device,
        browser: browser,
        screen: screen.width + "x" + screen.height,
        language: navigator.language || "",
        timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone) || ""
    };

    // Show the session ID on the page for testing: add ?debug=1 to the URL
    if (location.search.indexOf("debug=1") !== -1) {
        console.log("Session ID:", sessionId, "| Visitor ID:", visitorId);
    }

    if (!ENDPOINT || ENDPOINT.indexOf("PASTE_") === 0) return;

    var body = JSON.stringify(data);
    try {
        if (navigator.sendBeacon) {
            navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }));
        } else {
            fetch(ENDPOINT, { method: "POST", mode: "no-cors", body: body });
        }
    } catch (e) { /* tracking must never break the site */ }
})();
