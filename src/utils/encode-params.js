export default function (params) {
  if (!params)
    return '';

  return Object.keys(params)
    .map(p => encodeURIComponent(p) + '=' + encodeURIComponent(params[p]))
    .join('&');
}