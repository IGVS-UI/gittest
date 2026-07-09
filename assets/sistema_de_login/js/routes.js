export function getCurrentPage() {
  const path = window.location.pathname.replace(/\\/g, '/');
  return path.split('/').pop() || 'index.html';
}

function isWithin(pathname, segment) {
  return pathname.includes(`/${segment}/`);
}

function resolveTarget(target) {
  const pathname = window.location.pathname.replace(/\\/g, '/');
  const normalizedTarget = (target || 'index.html').trim();

  if (/^(https?:)?\/\//.test(normalizedTarget) || normalizedTarget.startsWith('/')) {
    return normalizedTarget;
  }

  if (normalizedTarget === 'index.html') {
    if (isWithin(pathname, 'sistema_de_login')) {
      return '../../pagina__princiapl/html/index.html';
    }
    return './index.html';
  }

  if (normalizedTarget === 'login.html') {
    if (isWithin(pathname, 'pagina__princiapl')) {
      return '../../sistema_de_login/html/login.html';
    }
    return './login.html';
  }

  if (normalizedTarget === 'cadastro.html') {
    if (isWithin(pathname, 'pagina__princiapl')) {
      return '../../sistema_de_login/html/cadastro.html';
    }
    return './cadastro.html';
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
