import { WebElement, By, until, WebDriver } from 'selenium-webdriver';
import { parse } from 'date-fns';

import getValueOrDefault from '../../utils/getValueOrDefault';
import { quit, build } from '../../utils/webdriver';
import Page from '../page';
import AgreementSearchPage, {
  SearchByCityProps,
  SearchByCnjpProps,
} from '../agreement_search';
import ProposalData, { Data, Program, Participants } from './proposal_data';
import WorkPlan, {
  PhysicalChrono,
  DisbursementChrono,
  DetailedApplicationPlan,
  ConsolidatedApplicationPlan,
  Attachments,
  Notions,
} from './work_plan';
import ConvenientExecution, {
  ExecutionProcess,
  Contract,
} from './convenient_execution';
import Accountability, { Data as AccountabilityData } from './accountability';
import { Company } from '../../app';

export interface Agreement {
  agreementId: string;
  company: Company;
  name: string;
  status: string;
  start: Date;
  end: Date;
  program: string;
  proposalData: {
    data: Data;
    programs: Program[];
    participants: Participants;
  };
  workPlan: {
    physicalChrono: PhysicalChrono;
    disbursementChrono: DisbursementChrono;
    detailedApplicationPlan: DetailedApplicationPlan;
    consolidatedApplicationPlan: ConsolidatedApplicationPlan;
    attachments: Attachments;
    notions: Notions;
  };
  convenientExecution: {
    executionProcesses: ExecutionProcess[];
    contracts: Contract[];
  };
  accountability: {
    data: AccountabilityData;
  };
}

const readAgreements: string[] = [];

class Agreements extends Page {
  async getPages(): Promise<WebElement[]> {
    const pages = await this.findMany(
      By.xpath('//*[@id="listaResultado"]/span[2]/a'),
      this.webdriver,
      10000,
    );

    return pages;
  }

  async toPage(page: number): Promise<boolean> {
    try {
      const pages = await this.findOne(
        By.xpath('//*[@id="listaResultado"]/span[2]'),
        this.webdriver,
        10000,
      );
      const pageEl = await this.findOne(
        By.xpath(`//*[@id="listaResultado"]/span[2]/*[text() = "${page}"]`),
        pages,
        10000,
      );

      await pageEl.click();

      return true;
    } catch (err) {
      console.log(`Occurred an error while trying to navigate to page ${page}`);
      return false;
    }
  }

