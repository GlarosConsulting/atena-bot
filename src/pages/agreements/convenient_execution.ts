import { By, WebElement } from 'selenium-webdriver';
import parseDate from 'date-fns/parse';

import getValueOrDefault from '../../utils/getValueOrDefault';
import parseRealValue from '../../utils/parseRealValue';
import Page from '../page';

export interface ExecutionProcess {
  executionId: string;
  type: string;
  date: Date;
  processId: string;
  status: string;
  systemStatus: string;
  system: string;
  accepted: string;
  details: ExecutionProcessDetails;
}

interface ExecutionProcessDetails {
  executionProcess: string;
  buyType: string;
  status: string;
  origin: string;
  financialResource: string;
  modality: string;
  biddingType: string;
  processId: string;
  biddingId: string;
  object: string;
  legalFoundation: string;
  justification: string;
  publishDate: Date;
  beginDate: Date;
  endDate: Date;
  biddingValue: number;
  homologationDate: Date;
  city: string;
  analysisDate: Date;
  accepted: string;
}

export interface Contract {
  contractId: string;
  biddingId: string;
  date: Date;
  details: ContractDetails;
}

interface ContractDetails {
  hiredDocument: string;
  hirerDocument: string;
  type: string;
  object: string;
  totalValue: number;
  publishDate: Date;
  beginDate: Date;
  endDate: Date;
  signDate: Date;
  executionProcessId: string;
  biddingModality: string;
  processId: string;
}

