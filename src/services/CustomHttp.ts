export function getCurrentHost() {
  const url = new URL(window.location.href);

  return `${url.protocol}//${url.host}`;
}
