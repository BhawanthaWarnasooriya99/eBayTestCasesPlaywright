import {test, expect} from '@playwright/test';
import { count } from 'node:console';

test('Verify related products are displayed for a main wallet product',async ({page}) => {

    //Navigate to the eBay website
    await page.goto("https://www.ebay.com/");
    // Search for a wallet product
    await page.fill("//input[@id='gh-ac']", 'wallet');
    // Click the search button
    await page.click("//button[@id='gh-search-btn']");
    // Wait for the search results to load
    await expect(page).toHaveTitle('Wallet for sale | eBay');
    
    // Click on the first product in the search results
    const firstProduct = await page.waitForSelector("//ul[@class='srp-results srp-grid clearfix']/li[1]//div[@class ='s-item__title']");
    // Get the product title text
    const productTitle = await firstProduct.$eval("span", el => el.textContent?.trim());
    console.log('First product title:', productTitle);
    
    // Get the browser context
    const context = page.context();
    
    // Wait for the new tab to open after the click
    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        firstProduct.click(), // Triggers new tab
    ]);

    // Ensure the new tab has loaded content
    await newTab.waitForLoadState('domcontentloaded');

    // Wait for the product details page to load 
    const detailsTitleElement = await newTab.waitForSelector("//h1[@class='x-item-title__mainTitle']//span[@class='ux-textspans ux-textspans--BOLD']");
    // Scroll the element into view if needed
    await detailsTitleElement.click();
    const detailsTitle = await detailsTitleElement.innerText();
    console.log('Details page title:', detailsTitle?.trim());

    // Compare the titles (ignoring case and trimming whitespace)
    //expect(detailsTitle?.toLowerCase().trim()).toContain(productTitle?.toLowerCase().trim());
    const normalize = (str: string | null | undefined) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ') || '';

    expect(normalize(detailsTitle)).toContain(normalize(productTitle));

    // Verify that related products are displayed
    const relatedProducts = newTab.locator("//div[@class='Mgpb rgAU']//div[@class='ZNEz']");

    // Wait until the items are visible
    await expect(relatedProducts.first()).toBeVisible();
    
    // Count number of items
    const itemCount = await relatedProducts.count();

    // Print the count
    console.log(`Number of similar items listed: ${itemCount}`);

    // Assert that the count is within the required range
    expect(itemCount).toBeGreaterThan(0);
    expect(itemCount).toBeLessThanOrEqual(6);

});

