/* Browser tests intercept every API request. No real contact POST/email/DB mutation. */
const { chromium } = require(
  process.env.TEMP + "/civic-browser-check/node_modules/playwright",
);
const fs = require("node:fs");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 430, height: 900 },
    });
    const requests = [];
    let fail = true;
    await page.route("**/api/**", (route) => {
      const request = route.request();
      if (new URL(request.url()).pathname === "/api/contact") {
        requests.push({
          key: request.headers()["idempotency-key"],
          payload: request.postDataJSON(),
        });
        if (fail)
          return route.fulfill({
            status: 500,
            json: { error: "Fixture connection failure" },
          });
        return route.fulfill({
          status: 201,
          json: {
            success: true,
            email: {
              contact: { sent: false, reason: "Office message saved." },
            },
          },
        });
      }
      return route.fulfill({
        status: 503,
        json: { error: "Isolated browser check" },
      });
    });
    await page.goto("http://localhost:3000/contact");
    await page.locator("input[name=name]").fill("Browser Fixture");
    await page.locator("input[name=phone]").fill("0000000000");
    await page
      .locator("textarea[name=message]")
      .fill("Fixture website enquiry text");
    await page.locator(".contact-form-submit").click();
    await page.locator(".contact-form-error").waitFor();
    await page.locator(".contact-form-submit").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".contact-editorial-form")
          .getAttribute("aria-busy") === "false",
    );
    assert.equal(requests.length, 2);
    assert.ok(requests[0].key);
    assert.equal(requests[0].key, requests[1].key);
    await page
      .locator("textarea[name=message]")
      .fill("Changed fixture website enquiry text");
    fail = false;
    await page.locator(".contact-form-submit").click();
    await page.locator(".contact-form-success").waitFor();
    assert.notEqual(requests[2].key, requests[0].key);
    assert.equal(await page.locator("input[name=name]").inputValue(), "");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      false,
    );
    await page.locator("input[name=name]").fill("Second Fixture");
    await page.locator("input[name=phone]").fill("0000000000");
    await page
      .locator("textarea[name=message]")
      .fill("Another fixture website enquiry");
    await page.locator(".contact-editorial-form").evaluate((form) => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });
    await page.locator(".contact-form-success").waitFor();
    await page.waitForTimeout(100);
    assert.equal(requests.length, 4);
    assert.notEqual(requests[3].key, requests[2].key);
    fs.writeFileSync(
      "docs/phase6-browser-check-results.json",
      JSON.stringify(
        {
          environment:
            "Real browser with every API intercepted; no real sends or DB writes",
          checks: [
            "Network-error retry reuses submission key",
            "Changed form receives a new submission key",
            "Saved submission shows existing success UI even when email fails",
            "Success clears form and resets key",
            "Concurrent form submits make one API call",
            "430px contact page has no horizontal overflow",
          ],
        },
        null,
        2,
      ),
    );
    console.log(
      "PASS contact browser retry keys, changed/new messages, duplicate-submit guard, saved-success UI and mobile overflow",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
