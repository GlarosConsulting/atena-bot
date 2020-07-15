import { By, WebElement } from 'selenium-webdriver';
import parseDate from 'date-fns/parse';

import getValueOrDefault from '../../utils/getValueOrDefault';
import parseRealValue from '../../utils/parseRealValue';
import Page from '../page';

export interface Data {
  organ: string;
  convenient: string;
  documentNumber: string;
  modality: string;
  status: string;
  number: string;
  validity: string;
  limitDate: Date;
  totalValue: number;
  transferValue: number;
  counterpartValue: number;
  yieldValue: number;
}

class Accountability extends Page {
  async getData(): Promise<Data> {
    const accountabilityButton = await this.findOne(
      By.xpath('//*[@id="div_1632390425"]/span/span'),
    );
    if (!accountabilityButton) return null;
    await accountabilityButton.click();

    const dataButton = await this.findOne(
      By.xpath('//*[@id="menu_link_1632390425_1632390425"]/div/span/span'),
    );
    if (!dataButton) return null;
    await dataButton.click();

    const organ = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[3]/span[2]'),
    );
    const convenient = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[4]/span[2]'),
    );
    const documentNumber = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[5]/span[2]'),
    );
    const modality = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[7]/span[2]'),
    );
    const status = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[8]/span[2]'),
    );
    const number = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[10]/span[2]'),
    );
    const validity = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[11]/span[2]'),
    );
    const limitDate = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[12]/span[2]'),
    );
    const totalValue = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[13]/span[2]'),
    );
    const transferValue = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[14]/span[2]'),
    );
    const counterpartValue = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[15]/span[2]'),
    );
    const yieldValue = await this.findOne(
      By.xpath('//*[@id="mainForm"]/div[1]/div[16]/span[2]'),
    );

    const data: Data = {
      organ: await getValueOrDefault(() => organ.getText(), null),
      convenient: await getValueOrDefault(() => convenient.getText(), null),
      documentNumber: await getValueOrDefault(
        () => documentNumber.getText(),
        null,
      ),
      modality: await getValueOrDefault(() => modality.getText(), null),
      status: await getValueOrDefault(() => status.getText(), null),
      number: await getValueOrDefault(() => number.getText(), null),
      validity: await getValueOrDefault(() => validity.getText(), null),
      limitDate: parseDate(
        await getValueOrDefault(() => limitDate.getText(), null),
        'dd/MM/yyyy',
        new Date(),
      ),
      totalValue: parseRealValue(
        await getValueOrDefault(() => totalValue.getText(), null),
      ),
      transferValue: parseRealValue(
        await getValueOrDefault(() => transferValue.getText(), null),
      ),
      counterpartValue: parseRealValue(
        await getValueOrDefault(() => counterpartValue.getText(), null),
      ),
      yieldValue: parseRealValue(
        await getValueOrDefault(() => yieldValue.getText(), null),
      ),
    };

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return data;
  }
}

export default Accountability;
