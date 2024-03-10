import parseCurl from "parse-curl";
import parseLocation from "parse-location";
import cookie from "cookie";
import escapeQuotes from "escape-quotes";

export const parse = ({ curlContrnt }) => {
  const c = curlContrnt
    // parseCurl will try to add Content-Type: application/x-www-form-urlencoded if it doesn't find a Content-Type header
    // so make sure the content-type is converted to upper camel
    .replace(/content-type: /i, "Content-Type: ");
  const parsed = parseCurl(c);
  const { method, url, header, body } = parsed;

  const { cookie: headerCookie } = header;
  const parsedCookie = headerCookie ? cookie.parse(headerCookie) : undefined;
  const parsedLocation = parseLocation(url);

  const { protocol, hostname, query, search, pathname } = parsedLocation;
  const urlRoot = protocol + "//" + hostname + pathname
  const hasSearch = !!search;

  const headersNoCookie = header;
  delete headersNoCookie.cookie;

  const queryEscaped = Object.entries(query).map(([k, v]) => [k, escapeQuotes(v, '"')]);
  const headersNoCookieEscaped = Object.entries(headersNoCookie).map(([k, v]) => [k, escapeQuotes(v, '"')]);
  const parsedCookieEscaped = parsedCookie && Object.entries(parsedCookie).map(([k, v]) => [k, escapeQuotes(v, '"')]);

  return {
    method,
    urlRoot,
    queryEscaped,
    hasSearch,
    headersNoCookieEscaped,
    parsedCookieEscaped,
    body,
  };
};