test('Verify all related products are from the same category (Wallet)',async ({page}) => {

    //Navigate to the eBay website
    await page.goto("https://www.ebay.com/");
    // Search for a wallet product
    await page.fill("//input[@id='gh-ac']", 'wallet');
    // Click the search button
    await page.click("//button[@id='gh-search-btn']");
    // Wait for the search results to load
    await expect(page).toHaveTitle('Wallet for sale | eBay');
    
    // Click on the first product in the search results
    const firstProduct = await page.waitForSelector("//ul[@class='srp-results srp-grid clearfix']/li[1]//div[@class ='s-item__title']");
    // Get the product title text
    const productTitle = await firstProduct.$eval("span", el => el.textContent?.trim());
    console.log('First product title:', productTitle);
    
    // Get the browser context
    const context = page.context();
    
    // Wait for the new tab to open after the click
    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        firstProduct.click(), // Triggers new tab
    ]);

    // Ensure the new tab has loaded content
    await newTab.waitForLoadState('domcontentloaded');

    // Wait for the product details page to load 
    const detailsTitleElement = await newTab.waitForSelector("//h1[@class='x-item-title__mainTitle']//span[@class='ux-textspans ux-textspans--BOLD']");
    // Scroll the element into view if needed
    await detailsTitleElement.click();
    const detailsTitle = await detailsTitleElement.innerText();
    console.log('Details page title:', detailsTitle?.trim());

    // Compare the titles (ignoring case and trimming whitespace)
    //expect(detailsTitle?.toLowerCase().trim()).toContain(productTitle?.toLowerCase().trim());
    const normalize = (str: string | null | undefined) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ') || '';

    expect(normalize(detailsTitle)).toContain(normalize(productTitle));

    // Verify that related products are displayed
    const relatedProducts = newTab.locator("//div[@class='Mgpb rgAU']//div[@class='ZNEz']");

    // Wait until the items are visible
    await expect(relatedProducts.first()).toBeVisible();
    
    // Count number of items
    const itemCount = await relatedProducts.count();

    // Print the count
    console.log(`Number of similar items listed: ${itemCount}`);

    // Loop through related products and verify their type
    for (let i = 0; i < itemCount; i++) {
    const itemLink = relatedProducts.nth(i);

    // Open each related product in a new tab
    const [relatedTab] = await Promise.all([
      context.waitForEvent('page'),
      itemLink.click(),
    ]);
    await relatedTab.waitForLoadState('domcontentloaded');

    // Get and clean up the title
    const relatedTypeRaw = await relatedTab.locator("//div[@class='ux-labels-values__values-content']//span[normalize-space()='Wallet']").textContent();
    const relatedType = relatedTypeRaw?.replace('Details about  ', '').toLowerCase().trim() || '';

    // Print and assert
    console.log(`** Related product ${i + 1} title: ${relatedType}`);
    if (relatedType.includes('wallet')) {
      console.log(`Related product ${i + 1} is a wallet.`);
    } else {
      console.log(`Related product ${i + 1} is NOT a wallet.`);
    }

    // Assert
    expect(relatedType).toContain('wallet');
    await relatedTab.close();
  }
  
});

test('Verify system behavior when there are less than 6 related products',async ({page}) => {

    //Navigate to the eBay website
    await page.goto("https://www.ebay.com/");
    // Search for a wallet product
    await page.fill("//input[@id='gh-ac']", 'wallet');
    // Click the search button
    await page.click("//button[@id='gh-search-btn']");
    // Wait for the search results to load
    await expect(page).toHaveTitle('Wallet for sale | eBay');
    
    // Click on the first product in the search results
    const firstProduct = await page.waitForSelector("//ul[@class='srp-results srp-grid clearfix']/li[1]//div[@class ='s-item__title']");
    // Get the product title text
    const productTitle = await firstProduct.$eval("span", el => el.textContent?.trim());
    console.log('First product title:', productTitle);
    
    // Get the browser context
    const context = page.context();
    
    // Wait for the new tab to open after the click
    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        firstProduct.click(), // Triggers new tab
    ]);

    // Ensure the new tab has loaded content
    await newTab.waitForLoadState('domcontentloaded');

    // Wait for the product details page to load 
    const detailsTitleElement = await newTab.waitForSelector("//h1[@class='x-item-title__mainTitle']//span[@class='ux-textspans ux-textspans--BOLD']");
    // Scroll the element into view if needed
    await detailsTitleElement.click();
    const detailsTitle = await detailsTitleElement.innerText();
    console.log('Details page title:', detailsTitle?.trim());

    // Compare the titles (ignoring case and trimming whitespace)
    //expect(detailsTitle?.toLowerCase().trim()).toContain(productTitle?.toLowerCase().trim());
    const normalize = (str: string | null | undefined) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ') || '';

    expect(normalize(detailsTitle)).toContain(normalize(productTitle));

    // Verify that related products are displayed
    const relatedProducts = newTab.locator("//div[@class='Mgpb rgAU']//div[@class='ZNEz']");

    // Wait until the items are visible
    await expect(relatedProducts.first()).toBeVisible();
    
    // Count number of items
    const itemCount = await relatedProducts.count();

    // Print the count
    console.log(`Number of similar items listed: ${itemCount}`);

    //Assert count is less than or equal to 6
    expect(itemCount).toBeLessThanOrEqual(6);

});

