import { By, WebElement } from 'selenium-webdriver';
import parseDate from 'date-fns/parse';

import getValueOrDefault from '../../utils/getValueOrDefault';
import parseRealValue from '../../utils/parseRealValue';
import Page from '../page';

export interface Data {
  modality: string;
  contractingStatus: string;
  status: {
    value: string;
    committed: string;
    publication: string;
  };
  proposalId: string;
  organId: string;
  processId: string;
  proponent: string;
  legalFoundation: string;
  organ: string;
  linkedOrgan: string;
  description: string;
  justification: string;
  targetAudience: string;
  problem: string;
  result: string;
  proposalAndObjectivesRelation: string;
  categories: string;
  object: string;
  information: string;
  proposalDate: Date;
  biddingDate: Date;
  homologationDate: Date;
}

export interface Program {
  programId: string;
  name: string;
  value: number;
  details: ProgramDetails;
}

interface ProgramDetails {
  code: string;
  name: string;
  cps: string;
  items: string;
  couterpartRule: string;
  totalValue: number;
  couterpartValues: {
    total: number;
    financial: number;
    assetsAndServices: number;
  };
  transferValues: {
    total: number;
    amendment: string;
  };
}

export interface Participants {
  proponent: string;
  respProponent: string;
  grantor: string;
  respGrantor: string;
}

