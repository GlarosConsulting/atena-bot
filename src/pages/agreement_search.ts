import { By, Key } from 'selenium-webdriver';

import { sleep } from '../utils/async';
import Page from './page';

export interface SearchByCityProps {
  uf: string;
  city: string;
}

export interface SearchByCnjpProps {
  cnpj: string;
}

class AgreementSearch extends Page {
  async searchByCity({ uf, city }: SearchByCityProps): Promise<boolean> {
    try {
      await this.webdriver
        .navigate()
        .to(
          'https://voluntarias.plataformamaisbrasil.gov.br/voluntarias/ForwardAction.do?modulo=Principal&path=/MostraPrincipalConsultarConvenio.do&Usr=guest&Pwd=guest',
        );

      (await this.findOne(By.css('select[name="ufAcessoLivre"]'))).click();
      (await this.findOne(By.xpath(`//*[text()="${uf}"]`))).click();

      (
        await this.findOne(By.css('select[name="municipioAcessoLivre"]'))
      ).click();
      (await this.findOne(By.xpath(`//*[text()="${city}"]`))).click();

      (
        await this.findOne(
          By.css(
            'input[name="consultarPropostaPreenchaOsDadosDaConsultaConsultarForm"]',
          ),
        )
      ).click();

      return true;
    } catch {
      return false;
    }
  }

  async searchByCnpj({ cnpj }: SearchByCnjpProps): Promise<boolean> {
    try {
      await this.webdriver
        .navigate()
        .to(
          'https://voluntarias.plataformamaisbrasil.gov.br/voluntarias/ForwardAction.do?modulo=Principal&path=/MostraPrincipalConsultarConvenio.do&Usr=guest&Pwd=guest',
        );

      (await this.findOne(By.css('select[name="tipoIdentificacao"]'))).click();
      await sleep(1000);
      (await this.findOne(By.xpath(`//*[text()="CNPJ"]`))).click();
      await sleep(1000);

      const input = await this.findOne(By.css('input[name="identificacao"]'));
      await sleep(1000);
      await input.click();
      await sleep(1000);
      await input.sendKeys(Key.HOME);
      await sleep(1000);
      await input.sendKeys(cnpj);
      await sleep(1000);

      (
        await this.findOne(
          By.xpath(
            '/html/body/div[3]/div[12]/div[3]/div/div/form/table/tbody/tr[26]/td[2]/input[1]',
          ),
        )
      ).click();

      return true;
    } catch {
      return false;
    }
  }
}

export default AgreementSearch;