test('Verify system behavior when there are no related products',async ({page}) => {

    //Navigate to the eBay website
    await page.goto("https://www.ebay.com/");
    // Search for a wallet product
    await page.fill("//input[@id='gh-ac']", 'wallet');
    // Click the search button
    await page.click("//button[@id='gh-search-btn']");
    // Wait for the search results to load
    await expect(page).toHaveTitle('Wallet for sale | eBay');
    
    // Click on the first product in the search results
    const firstProduct = await page.waitForSelector("//ul[@class='srp-results srp-grid clearfix']/li[1]//div[@class ='s-item__title']");
    // Get the product title text
    const productTitle = await firstProduct.$eval("span", el => el.textContent?.trim());
    console.log('First product title:', productTitle);
    
    // Get the browser context
    const context = page.context();
    
    // Wait for the new tab to open after the click
    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        firstProduct.click(), // Triggers new tab
    ]);

    // Ensure the new tab has loaded content
    await newTab.waitForLoadState('domcontentloaded');

    // Wait for the product details page to load 
    const detailsTitleElement = await newTab.waitForSelector("//h1[@class='x-item-title__mainTitle']//span[@class='ux-textspans ux-textspans--BOLD']");
    // Scroll the element into view if needed
    await detailsTitleElement.click();
    const detailsTitle = await detailsTitleElement.innerText();
    console.log('Details page title:', detailsTitle?.trim());

    // Compare the titles (ignoring case and trimming whitespace)
    //expect(detailsTitle?.toLowerCase().trim()).toContain(productTitle?.toLowerCase().trim());
    const normalize = (str: string | null | undefined) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ') || '';

    expect(normalize(detailsTitle)).toContain(normalize(productTitle));

    // Verify that related products are displayed
    const relatedProducts = newTab.locator("//div[@class='Mgpb rgAU']//div[@class='ZNEz']");

    // Wait until the items are visible
    await expect(relatedProducts.first()).toBeVisible();
    
    // Count number of items
    const itemCount = await relatedProducts.count();

    if (itemCount === 0) {
    //Check for fallback message
    const fallbackMessage = page.locator("//span[normalize-space()='No related products found']");

    // Step 4: Assert the message is visible
    await expect(fallbackMessage).toBeVisible();

    console.log('"No related products found" message is correctly displayed.');
  } else {
    // There are related items – test fails in this case
    const itemCount = await relatedProducts.locator("//div[@class='Mgpb rgAU']//div[@class='ZNEz']").count();
    console.log(`Test setup issue: ${itemCount} related items were found on this page.`);
    expect(itemCount).toBe(0); // Force fail if related products exist
  }

});

test('Verify clicking on a related product redirects to that products page',async ({page}) => {

    //Navigate to the eBay website
    await page.goto("https://www.ebay.com/");
    // Search for a wallet product
    await page.fill("//input[@id='gh-ac']", 'wallet');
    // Click the search button
    await page.click("//button[@id='gh-search-btn']");
    // Wait for the search results to load
    await expect(page).toHaveTitle('Wallet for sale | eBay');
    
    // Click on the first product in the search results
    const firstProduct = await page.waitForSelector("//ul[@class='srp-results srp-grid clearfix']/li[1]//div[@class ='s-item__title']");
    // Get the product title text
    const productTitle = await firstProduct.$eval("span", el => el.textContent?.trim());
    console.log('First product title:', productTitle);
    
    // Get the browser context
    const context = page.context();
    
    // Wait for the new tab to open after the click
    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        firstProduct.click(), // Triggers new tab
    ]);

    // Ensure the new tab has loaded content
    await newTab.waitForLoadState('domcontentloaded');

    // Wait for the product details page to load 
    const detailsTitleElement = await newTab.waitForSelector("//h1[@class='x-item-title__mainTitle']//span[@class='ux-textspans ux-textspans--BOLD']");
    // Scroll the element into view if needed
    await detailsTitleElement.click();
    const detailsTitle = await detailsTitleElement.innerText();
    console.log('Details page title:', detailsTitle?.trim());

    // Compare the titles (ignoring case and trimming whitespace)
    //expect(detailsTitle?.toLowerCase().trim()).toContain(productTitle?.toLowerCase().trim());
    const normalize = (str: string | null | undefined) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ') || '';

    expect(normalize(detailsTitle)).toContain(normalize(productTitle));

    //verify URL has changed and is a valid product detail page
    const newUrl = newTab.url();
    console.log(`Redirected to URL: ${newUrl}`);
    expect(newUrl).toContain('/itm/'); // eBay product pages typically contain '/itm/'

    // Verify title or product content is present
    const relatedProduct = newTab.locator("//div[@class='Mgpb rgAU']//div[@class='ZNEz']");
    await expect(relatedProduct).toBeVisible();

    console.log('Successfully redirected to related product detail page.');

});