class ProposalData extends Page {
  async getData(): Promise<Data> {
    const modality = await this.findOne(
      By.xpath('//*[@id="tr-alterarModalidade"]/td[2]/table/tbody/tr/td[1]'),
      this.webdriver,
      250,
    );
    const contractingStatus = await this.findOne(
      By.xpath('//*[@id="tr-alterarSituacaoContratoAtual"]/td[2]/div'),
      this.webdriver,
      250,
    );
    const status = await this.findOne(
      By.xpath('//*[@id="tr-alterarStatus"]/td[2]/table/tbody/tr[1]/td/div'),
      this.webdriver,
      250,
    );
    const committed = await this.findOne(
      By.xpath('//*[@id="tr-alterarStatus"]/td[2]/table/tbody/tr[2]/td[2]'),
      this.webdriver,
      250,
    );
    const publication = await this.findOne(
      By.xpath('//*[@id="tr-alterarStatus"]/td[2]/table/tbody/tr[2]/td[4]'),
      this.webdriver,
      250,
    );
    const proposalId = await this.findOne(
      By.xpath('//*[@id="tr-alterarNumeroProposta"]/td[4]'),
      this.webdriver,
      250,
    );
    const organId = await this.findOne(
      By.xpath('//*[@id="tr-alterarNumeroInterno"]/td[2]'),
      this.webdriver,
      250,
    );
    const processId = await this.findOne(
      By.xpath('//*[@id="tr-alterarNumeroProcesso"]/td[2]'),
      this.webdriver,
      250,
    );
    const proponent = await this.findOne(
      By.xpath('//*[@id="tr-alterarProponente"]/td[2]/div'),
      this.webdriver,
      250,
    );
    const legalFoundation = await this.findOne(
      By.xpath('//*[@id="tr-alterarFundamentoLegal"]/td[2]'),
      this.webdriver,
      250,
    );
    const organ = await this.findOne(
      By.xpath('//*[@id="tr-alterarOrgaoConcedente"]/td[2]'),
      this.webdriver,
      250,
    );
    const linkedOrgan = await this.findOne(
      By.xpath('//*[@id="tr-alterarOrgaoSubordinado"]/td[2]'),
      this.webdriver,
      250,
    );
    const description = await this.findOne(
      By.xpath('//*[@id="tr-alterarCaracterizacaoInteressesReciprocos"]/td[2]'),
      this.webdriver,
      250,
    );
    const justification = await this.findOne(
      By.xpath('//*[@id="tr-alterarJustificativa"]/td[2]'),
      this.webdriver,
      250,
    );
    const targetAudience = await this.findOne(
      By.xpath('//*[@id="tr-alterarPublicoAlvo"]/td[2]'),
      this.webdriver,
      250,
    );
    const problem = await this.findOne(
      By.xpath('//*[@id="tr-alterarProblemaASerResolvido"]/td[2]'),
      this.webdriver,
      250,
    );
    const result = await this.findOne(
      By.xpath('//*[@id="tr-alterarResultadosEsperados"]/td[2]'),
      this.webdriver,
      250,
    );
    const proposalAndObjectivesRelation = await this.findOne(
      By.xpath('//*[@id="tr-alterarRelacaoPropostaObjetivosProgramas"]/td[2]'),
      this.webdriver,
      250,
    );
    const categories = await this.findOne(
      By.xpath('//*[@id="tr-alterarCategorias"]/td[2]'),
      this.webdriver,
      250,
    );
    const object = await this.findOne(
      By.xpath('//*[@id="tr-alterarObjetoConvenio"]/td[2]'),
      this.webdriver,
      250,
    );
    const information = await this.findOne(
      By.xpath('//*[@id="tr-alterarCapacidadeTecnica"]/td[2]'),
      this.webdriver,
      250,
    );
    const proposalDate = await this.findOne(
      By.xpath('//*[@id="tr-alterarDataProposta"]/td[2]'),
      this.webdriver,
      250,
    );
    const biddingDate = await this.findOne(
      By.xpath('//*[@id="tr-enviarParaAnaliseDataAssinatura"]/td[2]'),
      this.webdriver,
      250,
    );
    const homologationDate = await this.findOne(
      By.xpath('//*[@id="tr-enviarParaAnaliseDataPublicacao"]/td[2]'),
      this.webdriver,
      250,
    );

    return {
      modality: await getValueOrDefault(() => modality.getText(), null),
      contractingStatus: await getValueOrDefault(
        () => contractingStatus.getText(),
        null,
      ),
      status: {
        value: await getValueOrDefault(() => status.getText(), null),
        committed: await getValueOrDefault(() => committed.getText(), null),
        publication: await getValueOrDefault(() => publication.getText(), null),
      },
      proposalId: await getValueOrDefault(() => proposalId.getText(), null),
      organId: await getValueOrDefault(() => organId.getText(), null),
      processId: await getValueOrDefault(() => processId.getText(), null),
      proponent: await getValueOrDefault(() => proponent.getText(), null),
      legalFoundation: await getValueOrDefault(
        () => legalFoundation.getText(),
        null,
      ),
      organ: await getValueOrDefault(() => organ.getText(), null),
      linkedOrgan: await getValueOrDefault(() => linkedOrgan.getText(), null),
      description: await getValueOrDefault(() => description.getText(), null),
      justification: await getValueOrDefault(
        () => justification.getText(),
        null,
      ),
      targetAudience: await getValueOrDefault(
        () => targetAudience.getText(),
        null,
      ),
      problem: await getValueOrDefault(() => problem.getText(), null),
      result: await getValueOrDefault(() => result.getText(), null),
      proposalAndObjectivesRelation: await getValueOrDefault(
        () => proposalAndObjectivesRelation.getText(),
        null,
      ),
      categories: await getValueOrDefault(() => categories.getText(), null),
      object: await getValueOrDefault(() => object.getText(), null),
      information: await getValueOrDefault(() => information.getText(), null),
      proposalDate: parseDate(
        await getValueOrDefault(() => proposalDate.getText(), null),
        'dd/MM/yyyy',
        new Date(),
      ),
      biddingDate: parseDate(
        await getValueOrDefault(() => biddingDate.getText(), null),
        'dd/MM/yyyy',
        new Date(),
      ),
      homologationDate: parseDate(
        await getValueOrDefault(() => homologationDate.getText(), null),
        'dd/MM/yyyy',
        new Date(),
      ),
    };
  }

