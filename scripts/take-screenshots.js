const puppeteer = require("puppeteer");
const path = require("path");

async function takeScreenshots() {
  console.log("🔄 Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

  try {
    // Wait for the server to be ready
    console.log("⏳ Waiting for server to be ready...");
    await page.goto("http://localhost:3000", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Take dashboard screenshot
    console.log("📸 Taking dashboard screenshot...");
    await page.goto("http://localhost:3000/dashboard", {
      waitUntil: "networkidle0",
    });
    await page.screenshot({
      path: path.join(__dirname, "../docs/dashboard.png"),
      fullPage: true,
    });
    console.log("✅ Dashboard screenshot saved to docs/dashboard.png");

    // Take project detail screenshot (we'll use the first project)
    console.log("📸 Taking project detail screenshot...");
    // Navigate to home page first to get project links
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    // Wait for projects to load and click on the first project
    await page.waitForSelector('[data-testid="project-card"]', {
      timeout: 10000,
    });
    const projectLinks = await page.$$eval('a[href*="/project/"]', (links) =>
      links.map((link) => link.href)
    );

    if (projectLinks.length > 0) {
      const projectUrl = projectLinks[0];
      console.log(`📄 Navigating to project: ${projectUrl}`);
      await page.goto(projectUrl, { waitUntil: "networkidle0" });

      // Click on the Bids tab if it exists
      try {
        await page.waitForSelector('button[role="tab"]:has-text("Bids")', {
          timeout: 5000,
        });
        await page.click('button[role="tab"]:has-text("Bids")');
        await page.waitForTimeout(1000); // Wait for tab content to load
      } catch (e) {
        console.log("ℹ️ Bids tab not found, taking screenshot of current view");
      }

      await page.screenshot({
        path: path.join(__dirname, "../docs/project.png"),
        fullPage: true,
      });
      console.log("✅ Project detail screenshot saved to docs/project.png");
    } else {
      console.log(
        "⚠️ No project links found, taking screenshot of home page instead"
      );
      await page.screenshot({
        path: path.join(__dirname, "../docs/project.png"),
        fullPage: true,
      });
    }
  } catch (error) {
    console.error("❌ Error taking screenshots:", error);
    process.exit(1);
  } finally {
    await browser.close();
    console.log("🎉 Screenshots completed!");
  }
}

takeScreenshots();
