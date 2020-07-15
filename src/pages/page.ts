import {
  By, until, WebElement, WebDriver,
} from 'selenium-webdriver';

export default class Page {
  webdriver: WebDriver;

  constructor(webdriver: WebDriver) {
    this.webdriver = webdriver;
  }

  async findOne(
    by: By,
    parent: WebElement | WebDriver = this.webdriver,
    timeout = 4000,
  ): Promise<WebElement> {
    try {
      await this.webdriver.wait(
        until.elementLocated(by),
        timeout,
        'Looking for element',
      );

      return parent.findElement(by);
    } catch (err) {
      return null;
    }
  }

  async findMany(
    by: By,
    parent: WebElement | WebDriver = this.webdriver,
    timeout = 4000,
  ): Promise<WebElement[]> {
    try {
      await this.webdriver.wait(
        until.elementLocated(by),
        timeout,
        'Looking for element',
      );

      return parent.findElements(by);
    } catch (err) {
      return null;
    }
  }
}
