import { expect, test } from "@playwright/test";

test.use({ storageState: "tests/.auth/user.json" });

test("add plugin configuration", async ({ page }) => {
  await page.goto("/admin/apps/");
  await page.waitForLoadState("networkidle");
  const plugConfigExists = await page
    .getByRole("row", { name: "care_imports_fe" })
    .getByRole("button")
    .isVisible();
  const importsBtn = await page
    .getByRole("link")
    .filter({ hasText: "Imports" })
    .isVisible();
  if (plugConfigExists && importsBtn) {
    return;
  }
  if (plugConfigExists) {
    await page
      .getByRole("row", { name: "care_imports_fe" })
      .getByRole("button")
      .click();
  } else {
    await page.getByRole("button", { name: "Add New Config" }).click();
    await page.locator("input").fill("care_imports_fe");
  }
  await page.locator("textarea").clear();
  await page.locator("textarea").fill(`{
  "url": "http://localhost:5273/assets/remoteEntry.js",
  "name": "care_imports_fe",
  "plug": "care_imports_fe"
}`);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(
    page.getByRole("cell", { name: "care_imports_fe" }),
  ).toBeVisible();
  await page.reload();
  await page.waitForLoadState("networkidle");
  let retryCount = 5;
  while (retryCount > 0) {
    const importBtn = await page
      .getByRole("link")
      .filter({ hasText: "Imports" })
      .isVisible();
    if (importBtn) {
      break;
    }
    await page.reload();
    await page.waitForLoadState("networkidle");
    retryCount--;
  }
});