class ConvenientExecution extends Page {
  async getExecutionProcesses(): Promise<ExecutionProcess[]> {
    const convenientExecutionButton = await this.findOne(
      By.xpath('//*[@id="div_-481524888"]/span/span'),
    );
    if (!convenientExecutionButton) return null;
    await convenientExecutionButton.click();

    const executionProcessButton = await this.findOne(
      By.xpath('//*[@id="menu_link_-481524888_698822478"]/div/span/span'),
    );
    if (!executionProcessButton) return null;
    await executionProcessButton.click();

    const getDetails = async (
      row: WebElement,
    ): Promise<ExecutionProcessDetails> => {
      const detailsButton = await this.findOne(By.css('a.buttonLink'), row);
      if (!detailsButton) return null;
      await detailsButton.click();

      const executionProcess = await this.findOne(
        By.css('tr.processoCompra td.field'),
      );
      const buyType = await this.findOne(By.css('tr.tipoCompra td.field'));
      const status = await this.findOne(By.css('tr.statusLicitacao td.field'));
      const origin = await this.findOne(By.css('tr.origemRecurso td.field'));
      const financialResource = await this.findOne(
        By.css('tr.recursoFinanceiro td.field'),
      );
      const modality = await this.findOne(By.css('tr.modalidade td.field'));
      const biddingType = await this.findOne(
        By.css('tr.tipoLicitacao td.field'),
      );
      const processId = await this.findOne(
        By.css('tr.numeroDoProcesso td.field'),
      );
      const biddingId = await this.findOne(
        By.css('tr.numeroDaLicitacao td.field'),
      );
      const object = await this.findOne(By.css('tr.objeto td.field textarea'));
      const legalFoundation = await this.findOne(
        By.css('tr.fundamentoLegal td.field'),
      );
      const justification = await this.findOne(
        By.css('tr.justificativa td.field textarea'),
      );
      const publishDate = await this.findOne(
        By.css('tr.dataDePublicacaoDoEdital td.field'),
      );
      const beginDate = await this.findOne(
        By.css('tr.dataAberturaLicitacao td.field'),
      );
      const endDate = await this.findOne(
        By.css('tr.dataEncerramentoLicitacao td.field'),
      );
      const biddingValue = await this.findOne(
        By.css('tr.valorDaLicitacao td.field'),
      );
      const homologationDate = await this.findOne(
        By.css('tr.dataHomologacao td.field'),
      );
      const city = await this.findOne(By.css('tr.nomeDoMunicipio td.field'));
      const analysisDate = await this.findOne(
        By.css('tr.dataAnaliseAceiteProcessoExecucao td.field'),
      );
      const accepted = await this.findOne(
        By.css('tr.situacaoAceiteProcessoExecucao td.field'),
      );

      const details = {
        executionProcess: await getValueOrDefault(
          () => executionProcess.getText(),
          null,
        ),
        buyType: await getValueOrDefault(() => buyType.getText(), null),
        status: await getValueOrDefault(() => status.getText(), null),
        origin: await getValueOrDefault(() => origin.getText(), null),
        financialResource: await getValueOrDefault(
          () => financialResource.getText(),
          null,
        ),
        modality: await getValueOrDefault(() => modality.getText(), null),
        biddingType: await getValueOrDefault(() => biddingType.getText(), null),
        processId: await getValueOrDefault(() => processId.getText(), null),
        biddingId: await getValueOrDefault(() => biddingId.getText(), null),
        object: await getValueOrDefault(() => object.getText(), null),
        legalFoundation: await getValueOrDefault(
          () => legalFoundation.getText(),
          null,
        ),
        justification: await getValueOrDefault(
          () => justification.getText(),
          null,
        ),
        publishDate: parseDate(
          await getValueOrDefault(async () => publishDate.getText(), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        beginDate: parseDate(
          await getValueOrDefault(async () => beginDate.getText(), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        endDate: parseDate(
          await getValueOrDefault(async () => endDate.getText(), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        biddingValue: parseRealValue(
          await getValueOrDefault(() => biddingValue.getText(), null),
        ),
        homologationDate: parseDate(
          await getValueOrDefault(async () => homologationDate.getText(), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        city: await getValueOrDefault(() => city.getText(), null),
        analysisDate: parseDate(
          await getValueOrDefault(async () => analysisDate.getText(), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        accepted: await getValueOrDefault(() => accepted.getText(), null),
      };

      await this.webdriver.navigate().back();

      return details;
    };

    const getRowColumns = async (
      tableContainerBy: By,
    ): Promise<ExecutionProcess[]> => {
      const columns: ExecutionProcess[] = [];

      const table = await getValueOrDefault(
        () => this.findOne(tableContainerBy),
        null,
      );

      if (!table) return [];

      const rows = await this.findMany(By.tagName('tr'), table);

      if (!rows) return [];

      const promises = rows.map<Promise<ExecutionProcess>>(async row => {
        try {
          const executionId = await this.findOne(
            By.css('div.numeroLicitacao'),
            row,
          );
          const type = await this.findOne(By.css('div.modalidade'), row);
          const date = await this.findOne(By.css('div.dataPublicacao'), row);
          const processId = await this.findOne(
            By.css('div.numeroProcesso'),
            row,
          );
          const status = await this.findOne(By.css('div.situacao'), row);
          const systemStatus = await this.findOne(
            By.css('div.situacaoSistemaOrigem'),
            row,
          );
          const system = await this.findOne(By.css('div.sistemaOrigem'), row);
          const accepted = await this.findOne(
            By.css('div.situacaoAceiteProcessoExecucao'),
            row,
          );

          return {
            executionId: await getValueOrDefault(
              async () => executionId.getText(),
              null,
            ),
            type: await getValueOrDefault(async () => type.getText(), null),
            date: parseDate(
              await getValueOrDefault(async () => date.getText(), null),
              'dd/MM/yyyy',
              new Date(),
            ),
            processId: await getValueOrDefault(
              async () => processId.getText(),
              null,
            ),
            status: await getValueOrDefault(async () => status.getText(), null),
            systemStatus: await getValueOrDefault(
              async () => systemStatus.getText(),
              null,
            ),
            system: await getValueOrDefault(async () => system.getText(), null),
            accepted: await getValueOrDefault(
              async () => accepted.getText(),
              null,
            ),
            details: await getDetails(row),
          };
        } catch (err) {
          return null;
        }
      });

      columns.push(...(await Promise.all(promises)).filter(el => el !== null));

      return columns;
    };

    const executionProcesses = await getRowColumns(By.css('tbody#tbodyrow'));

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return executionProcesses;
  }

  async getContracts(): Promise<Contract[]> {
    const convenientExecutionButton = await this.findOne(
      By.xpath('//*[@id="div_-481524888"]/span/span'),
    );
    if (!convenientExecutionButton) return null;
    await convenientExecutionButton.click();

    const contractsButton = await this.findOne(
      By.xpath('//*[@id="menu_link_-481524888_1374656230"]/div/span/span'),
    );
    if (!contractsButton) return null;
    await contractsButton.click();

    const getDetails = async (row: WebElement): Promise<ContractDetails> => {
      const detailsButton = await this.findOne(By.css('a.buttonLink'), row);
      if (!detailsButton) return null;
      await detailsButton.click();

      const hiredDocument = await this.findOne(
        By.css('tr.identificacaoContratado td.field'),
      );
      const hirerDocument = await this.findOne(
        By.css('tr.identificacaoContratante td.field'),
      );
      const type = await this.findOne(By.css('tr.tipoAquisicao2 td.field'));
      const object = await this.findOne(
        By.css('tr.objetoContrato td.field textarea'),
      );
      const totalValue = await this.findOne(
        By.css('tr.valorGlobal td.inputPlaintext input[name="valorGlobal"]'),
      );
      const publishDate = await this.findOne(
        By.css(
          'tr.dataPublicacaoContrato td.inputPlaintext input[name="dataPublicacaoContrato"]',
        ),
      );
      const beginDate = await this.findOne(
        By.css(
          'tr.dataInicioVigencia td.inputPlaintext input[name="dataInicioVigencia"]',
        ),
      );
      const endDate = await this.findOne(
        By.css(
          'tr.dataFimVigencia td.inputPlaintext input[name="dataFimVigencia"]',
        ),
      );
      const signDate = await this.findOne(
        By.css(
          'tr.dataAssinatura td.inputPlaintext input[name="dataAssinatura"]',
        ),
      );
      const executionProcessId = await this.findOne(
        By.css('tr.numeroLicitacao td.field'),
      );
      const biddingModality = await this.findOne(
        By.css('tr.modalidadeLicitacao td.field'),
      );
      const processId = await this.findOne(
        By.css('tr.numeroProcesso td.field'),
      );

      const details: ContractDetails = {
        hiredDocument: await getValueOrDefault(
          () => hiredDocument.getText(),
          null,
        ),
        hirerDocument: await getValueOrDefault(
          () => hirerDocument.getText(),
          null,
        ),
        type: await getValueOrDefault(() => type.getText(), null),
        object: await getValueOrDefault(() => object.getText(), null),
        totalValue: parseRealValue(
          await getValueOrDefault(() => totalValue.getAttribute('value'), null),
        ),
        publishDate: parseDate(
          await getValueOrDefault(
            () => publishDate.getAttribute('value'),
            null,
          ),
          'dd/MM/yyyy',
          new Date(),
        ),
        beginDate: parseDate(
          await getValueOrDefault(() => beginDate.getAttribute('value'), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        endDate: parseDate(
          await getValueOrDefault(() => endDate.getAttribute('value'), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        signDate: parseDate(
          await getValueOrDefault(() => signDate.getAttribute('value'), null),
          'dd/MM/yyyy',
          new Date(),
        ),
        executionProcessId: await getValueOrDefault(
          () => executionProcessId.getText(),
          null,
        ),
        biddingModality: await getValueOrDefault(
          () => biddingModality.getText(),
          null,
        ),
        processId: await getValueOrDefault(() => processId.getText(), null),
      };

      await this.webdriver.navigate().back();

      return details;
    };

    const getRowColumns = async (tableContainerBy: By): Promise<Contract[]> => {
      const columns: Contract[] = [];

      const table = await getValueOrDefault(
        () => this.findOne(tableContainerBy),
        null,
      );

      if (!table) return [];

      const rows = await this.findMany(By.tagName('tr'), table);

      if (!rows) return [];

      const promises = rows.map<Promise<Contract>>(async row => {
        try {
          const contractId = await this.findOne(By.css('div.numero'), row);
          const biddingId = await this.findOne(
            By.css('div.numeroLicitacao'),
            row,
          );
          const date = await this.findOne(By.css('div.dataPublicacao'), row);

          return {
            contractId: await getValueOrDefault(
              async () => contractId.getText(),
              null,
            ),
            biddingId: await getValueOrDefault(
              async () => biddingId.getText(),
              null,
            ),
            date: parseDate(
              await getValueOrDefault(async () => date.getText(), null),
              'dd/MM/yyyy',
              new Date(),
            ),
            details: await getDetails(row),
          };
        } catch (err) {
          return null;
        }
      });

      columns.push(...(await Promise.all(promises)).filter(el => el !== null));

      return columns;
    };

    const contracts = await getRowColumns(By.css('tbody#tbodyrow'));

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return contracts;
  }
}

export default ConvenientExecution;
