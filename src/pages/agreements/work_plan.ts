import { By, WebElement } from 'selenium-webdriver';
import parseDate from 'date-fns/parse';

import getValueOrDefault from '../../utils/getValueOrDefault';
import parseRealValue from '../../utils/parseRealValue';
import { sleep } from '../../utils/async';
import Page from '../page';

export interface PhysicalChrono {
  list: {
    goalId: number;
    specification: string;
    value: number;
    startDate: Date;
    endDate: Date;
    income: string;
  }[];
  values: {
    registered: number;
    register: number;
    global: number;
  };
}

export interface DisbursementChrono {
  list: {
    portionId: number;
    type: string;
    month: string;
    year: number;
    value: number;
  }[];
  values: {
    registered: DisbursementChronoValue;
    register: DisbursementChronoValue;
    total: DisbursementChronoValue;
  };
}

interface DisbursementChronoValue {
  granting: number;
  convenient: number;
  yield: number;
}

export interface DetailedApplicationPlan {
  list: {
    type: string;
    description: string;
    natureExpenseCode: number;
    natureAcquisition: string;
    un: string;
    amount: number;
    unitValue: number;
    totalValue: number;
    status: string;
  }[];
  values: {
    assets: DetailedApplicationPlanValue;
    tributes: DetailedApplicationPlanValue;
    construction: DetailedApplicationPlanValue;
    services: DetailedApplicationPlanValue;
    others: DetailedApplicationPlanValue;
    administrative: DetailedApplicationPlanValue;
    total: DetailedApplicationPlanValue;
  };
}

interface DetailedApplicationPlanValue {
  total: number;
  resource: number;
  counterpart: number;
  yield: number;
}

export interface ConsolidatedApplicationPlan {
  list: ConsolidatedApplicationPlanItem[];
  total: ConsolidatedApplicationPlanItem;
}

export interface ConsolidatedApplicationPlanItem {
  classification: string;
  resources: number;
  counterpart: number;
  yield: number;
  total: number;
}

export interface Attachments {
  proposalList: Attachment[];
  executionList: Attachment[];
}

interface Attachment {
  name: string;
  description: string;
  date: Date;
}

export interface Notions {
  proposalList: NotionItem[];
  workPlanList: NotionItem[];
}

interface NotionItem {
  date: Date;
  type: string;
  responsible: string;
  assignment: string;
  occupation: string;
}

