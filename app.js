import { launch } from "puppeteer";
import lighthouse from "lighthouse";
import fs from "fs";

const getArgs = () => {
  const args = process.argv.slice(2);
  const params = {
    isMobile: true,
    isProd: false,
  };

  args.forEach((arg) => {
    const [key, value] = arg.split("=");
    params[key] = value === "true";
  });

  return params;
};

async function runLighthouse() {
  const { isMobile, isProd } = getArgs();

  const browser = await launch({
    headless: "new",
  });
  const page = await browser.newPage();

  // Configure Lighthouse options
  const options = {
    logLevel: "info",
    port: new URL(browser.wsEndpoint()).port,
    output: "json", // Set output format to JSON
    onlyCategories: ["performance"], // Only run Performance audits
    ...(isMobile
      ? {}
      : {
          formFactor: "desktop",
          screenEmulation: {
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2,
            mobile: false,
          },
        }),
  };

  // Run Lighthouse audit
  const runnerResult = await lighthouse(
    isProd
      ? "https://www.yamamay.com/it_it/"
      : "https://www.yamamay.com/it_it/?workspace=performancetestprod",
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

  await browser.close();
}

runLighthouse();
