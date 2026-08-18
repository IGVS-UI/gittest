import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth } from "./firebase.js";

const accountLinks = document.querySelectorAll("[data-auth-nav]");
const loginUrl = new URL("../html/login.html", import.meta.url).href;
const accountUrl = new URL("../html/tela_dados.html", import.meta.url).href;

function updateNavigation(user) {
  accountLinks.forEach((link) => {
    const isAuthenticated = Boolean(user);

    link.href = isAuthenticated ? accountUrl : loginUrl;
    link.dataset.authenticated = String(isAuthenticated);
    link.setAttribute("aria-label", isAuthenticated ? "Abrir minha conta" : "Fazer login");
    link.title = isAuthenticated ? "Minha conta" : "Login";
    link.classList.add("is-ready");
  });
}

onAuthStateChanged(auth, updateNavigation, () => updateNavigation(null));
