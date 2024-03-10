#!/usr/bin/env ts-node

import { program } from "commander";

import convert from "./convert";

program
  .version("1.0.1")
  .description("The curlimport CLI");

program
  .command("convert", { isDefault: true })
  .option("-f, --curl_file <string>", "file containing curl command, either this of --string are required")
  .option("-s, --curl_string <string>", "string containing curl command, either this of --file are required")
  .option("--output_text", "output includes calling the fetch to get the text")
  .option("--output_json", "output includes calling the fetch to get the json")
  .option("--indent_size <number>", "indent size for the output")
  .action(convert);

program.parse(process.argv);