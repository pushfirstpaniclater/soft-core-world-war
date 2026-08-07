(() => {
  'use strict';

  if (window.__scwwSiteRouterInstalled) return;
  window.__scwwSiteRouterInstalled = true;

  const RADIO_SCRIPT_RE = /(?:^|\/)assets\/radio\.js(?:\?|$)/i;
  const ROUTER_SCRIPT_RE = /(?:^|\/)assets\/site-router\.js(?:\?|$)/i;
  const GAMES_PATH_RE = /(?:^|\/)games\.html$/i;
  const PAGE_HEAD_ATTR = 'data-scww-page-head';

  let navigating = false;
  let navToken = 0;

  const absolute = (value, base = location.href) => {
    try { return new URL(value, base); } catch { return null; }
  };

  const isGamesUrl = (url) => GAMES_PATH_RE.test(url.pathname);

  const isHtmlNavigation = (url) => {
    if (url.origin !== location.origin) return false;
    if (isGamesUrl(url)) return false;
    const path = url.pathname;
    return path.endsWith('/') || path.endsWith('.html') || !/\.[a-z0-9]{1,8}$/i.test(path);
  };

  const isPersistentNode = (node) => {
    if (!(node instanceof Element)) return false;
    if (node.id === 'scww-webamp-shell' || node.id === 'webamp') return true;
    if (node.querySelector?.('#webamp')) return true;
    return false;
  };

  const stripRadioScripts = (root) => {
    root.querySelectorAll('script[src]').forEach((script) => {
      const src = absolute(script.getAttribute('src'), location.href);
      if (!src) return;
      if (RADIO_SCRIPT_RE.test(src.pathname) || ROUTER_SCRIPT_RE.test(src.pathname)) script.remove();
    });
  };

  const copyPageHead = (doc, baseUrl) => {
    document.head.querySelectorAll(`[${PAGE_HEAD_ATTR}]`).forEach((node) => node.remove());

    const allowed = [...doc.head.children].filter((node) => {
      if (node.tagName === 'STYLE') return true;
      if (node.tagName === 'LINK') {
        const rel = (node.getAttribute('rel') || '').toLowerCase();
        return rel === 'stylesheet' || rel === 'preload';
      }
      return false;
    });

    allowed.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute(PAGE_HEAD_ATTR, 'true');
      if (clone.tagName === 'LINK' && clone.hasAttribute('href')) {
        const url = absolute(clone.getAttribute('href'), baseUrl);
        if (url) clone.setAttribute('href', url.href);
      }
      document.head.append(clone);
    });
  };

  const executeScript = async (oldScript, baseUrl) => {
    const script = document.createElement('script');
    [...oldScript.attributes].forEach((attr) => script.setAttribute(attr.name, attr.value));

    if (oldScript.src || oldScript.getAttribute('src')) {
      const src = absolute(oldScript.getAttribute('src'), baseUrl);
      if (!src) return;
      if (RADIO_SCRIPT_RE.test(src.pathname) || ROUTER_SCRIPT_RE.test(src.pathname)) return;
      script.src = src.href;
      script.async = false;
      await new Promise((resolve) => {
        script.addEventListener('load', resolve, { once: true });
        script.addEventListener('error', resolve, { once: true });
        document.body.append(script);
      });
      return;
    }

    script.textContent = oldScript.textContent || '';
    document.body.append(script);
  };

  const installBody = async (doc, baseUrl) => {
    stripRadioScripts(doc);

    const persistent = [...document.body.children].filter(isPersistentNode);
    const stale = [...document.body.childNodes].filter((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return true;
      return !persistent.includes(node);
    });
    stale.forEach((node) => node.remove());

    const scripts = [];
    const incoming = [...doc.body.childNodes];
    const fragment = document.createDocumentFragment();

    incoming.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
        scripts.push(node);
        return;
      }
      const clone = node.cloneNode(true);
      if (clone.nodeType === Node.ELEMENT_NODE) {
        clone.querySelectorAll?.('script').forEach((nested) => {
          scripts.push(nested.cloneNode(true));
          nested.remove();
        });
      }
      fragment.append(clone);
    });

    const firstPersistent = persistent.find((node) => node.isConnected) || null;
    document.body.insertBefore(fragment, firstPersistent);

    for (const script of scripts) {
      await executeScript(script, baseUrl);
    }
  };

  async function navigate(urlLike, push = true) {
    const url = absolute(urlLike);
    if (!url || !isHtmlNavigation(url)) {
      location.href = url ? url.href : String(urlLike);
      return;
    }

    const token = ++navToken;
    navigating = true;
    document.documentElement.dataset.scwwNavigating = 'true';

    try {
      const response = await fetch(url.href, { credentials: 'same-origin', cache: 'default' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      if (token !== navToken) return;

      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (!doc?.body) throw new Error('Invalid HTML');

      if (push) history.pushState({ scwwRoute: true }, '', url.href);
      document.title = doc.title || document.title;
      copyPageHead(doc, url.href);
      await installBody(doc, url.href);

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      window.dispatchEvent(new Event('scww:navigated'));
    } catch (error) {
      console.warn('SCWW seamless navigation fallback', error);
      location.href = url.href;
    } finally {
      if (token === navToken) {
        navigating = false;
        delete document.documentElement.dataset.scwwNavigating;
      }
    }
  }

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download')) return;
    if (link.target && link.target.toLowerCase() !== '_self') return;

    const url = absolute(link.href);
    if (!url || !isHtmlNavigation(url)) return;

    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

    event.preventDefault();
    navigate(url.href, true);
  }, true);

  window.addEventListener('popstate', () => navigate(location.href, false));

  // Give destination pages a tiny visual settle without touching the radio/audio tree.
  const style = document.createElement('style');
  style.textContent = 'html[data-scww-navigating="true"] body{cursor:progress}';
  document.head.append(style);

  window.scwwNavigate = navigate;
})();
