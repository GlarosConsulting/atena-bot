import { Builder, ThenableWebDriver, WebDriver } from 'selenium-webdriver';
import Chrome from 'selenium-webdriver/chrome';
import ChromeDriver from 'chromedriver';

import { sleep } from './async';

Chrome.setDefaultService(new Chrome.ServiceBuilder(ChromeDriver.path).build());

const DEFAULT_OPTIONS = new Chrome.Options();
DEFAULT_OPTIONS.addArguments('disable-infobars');
DEFAULT_OPTIONS.setUserPreferences({ credential_enable_service: false });
DEFAULT_OPTIONS.setPageLoadStrategy('normal');

export const build = (
  options: Chrome.Options = DEFAULT_OPTIONS,
): ThenableWebDriver =>
  new Builder().setChromeOptions(options).forBrowser('chrome').build();

export const quit = async (webdriver: WebDriver): Promise<void> => {
  console.log(
    `Quitting browser in ${process.env.BROWSER_QUIT_SECONDS_TIMEOUT} seconds...`,
  );

  const timeoutMilliseconds =
    (Number(process.env.BROWSER_QUIT_SECONDS_TIMEOUT) * 1000) / 2;

  await sleep(timeoutMilliseconds);
  await webdriver.quit();
  await sleep(timeoutMilliseconds);
};
