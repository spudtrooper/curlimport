import ejs from "ejs";
import formatJs from "js-beautify";
import { parse } from "./parse";

interface ConvertProps {
  curlContrnt: string;
  outputJson?: boolean;
  outputText?: boolean;
  indentSize?: number;
}

export const convert = (props: ConvertProps) => {
  const { curlContrnt, outputJson = false, outputText = false, indentSize = 2 } = props;

  if (outputJson && outputText) {
    throw new Error("Cannot output both json and text");
  }

  const {
    queryEscaped,
    headersNoCookieEscaped,
    parsedCookieEscaped,
    urlRoot,
    method,
    hasSearch,
    body,
  } = parse({ curlContrnt });

  const tmpl = `fetch("<%= urlRoot %>?" + new URLSearchParams({
<% queryEscaped.forEach(([k,v]) => { _%>
  "<%- k _%>": "<%- v _%>",
<% }) _%>     
}).toString(), {
  "headers": {
    <% headersNoCookieEscaped.forEach(([k,v]) => { -%>
"<%- k _%>": "<%- v -%>",
    <% }); -%>
<% if (parsedCookieEscaped) { _%>
  "cookie": Object.entries({
  <% parsedCookieEscaped.forEach(([k,v]) => { -%>
        "<%- k _%>": "<%- v -%>",
  <% }); -%>
      }).map(([k,v]) => k + "=" + v).join("; "), 
<% } _%>
    },
  "body": <% if (body) { _%>
JSON.stringify(
  <%- JSON.stringify(JSON.parse(body), null, 2) _%>
)
    <% } else { _%>
null
    <% } _%>,    
  "method": "<%= method.toUpperCase() %>"
})`,
    data = {
      urlRoot,
      headersNoCookieEscaped,
      method,
      hasSearch,
      queryEscaped,
      parsedCookieEscaped,
      body,
    },
    fetchOutput = ejs.render(tmpl, data);

  let output = fetchOutput;

  if (outputText) {
    const tmpl = `
(async function() {
  const resp = await <%- fetchOutput _%>;
  const text = await resp.text();
  console.log(JSON.stringify(json, null, 2));
 })();
 `.trim();
    const data = { fetchOutput };
    output = ejs.render(tmpl, data);
  }

  if (outputJson) {
    const tmpl = `
(async function() {
  const resp = await <%- fetchOutput _%>;
  const json = await resp.json();
  console.log(JSON.stringify(json, null, 2));
})();
`.trim();
    const data = { fetchOutput };
    output = ejs.render(tmpl, data);
  }

  const formatted = formatJs(output, { indent_size: indentSize });

  return formatted;
};
