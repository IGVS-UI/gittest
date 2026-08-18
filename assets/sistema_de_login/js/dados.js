import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { auth } from "./firebase.js";

const loginUrl = new URL("../html/login.html", import.meta.url).href;
const fields = {
  title: document.querySelector("#account-title"),
  email: document.querySelector("#account-email"),
  name: document.querySelector("#detail-name"),
  detailEmail: document.querySelector("#detail-email"),
  provider: document.querySelector("#detail-provider"),
  created: document.querySelector("#detail-created"),
  lastLogin: document.querySelector("#detail-last-login"),
  id: document.querySelector("#detail-id"),
  verification: document.querySelector("#verification-status"),
  initials: document.querySelector("#account-initials"),
  photo: document.querySelector("#account-photo"),
  status: document.querySelector("#account-status"),
  logout: document.querySelector("#btnLogout")
};

const providerNames = {
  "password": "Email e senha",
  "google.com": "Google",
  "github.com": "GitHub",
  "microsoft.com": "Microsoft"
};

function formatDate(value) {
  if (!value) return "N\u00e3o informado";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N\u00e3o informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(date);
}

function getInitials(name, email) {
  const source = (name || email?.split("@")[0] || "Usu\u00e1rio").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function getProviderLabel(user) {
  const providers = [...new Set(user.providerData.map((item) => item.providerId))];
  return providers.map((provider) => providerNames[provider] || provider).join(", ") || "N\u00e3o informado";
}

function renderUser(user) {
  const displayName = user.displayName?.trim() || "Usu\u00e1rio VR Explore";
  const email = user.email || "Email n\u00e3o informado";

  fields.title.textContent = displayName;
  fields.email.textContent = email;
  fields.name.textContent = displayName;
  fields.detailEmail.textContent = email;
  fields.provider.textContent = getProviderLabel(user);
  fields.created.textContent = formatDate(user.metadata.creationTime);
  fields.lastLogin.textContent = formatDate(user.metadata.lastSignInTime);
  fields.id.textContent = user.uid;
  fields.initials.textContent = getInitials(user.displayName, user.email);

  fields.verification.textContent = user.emailVerified ? "Email verificado" : "Email n\u00e3o verificado";
  fields.verification.classList.toggle("is-verified", user.emailVerified);

  if (user.photoURL) {
    fields.photo.src = user.photoURL;
    fields.photo.hidden = false;
    fields.initials.hidden = true;
    fields.photo.addEventListener("error", () => {
      fields.photo.hidden = true;
      fields.initials.hidden = false;
    }, { once: true });
  }

  document.body.classList.add("account-ready");
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace(loginUrl);
    return;
  }

  renderUser(user);
}, (error) => {
  fields.title.textContent = "N\u00e3o foi poss\u00edvel carregar a conta";
  fields.email.textContent = "Atualize a p\u00e1gina e tente novamente.";
  fields.status.textContent = "Falha ao consultar sua sess\u00e3o.";
  document.body.classList.add("account-ready");
  console.error("Erro ao consultar sess\u00e3o:", error);
});

fields.logout?.addEventListener("click", async () => {
  fields.logout.disabled = true;
  fields.status.textContent = "Saindo...";

  try {
    await signOut(auth);
    window.location.replace(loginUrl);
  } catch (error) {
    fields.logout.disabled = false;
    fields.status.textContent = "N\u00e3o foi poss\u00edvel sair. Tente novamente.";
    console.error("Erro ao encerrar sess\u00e3o:", error);
  }
});
