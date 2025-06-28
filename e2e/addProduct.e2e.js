jest.setTimeout(30000);

describe('Add Product E2E', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      url: 'bestbefore://', // Use custom scheme to bypass Dev Launcher
      delete: true,
    });
  });

  it('should add a product', async () => {
    // Navigate to Add Item screen (assume tab or button with testID 'add-product-tab')
    await element(by.id('add-product-tab')).tap();

    // Fill out the form
    await element(by.id('product-name-input')).typeText('E2E Milk');
    await element(by.id('product-expiry-input')).typeText('2025-01-01');
    await element(by.id('product-barcode-input')).typeText('999888777');
    await element(by.id('product-category-picker')).tap();
    await element(by.text('Dairy')).tap();
    await element(by.id('product-storage-picker')).tap();
    await element(by.text('Fridge')).tap();

    // Add the product
    await element(by.id('save-product-button')).tap();

    // Verify product appears in the list (assume HomeScreen shows product name)
    await expect(element(by.text('E2E Milk'))).toBeVisible();
  });

  it('should update the product', async () => {
    // Tap on the product to open details (assume by text)
    await element(by.text('E2E Milk')).tap();
    // Tap Edit (assume button with text 'Edit')
    await element(by.text('Edit')).tap();
    // Change name
    await element(by.id('product-name-input')).clearText();
    await element(by.id('product-name-input')).typeText('E2E Milk Updated');
    // Save changes
    await element(by.id('save-product-button')).tap();
    // Verify updated name
    await expect(element(by.text('E2E Milk Updated'))).toBeVisible();
  });

  it('should delete the product', async () => {
    // Tap on the product to open details
    await element(by.text('E2E Milk Updated')).tap();
    // Tap Delete (assume button with text 'Delete')
    await element(by.text('Delete')).tap();
    // Confirm delete in alert
    await element(by.text('Delete')).atIndex(1).tap();
    // Verify product is removed
    await expect(element(by.text('E2E Milk Updated'))).toBeNotVisible();
  });
}); 