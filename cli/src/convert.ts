import fs from "fs";

import { convert } from "curlimport-lib";

const main = (props: {}) => {
  const { curl_file, curl_string, output_text, output_json, indent_size } = props as any;

  if (!curl_file && !curl_string) {
    throw new Error("either -file or --string are required");
  }

  const content = curl_string ? curl_string : fs.readFileSync(curl_file, 'utf8');

  const formatted = convert({
    curlContrnt: content,
    outputText: !!output_text,
    outputJson: !!output_json,
    indentSize: indent_size ? Number(indent_size) : undefined,
  });
  console.log(formatted);
};

export default main;