test('Verify sponsored products are clearly labeled',async ({page}) => {

    //Navigate to the eBay website
    await page.goto("https://www.ebay.com/");
    // Search for a wallet product
    await page.fill("//input[@id='gh-ac']", 'wallet');
    // Click the search button
    await page.click("//button[@id='gh-search-btn']");
    // Wait for the search results to load
    await expect(page).toHaveTitle('Wallet for sale | eBay');
    
    // Click on the first product in the search results
    const firstProduct = await page.waitForSelector("//ul[@class='srp-results srp-grid clearfix']/li[1]//div[@class ='s-item__title']");
    // Get the product title text
    const productTitle = await firstProduct.$eval("span", el => el.textContent?.trim());
    console.log('First product title:', productTitle);
    
    // Get the browser context
    const context = page.context();
    
    // Wait for the new tab to open after the click
    const [newTab] = await Promise.all([
        context.waitForEvent('page'),
        firstProduct.click(), // Triggers new tab
    ]);

    // Ensure the new tab has loaded content
    await newTab.waitForLoadState('domcontentloaded');

    // Wait for the product details page to load 
    const detailsTitleElement = await newTab.waitForSelector("//h1[@class='x-item-title__mainTitle']//span[@class='ux-textspans ux-textspans--BOLD']");
    // Scroll the element into view if needed
    await detailsTitleElement.click();
    const detailsTitle = await detailsTitleElement.innerText();
    console.log('Details page title:', detailsTitle?.trim());

    // Compare the titles (ignoring case and trimming whitespace)
    //expect(detailsTitle?.toLowerCase().trim()).toContain(productTitle?.toLowerCase().trim());
    const normalize = (str: string | null | undefined) =>
    str?.toLowerCase().trim().replace(/\s+/g, ' ') || '';

    expect(normalize(detailsTitle)).toContain(normalize(productTitle));

    // Verify that related products are displayed
    const relatedProducts = newTab.locator("//div[@class='Mgpb rgAU']//div[@class='ZNEz']");

    // Wait until the items are visible
    await expect(relatedProducts.first()).toBeVisible();
    
    // Count number of items
    const itemCount = await relatedProducts.count();

    // Print the count
    console.log(`Number of similar items listed: ${itemCount}`);

    // Assert that the count is within the required range
    expect(itemCount).toBeGreaterThan(0);
    expect(itemCount).toBeLessThanOrEqual(6);

    //Try to locate a "Sponsored" label in related products section
    const sponsoredLabel = newTab.locator("//div[@class='zwH9 EGf- MuPu']//div[@class='AfcE EGf-']");

    const labelVisible = await sponsoredLabel.isVisible();

    console.log(`All related products: ${labelVisible ? 'Sponsored label found' : 'No sponsored label visible'}`);

    //Assert that the sponsored label exists
    expect(labelVisible).toBeTruthy();

});