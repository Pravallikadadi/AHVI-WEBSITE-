const { chromium } = require("playwright");
const fs = require("fs");

const pages = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "how-ahvi-works", path: "/how-ahvi-works" },
  { name: "pricing", path: "/pricing" },
  { name: "blogs", path: "/blog" },
  { name: "faq", path: "/faq" },
  { name: "careers", path: "/careers" },
  { name: "contact", path: "/contact" },
  { name: "waitlist", path: "/waitlist" },
  { name: "referral", path: "/referral" },
];

async function loadAllImages(page) {
  // Scroll through the complete page to trigger lazy-loaded images
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let currentPosition = 0;
      const distance = 500;
      const delay = 150;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        currentPosition += distance;

        if (currentPosition >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, delay);
    });
  });

  // Wait until every image is loaded or failed
  await page.waitForFunction(() => {
    return Array.from(document.images).every((image) => image.complete);
  }, { timeout: 60000 });

  // Extra delay for image rendering and animations
  await page.waitForTimeout(2000);
}

(async () => {
  const browser = await chromium.launch();

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1000,
    },
    deviceScaleFactor: 1,
  });

  fs.mkdirSync("screenshots", { recursive: true });

  for (const item of pages) {
    const url = `http://localhost:3000${item.path}`;

    try {
      console.log(`Opening: ${url}`);

      await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60000,
      });

      await loadAllImages(page);

      await page.screenshot({
        path: `screenshots/${item.name}.png`,
        fullPage: true,
        animations: "disabled",
      });

      console.log(`Screenshot saved: screenshots/${item.name}.png`);
    } catch (error) {
      console.log(`Failed to capture ${item.name}`);
      console.log(error.message);
    }
  }

  await browser.close();

  console.log("All screenshots completed.");
})();