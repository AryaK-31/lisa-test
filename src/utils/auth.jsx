import Cookies from "js-cookie";

export function setAuth(token, role) {
  Cookies.set("token", token, { expires: 1 });
  Cookies.set("role", role, { expires: 1 });
}

export function getAuth() {
  return Cookies.get("token");
}

export function getRole() {
  return Cookies.get("role");
}

export function clearAuth() {
  Cookies.remove("token");
  Cookies.remove("role");
}
