jest.setTimeout(30000);

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      url: 'bestbefore://',
      delete: true,
    });
    await waitFor(element(by.id('welcomeTitle'))).toBeVisible().withTimeout(20000);
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcomeTitle'))).toBeVisible();
    await expect(element(by.id('addProductsButton'))).toBeVisible();
  });
}); 