  async getPrograms(): Promise<Program[]> {
    const programsButton = await this.findOne(
      By.xpath('//*[@id="menu_link_330887298_1035188630"]/div/span/span'),
    );
    if (!programsButton) return [];
    await programsButton.click();

    const table = await this.findOne(By.xpath('//*[@id="tbodyrow"]'));
    const rows = await this.findMany(By.tagName('tr'), table);

    if (!rows) return [];

    const programs: Program[] = [];

    const getProgramDetails = async (
      row: WebElement,
    ): Promise<ProgramDetails> => {
      const detailsButton = await this.findOne(By.css('a.buttonLink'), row);
      if (!detailsButton) return null;
      await detailsButton.click();

      const code = await this.findOne(
        By.xpath('//*[@id="tr-voltarCodigoPrograma"]/td[2]'),
      );
      const name = await this.findOne(
        By.xpath('//*[@id="tr-voltarNomePrograma"]/td[2]'),
      );
      const cps = await this.findOne(
        By.xpath('//*[@id="tr-voltarNumeroCPS"]/td[2]'),
      );
      const items = await this.findOne(
        By.xpath('//*[@id="tr-voltarItensInvestimento"]/td[2]'),
      );
      const couterpartRule = await this.findOne(
        By.xpath('//*[@id="tr-voltarRegraContrapartida"]/td[2]'),
      );
      const totalValue = await this.findOne(
        By.xpath('//*[@id="tr-voltarValorGlobal"]/td[2]'),
      );
      const counterpartTotalValue = await this.findOne(
        By.xpath('//*[@id="tr-voltarValorContrapartida"]/td[2]'),
      );
      const counterpartFinancialValue = await this.findOne(
        By.xpath('//*[@id="tr-voltarValorContrapartidaFinanceira"]/td[2]'),
      );
      const counterpartAssetsAndServicesValue = await this.findOne(
        By.xpath('//*[@id="tr-voltarValorContrapartidaBensServicos"]/td[2]'),
      );
      const transferTotalValue = await this.findOne(
        By.xpath(
          '/html/body/div[3]/div[12]/div[4]/div[1]/div/form/table/tbody/tr[10]/td[2]',
        ),
      );
      const transferAmendmentValue = await this.findOne(
        By.xpath(
          '/html/body/div[3]/div[12]/div[4]/div[1]/div/form/table/tbody/tr[11]/td[2]',
        ),
      );

      const details = {
        code: await getValueOrDefault(async () => code.getText(), null),
        name: await getValueOrDefault(async () => name.getText(), null),
        cps: await getValueOrDefault(async () => cps.getText(), null),
        items: await getValueOrDefault(async () => items.getText(), null),
        couterpartRule: await getValueOrDefault(
          async () => couterpartRule.getText(),
          null,
        ),
        totalValue: parseRealValue(
          await getValueOrDefault(async () => totalValue.getText(), null),
        ),
        couterpartValues: {
          total: parseRealValue(
            await getValueOrDefault(
              async () => counterpartTotalValue.getText(),
              null,
            ),
          ),
          financial: parseRealValue(
            await getValueOrDefault(
              async () => counterpartFinancialValue.getText(),
              null,
            ),
          ),
          assetsAndServices: parseRealValue(
            await getValueOrDefault(
              async () => counterpartAssetsAndServicesValue.getText(),
              null,
            ),
          ),
        },
        transferValues: {
          total: parseRealValue(
            await getValueOrDefault(
              async () => transferTotalValue.getText(),
              null,
            ),
          ),
          amendment: await getValueOrDefault(
            async () => transferAmendmentValue.getText(),
            null,
          ),
        },
      };

      await this.webdriver.navigate().back();

      return details;
    };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      if (!row) continue;

      programs.push({
        programId: await getValueOrDefault(
          async () => (await this.findOne(By.css('div.codigo'), row)).getText(),
          null,
        ),
        name: await getValueOrDefault(
          async () => (await this.findOne(By.css('div.nome'), row)).getText(),
          null,
        ),
        value: parseRealValue(
          await getValueOrDefault(
            async () =>
              (
                await this.findOne(By.css('div.valorGlobalFormatado'), row)
              ).getText(),
            null,
          ),
        ),
        details: await getProgramDetails(row),
      });
    }

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return programs;
  }

  async getParticipants(): Promise<Participants> {
    const participantsButton = await this.findOne(
      By.xpath('//*[@id="menu_link_330887298_-442619135"]/div/span/span'),
    );
    if (!participantsButton) return null;
    await participantsButton.click();

    const proponent = await this.findOne(
      By.xpath('//*[@id="tr-detalharProponenteProponente"]/td[2]/div'),
    );
    const respProponent = await this.findOne(
      By.xpath('//*[@id="tr-detalharProponenteResponsavelProponente"]/td[2]'),
    );
    const grantor = await this.findOne(
      By.xpath('//*[@id="tr-detalharProponenteConcedente"]/td[2]'),
    );
    const respGrantor = await this.findOne(
      By.xpath(
        '//*[@id="tr-detalharProponenteResponsavelConcedente"]/td[2]/div',
      ),
    );

    const participants: Participants = {
      proponent: await getValueOrDefault(() => proponent.getText(), null),
      respProponent: await getValueOrDefault(
        () => respProponent.getText(),
        null,
      ),
      grantor: await getValueOrDefault(() => grantor.getText(), null),
      respGrantor: await getValueOrDefault(() => respGrantor.getText(), null),
    };

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return participants;
  }
}

export default ProposalData;