  async getAll(
    page: number,
    company: Company,
    search: (webdriver: WebDriver) => void,
  ): Promise<Agreement[]> {
    const getTableRows = async () => {
      const table = await getValueOrDefault(
        () => this.findOne(By.css('tbody#tbodyrow'), this.webdriver, 1500),
        null,
      );
      if (!table) return null;

      const rows = await this.findMany(By.tagName('tr'), table, 3000);
      if (!rows) return null;

      const items = rows.map(async row => {
        const id = await this.findOne(By.css('div.numeroConvenio'), row, 15000);

        if (!id) return null;

        const name = await this.findOne(By.css('div.nomeOrgao'), row);
        const status = await this.findOne(By.css('div.situacao'), row);
        const start = await this.findOne(By.css('div.dataInicioExecucao'), row);
        const end = await this.findOne(By.css('div.dataFimExecucao'), row);
        const program = await this.findOne(By.css('div.nomePrograma'), row);

        return {
          id,
          name,
          status,
          start,
          end,
          program,
        };
      });

      return Promise.all(items.filter(el => el !== null));
    };

    const agreements: Agreement[] = [];
    let sequenceErrors = 0;

    let rows = await getTableRows();
    if (!rows) return agreements;
    let rowsCount = rows.length;

    for (let i = 0; i < rowsCount; i++) {
      try {
        if (page >= 0) {
          if (!(await this.toPage(page + 2))) {
            sequenceErrors++;

            if (sequenceErrors < 3) i--;

            await quit(this.webdriver);
            const newWebdriver = await build();

            this.webdriver = newWebdriver;

            await search(newWebdriver);

            continue;
          }
        }

        rows = await getTableRows();
        rowsCount = rows.length;

        const row = rows[i];

        if (!row) {
          console.log(`Row[${i}] not found!`);

          sequenceErrors++;

          if (sequenceErrors < 3) i--;

          await quit(this.webdriver);
          const newWebdriver = await build();

          this.webdriver = newWebdriver;

          await search(newWebdriver);

          continue;
        }

        const id = await getValueOrDefault(() => row.id.getText(), null);

        if (readAgreements.includes(id)) continue;

        readAgreements.push(id);

        console.time(`Elapsed time to ${id}`);

        const name = await getValueOrDefault(() => row.name.getText(), null);
        const summaryStatus = await getValueOrDefault(
          () => row.status.getText(),
          null,
        );
        const start = await getValueOrDefault(() => row.start.getText(), null);
        const end = await getValueOrDefault(() => row.end.getText(), null);
        const program = await getValueOrDefault(
          () => row.program.getText(),
          null,
        );

        console.log(
          `[Page ${page + 2} - ${i + 1}/${rowsCount}] Current agreement ID:`,
          id,
        );

        await row.id.click();

        try {
          await this.webdriver.wait(
            until.titleContains('Detalhar Proposta'),
            10000,
          );
        } catch (err) {
          console.timeEnd(`Elapsed time to ${id}`);
          console.log(
            'Occurred an error while trying to enter in agreement data...',
          );

          sequenceErrors++;

          if (sequenceErrors < 3) i--;

          await quit(this.webdriver);
          const newWebdriver = await build();

          this.webdriver = newWebdriver;

          await search(newWebdriver);

          continue;
        }

        const proposalData = new ProposalData(this.webdriver);
        const data = await proposalData.getData();
        const programs = await proposalData.getPrograms();
        const participants = await proposalData.getParticipants();

        // const workPlan = new WorkPlan(this.webdriver);
        // const physicalChrono = await workPlan.getPhysicalChrono();
        // const disbursementChrono = await workPlan.getDisbursementChrono();
        // const detailedApplicationPlan = await workPlan.getDetailedApplicationPlan();
        // const consolidatedApplicationPlan = await workPlan.getConsolidatedApplicationPlan();
        // const attachments = await workPlan.getAttachments();
        // const notions = await workPlan.getNotions();

        const convenientExecution = new ConvenientExecution(this.webdriver);
        const executionProcesses = await convenientExecution.getExecutionProcesses();
        const contracts = await convenientExecution.getContracts();

        const accountability = new Accountability(this.webdriver);
        const accountabilityData = await accountability.getData();

        const agreement: Agreement = {
          agreementId: id,
          company,
          name,
          status: summaryStatus,
          start: parse(start, 'dd/MM/yyyy', new Date()),
          end: parse(end, 'dd/MM/yyyy', new Date()),
          program,
          proposalData: {
            data,
            programs,
            participants,
          },
          workPlan: {
            physicalChrono: null,
            disbursementChrono: null,
            detailedApplicationPlan: null,
            consolidatedApplicationPlan: null,
            attachments: null,
            notions: null,
          },
          convenientExecution: {
            executionProcesses,
            contracts,
          },
          accountability: {
            data: accountabilityData,
          },
        };

        const backButton = await this.findOne(
          By.name('editarDadosPropostaDetalharPropostaVoltarParaConsultaForm'),
        );
        if (backButton) await backButton.click();

        console.log(JSON.stringify(agreement));
        console.timeEnd(`Elapsed time to ${id}`);

        agreements.push(agreement);
        sequenceErrors = 0;
      } catch (err) {
        console.log(
          `[Page ${
            page + 2
          }] Error while trying to get agreement data at index ${
            i + 1
          } of ${rowsCount}`,
        );
        console.log(`Error: ${err}`);

        sequenceErrors++;

        if (sequenceErrors < 3) i--;

        await quit(this.webdriver);
        const newWebdriver = await build();

        this.webdriver = newWebdriver;

        await search(newWebdriver);
      }
    }

    return agreements;
  }
}

export default Agreements;
