import { launch, KnownDevices } from "puppeteer";
import lighthouse from "lighthouse";
import fs from "fs";

async function runLighthouse() {
  const browser = await launch({
    headless: "new",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  const page = await browser.newPage();

  const desktopDevice = KnownDevices["iPad Pro landscape"];
  await page.emulate(desktopDevice);

  // Configure Lighthouse options
  const options = {
    port: new URL(browser.wsEndpoint()).port,
    output: "json", // Set output format to JSON
    outputPath: "lighthouse-results.json",
    emulatedFormFactor: "desktop",
  };

  console.log("Running lighthouse...");

  // Run Lighthouse audit
  const report = await lighthouse(
    "https://www.yamamay.com/it_it/?workspace=performancetestprod",
    //"https://www.yamamay.com/it_it/",
    options
  );
  const results = report.lhr;

  // Process and analyze the results as needed
  //console.log(results);

  // Write the results to a JSON file
  fs.writeFileSync("lighthouse-results.json", JSON.stringify(results));

  console.log("Execution DONE");

  await browser.close();
}

runLighthouse();
