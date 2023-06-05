import fs from "fs";
import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
const options = {
  logLevel: "info",
  output: "json",
  onlyCategories: ["performance"],
  formFactor: "desktop",
  screenEmulation: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
    mobile: false,
  },
  port: chrome.port,
};
const runnerResult = await lighthouse(
  //"https://www.yamamay.com/it_it/?workspace=performancetestprod",
  "https://www.yamamay.com/it_it/",
  options
);

// `.report` is the HTML report as a string
const report = runnerResult.report;
fs.writeFileSync(`reports/lhreport-${Date.now()}.json`, report);

// `.lhr` is the Lighthouse Result as a JS object
console.log("Report is done for", runnerResult.lhr.finalDisplayedUrl);
console.log(
  "Performance score was",
  runnerResult.lhr.categories.performance.score * 100
);

await chrome.kill();