class WorkPlan extends Page {
  async getPhysicalChrono(): Promise<PhysicalChrono> {
    const workPlanButton = await this.findOne(
      By.xpath('//*[@id="div_997366806"]/span/span'),
    );
    if (!workPlanButton) return null;
    await workPlanButton.click();
    const physicalChronoButton = await this.findOne(
      By.xpath('//*[@id="menu_link_997366806_515135656"]/div/span/span'),
    );
    if (!physicalChronoButton) return null;
    await physicalChronoButton.click();

    const registeredValue = await this.findOne(
      By.xpath(
        '/html/body/div[3]/div[12]/div[4]/div[2]/div[1]/table/tbody/tr[1]/td[2]/div',
      ),
    );
    const valueToRegister = await this.findOne(
      By.xpath(
        '/html/body/div[3]/div[12]/div[4]/div[2]/div[1]/table/tbody/tr[2]/td[2]/div',
      ),
    );
    const globalValue = await this.findOne(
      By.xpath(
        '/html/body/div[3]/div[12]/div[4]/div[2]/div[1]/table/tbody/tr[3]/td[2]/div',
      ),
    );

    const physicalChrono: PhysicalChrono = {
      list: [],
      values: {
        registered: parseRealValue(
          await getValueOrDefault(() => registeredValue.getText(), null),
        ),
        register: parseRealValue(
          await getValueOrDefault(() => valueToRegister.getText(), null),
        ),
        global: parseRealValue(
          await getValueOrDefault(() => globalValue.getText(), null),
        ),
      },
    };

    const table = await this.findOne(By.xpath('//*[@id="tbodyrow"]'));

    if (table) {
      const rows = await this.findMany(By.tagName('tr'), table);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const id = await this.findOne(By.css('div.numero'), row);
        const specification = await this.findOne(
          By.css('div.especificacao'),
          row,
        );
        const value = await this.findOne(By.css('div.valorTexto'), row);
        const startDate = await this.findOne(By.css('div.dataInicio'), row);
        const endDate = await this.findOne(By.css('div.dataFim'), row);
        const income = await this.findOne(By.css('div.tipo'), row);

        physicalChrono.list.push({
          goalId: Number(await getValueOrDefault(() => id.getText(), null)),
          specification: await getValueOrDefault(
            () => specification.getText(),
            null,
          ),
          value: parseRealValue(
            await getValueOrDefault(() => value.getText(), null),
          ),
          startDate: parseDate(
            await getValueOrDefault(() => startDate.getText(), null),
            'dd/MM/yyyy',
            new Date(),
          ),
          endDate: parseDate(
            await getValueOrDefault(() => endDate.getText(), null),
            'dd/MM/yyyy',
            new Date(),
          ),
          income: await getValueOrDefault(() => income.getText(), null),
        });
      }
    }

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return physicalChrono;
  }

  async getDisbursementChrono(): Promise<DisbursementChrono> {
    const workPlanButton = await this.findOne(
      By.xpath('//*[@id="div_997366806"]/span/span'),
    );
    if (!workPlanButton) return null;
    await workPlanButton.click();
    const disbursementChronoButton = await this.findOne(
      By.xpath('//*[@id="menu_link_997366806_370039424"]/div/span/span'),
    );
    if (!disbursementChronoButton) return null;
    await disbursementChronoButton.click();

    const disbursementChrono: DisbursementChrono = {
      list: [],
      values: {
        registered: {
          granting: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[1]/td[2]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
          convenient: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[1]/td[3]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[1]/td[4]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
        },
        register: {
          granting: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[2]/td[2]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
          convenient: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[2]/td[3]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[2]/td[4]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
        },
        total: {
          granting: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[3]/td[2]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
          convenient: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[3]/td[3]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath('//*[@id="tbodyrow"]/tr[3]/td[4]/div'),
                  )
                ).getText(),
              null,
            ),
          ),
        },
      },
    };

    const tables = await this.findMany(By.xpath('//*[@id="tbodyrow"]'));

    if (tables.length >= 2) {
      const table = tables[0];
      const rows = await this.findMany(By.tagName('tr'), table);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const id = await this.findOne(By.css('div.numeroParcela'), row);
        const type = await this.findOne(By.css('div.tipoResponsavel'), row);
        const month = await this.findOne(By.css('div.mes'), row);
        const year = await this.findOne(By.css('div.ano'), row);
        const value = await this.findOne(By.css('div.valorTexto'), row);

        disbursementChrono.list.push({
          portionId: Number(await getValueOrDefault(() => id.getText(), null)),
          type: await getValueOrDefault(() => type.getText(), null),
          month: await getValueOrDefault(() => month.getText(), null),
          year: parseRealValue(
            await getValueOrDefault(() => year.getText(), null),
          ),
          value: parseRealValue(
            await getValueOrDefault(() => value.getText(), null),
          ),
        });
      }
    }

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return disbursementChrono;
  }

  async getDetailedApplicationPlan(): Promise<DetailedApplicationPlan> {
    const workPlanButton = await this.findOne(
      By.xpath('//*[@id="div_997366806"]/span/span'),
    );
    if (!workPlanButton) return null;
    await workPlanButton.click();
    const detailedApplicationPlanButton = await this.findOne(
      By.xpath('//*[@id="menu_link_997366806_836661414"]/div/span/span'),
    );
    if (!detailedApplicationPlanButton) return null;
    await detailedApplicationPlanButton.click();

    const detailedApplicationPlan: DetailedApplicationPlan = {
      list: [],
      values: {
        assets: {
          total: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[1]/td[2]/div',
                    ),
                  )
                ).getText(),
              null,
            ),
          ),
          resource: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[1]/td[3]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          counterpart: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[1]/td[4]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[1]/td[5]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
        },
        tributes: {
          total: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[2]/td[2]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          resource: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[2]/td[3]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          counterpart: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[2]/td[4]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[2]/td[5]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
        },
        construction: {
          total: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[3]/td[2]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          resource: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[3]/td[3]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          counterpart: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[3]/td[4]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[3]/td[5]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
        },
        services: {
          total: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[4]/td[2]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          resource: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[4]/td[3]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          counterpart: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[4]/td[4]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[4]/td[5]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
        },
        others: {
          total: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[5]/td[2]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          resource: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[5]/td[3]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          counterpart: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[5]/td[4]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[5]/td[5]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
        },
        administrative: {
          total: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[6]/td[2]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          resource: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[6]/td[3]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          counterpart: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[6]/td[4]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[6]/td[5]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
        },
        total: {
          total: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[7]/td[2]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          resource: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[7]/td[3]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          counterpart: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[7]/td[4]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
          yield: parseRealValue(
            await getValueOrDefault(
              async () =>
                (
                  await this.findOne(
                    By.xpath(
                      '/html/body/div[3]/div[12]/div[4]/div/div/div/form/div[4]/table/tbody/tr[7]/td[5]/div',
                    ),
                    this.webdriver,
                    2000,
                  )
                ).getText(),
              null,
            ),
          ),
        },
      },
    };

    const getPages = () => this.findMany(By.xpath('//*[@id="bens"]/span/a'));

    let pages = await getPages();
    let pagesCount = 0;

    if (pages !== null) pagesCount = pages.length;

    for (let i = -1; i < pagesCount; i++) {
      pages = await getPages();
      if (i >= 0) await pages[i].click();

      const tables = await this.findMany(By.xpath('//*[@id="tbodyrow"]'));

      if (tables.length <= 1) continue;

      const table = tables[0];
      const rows = await this.findMany(By.tagName('tr'), table);

      for (let j = 0; j < rows.length; j++) {
        const row = rows[j];

        const type = await this.findOne(By.css('div.tipoDespesa'), row);
        const description = await this.findOne(By.tagName('a'), row);
        const natureExpenseCode = await this.findOne(
          By.xpath('//*[@id="tbodyrow"]/tr[1]/td[3]/div'),
          row,
        );
        const natureAcquisition = await this.findOne(
          By.css('div.naturezaAquisicaoString'),
          row,
        );
        const un = await this.findOne(By.css('div.unidade'), row);
        const amount = await this.findOne(By.css('div.quantidade'), row);
        const unitValue = await this.findOne(By.css('div.valorUnitario'), row);
        const totalValue = await this.findOne(By.css('div.valorTotal'), row);
        const status = await this.findOne(By.css('div.status'), row);

        const item = {
          type: await getValueOrDefault(() => type.getText(), null),
          description: await getValueOrDefault(
            () => description.getText(),
            null,
          ),
          natureExpenseCode: Number(
            await getValueOrDefault(() => natureExpenseCode.getText(), null),
          ),
          natureAcquisition: await getValueOrDefault(
            () => natureAcquisition.getText(),
            null,
          ),
          un: await getValueOrDefault(() => un.getText(), null),
          amount: Number(await getValueOrDefault(() => amount.getText(), null)),
          unitValue: parseRealValue(
            await getValueOrDefault(() => unitValue.getText(), null),
          ),
          totalValue: parseRealValue(
            await getValueOrDefault(() => totalValue.getText(), null),
          ),
          status: await getValueOrDefault(() => status.getText(), null),
        };

        detailedApplicationPlan.list.push(item);
      }
    }

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return detailedApplicationPlan;
  }

  async getConsolidatedApplicationPlan(): Promise<ConsolidatedApplicationPlan> {
    const workPlanButton = await this.findOne(
      By.xpath('//*[@id="div_997366806"]/span/span'),
    );
    if (!workPlanButton) return null;
    await workPlanButton.click();
    const consolidatedApplicationPlanButton = await this.findOne(
      By.xpath('//*[@id="menu_link_997366806_-1540371065"]/div/span/span'),
    );
    if (!consolidatedApplicationPlanButton) return null;
    await consolidatedApplicationPlanButton.click();

    const getRowColumns = async (
      row: WebElement | null,
    ): Promise<ConsolidatedApplicationPlanItem> => {
      const classification = await this.findOne(By.css('div.legenda'), row);
      const resources = await this.findOne(By.css('div.recursosConvenio'), row);
      const counterpart = await this.findOne(
        By.css('div.contraPartidaBens'),
        row,
      );
      const yieldEl = await this.findOne(By.css('div.aplicacao'), row);
      const total = await this.findOne(By.css('div.total'), row);

      return {
        classification: await getValueOrDefault(
          () => classification.getText(),
          null,
        ),
        resources: parseRealValue(
          await getValueOrDefault(() => resources.getText(), null),
        ),
        counterpart: parseRealValue(
          await getValueOrDefault(() => counterpart.getText(), null),
        ),
        yield: parseRealValue(
          await getValueOrDefault(() => yieldEl.getText(), null),
        ),
        total: parseRealValue(
          await getValueOrDefault(() => total.getText(), null),
        ),
      };
    };

    const table = await this.findOne(By.xpath('//*[@id="tbodyrow"]'));
    const rows = await this.findMany(By.tagName('tr'), table);

    const consolidatedApplicationPlan: ConsolidatedApplicationPlan = {
      list: rows
        ? await Promise.all(
            rows
              .filter((el, index) => index < rows.length - 1)
              .map(row => getRowColumns(row)),
          )
        : [],
      total: await getRowColumns(rows ? rows[rows.length - 1] : null),
    };

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return consolidatedApplicationPlan;
  }

  async getAttachments(): Promise<Attachments> {
    const workPlanButton = await this.findOne(
      By.xpath('//*[@id="div_997366806"]/span/span'),
    );
    if (!workPlanButton) return null;
    await workPlanButton.click();
    const attachmentsButton = await this.findOne(
      By.xpath('//*[@id="menu_link_997366806_1965609892"]/div/span/span'),
    );
    if (!attachmentsButton) return null;
    await attachmentsButton.click();

    const getRowColumns = async (): Promise<Attachment[]> => {
      const columns: Attachment[] = [];

      const getPages = () =>
        this.findMany(By.xpath('//*[@id="listaAnexos"]/span[2]/a'));

      let pages = await getPages();
      let pagesCount = 0;

      if (pages !== null) pagesCount = pages.length;

      for (let i = -1; i < pagesCount; i++) {
        pages = await getPages();
        if (i >= 0) await pages[i].click();

        const table = await this.findOne(
          By.xpath('//*[@id="tbodyrow"]'),
          this.webdriver,
          1000,
        );

        if (!table) return [];

        const rows = await this.findMany(By.tagName('tr'), table);

        const promises = rows.map<Promise<Attachment>>(async row => {
          try {
            const name = await this.findOne(By.css('div.nome'), row);
            const description = await this.findOne(
              By.css('div.descricao'),
              row,
            );
            const date = await this.findOne(By.css('div.dataUpload'), row);

            return {
              name: await name.getText(),
              description: await description.getText(),
              date: parseDate(
                await getValueOrDefault(() => date.getText(), null),
                'dd/MM/yyyy',
                new Date(),
              ),
            };
          } catch (err) {
            return null;
          }
        });

        columns.push(
          ...(await Promise.all(promises)).filter(el => el !== null),
        );
      }

      return columns;
    };

    const getProposalAttachments = async (): Promise<Attachment[]> => {
      const proposalAttachmentsButton = await this.findOne(
        By.name('listarAnexosGenericosAnexosExibirAnexosPropostaForm'),
      );
      if (!proposalAttachmentsButton) return [];
      await proposalAttachmentsButton.click();

      const columns = await getRowColumns();

      const backButton = await this.findOne(
        By.name('listarAnexosGenericosSelecioneOArquivoASerAnexadoVoltarForm'),
      );

      if (backButton) {
        await backButton.click();
      } else {
        await this.webdriver.navigate().back();
      }

      return columns;
    };

    const getExecutionAttachments = async (): Promise<Attachment[]> => {
      const executionAttachmentsButton = await this.findOne(
        By.name('listarAnexosGenericosAnexosExibirAnexosExecucaoForm'),
      );
      if (!executionAttachmentsButton) return [];
      await executionAttachmentsButton.click();

      const columns = await getRowColumns();

      const backButton = await this.findOne(
        By.name('listarAnexosGenericosSelecioneOArquivoASerAnexadoVoltarForm'),
      );

      if (backButton) {
        await backButton.click();
      } else {
        await this.webdriver.navigate().back();
      }

      return columns;
    };

    const attachments: Attachments = {
      proposalList: await getProposalAttachments(),
      executionList: await getExecutionAttachments(),
    };

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return attachments;
  }

  async getNotions(): Promise<Notions> {
    await sleep(3000);

    const workPlanButton = await this.findOne(
      By.xpath('//*[@id="div_997366806"]/span/span'),
    );
    if (!workPlanButton) return null;
    await workPlanButton.click();
    const notionsButton = await this.findOne(
      By.xpath('//*[@id="menu_link_997366806_-231259270"]/div/span/span'),
    );
    if (!notionsButton) return null;
    await notionsButton.click();

    const getRowColumns = async (
      tableContainerBy: By,
      listType: 'PROPOSAL' | 'WORK_PLAN',
    ): Promise<NotionItem[]> => {
      const columns: NotionItem[] = [];

      let tableContainer = await getValueOrDefault(
        () => this.findOne(tableContainerBy),
        null,
      );

      if (!tableContainer) return [];

      const getPages = () =>
        this.findMany(By.css('span.pagelinks a'), tableContainer);

      let pages = await getPages();
      let pagesCount = 0;

      if (pages !== null) pagesCount = pages.length;

      for (let i = -1; i < pagesCount; i++) {
        pages = await getPages();
        if (i >= 0) await pages[i].click();

        tableContainer = await this.findOne(tableContainerBy);

        const table = await getValueOrDefault(
          () => this.findOne(By.css('tbody#tbodyrow'), tableContainer),
          null,
        );

        if (!table) continue;

        const rows = await this.findMany(By.tagName('tr'), table);

        const promises = rows.map<Promise<NotionItem>>(async row => {
          try {
            const date = await this.findOne(By.css('div.data'), row);
            const type = await this.findOne(
              By.css(
                listType === 'PROPOSAL' ? 'div.parecerDo' : 'div.tipoParecer',
              ),
              row,
            );
            const responsible = await this.findOne(
              By.css('div.responsavel'),
              row,
            );
            const assignment = await this.findOne(
              By.css('div.atribuicao'),
              row,
            );
            const occupation = await this.findOne(By.css('div.funcao'), row);

            return {
              date: parseDate(
                await getValueOrDefault(async () => date.getText(), null),
                'dd/MM/yyyy',
                new Date(),
              ),
              type: await type.getText(),
              responsible: await responsible.getText(),
              assignment: await assignment.getText(),
              occupation: await occupation.getText(),
            };
          } catch (err) {
            return null;
          }
        });

        columns.push(
          ...(await Promise.all(promises)).filter(el => el !== null),
        );
      }

      return columns;
    };

    const notions: Notions = {
      proposalList: await getRowColumns(
        By.css('div#listaParecerProposta'),
        'PROPOSAL',
      ),
      workPlanList: await getRowColumns(By.css('div#ConteudoDiv'), 'WORK_PLAN'),
    };

    while ((await this.webdriver.getTitle()) !== 'Detalhar Proposta') {
      await this.webdriver.navigate().back();
    }

    return notions;
  }
}

export default WorkPlan;
