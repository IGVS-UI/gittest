export function getCurrentPage() {
  const path = window.location.pathname.replace(/\\/g, '/');
  return path.split('/').pop() || 'index.html';
}

function resolveTarget(target) {
  const normalizedTarget = (target || 'index.html').trim();

  if (/^(https?:)?\/\//.test(normalizedTarget) || normalizedTarget.startsWith('/')) {
    return normalizedTarget;
  }

  if (normalizedTarget === 'index.html') {
    return new URL('../../../index.html', import.meta.url).href;
  }

  if (normalizedTarget === 'login.html') {
    return new URL('../html/login.html', import.meta.url).href;
  }

  if (normalizedTarget === 'cadastro.html') {
    return new URL('../html/cadastro.html', import.meta.url).href;
  }

  return normalizedTarget;
}

export function redirectTo(target) {
  window.location.href = resolveTarget(target);
}

export function queueRedirect(target, delay = 1500) {
  return window.setTimeout(() => redirectTo(target), delay);
}

export function isProtectedPage() {
  return false;
}

export function isAuthPage() {
  const page = getCurrentPage();
  return page === 'login.html' || page === 'cadastro.html';
}

export function protectRoute(isAuthenticated) {
  const page = getCurrentPage();
  const isAuthRoute = page === 'login.html' || page === 'cadastro.html';

  if (!isAuthenticated && !isAuthRoute) {
    redirectTo('login.html');
  }

  if (isAuthenticated && isAuthRoute) {
    redirectTo('index.html');
  }
}
