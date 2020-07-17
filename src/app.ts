import 'dotenv/config';

import axios from 'axios';
import fs from 'fs';
import path from 'path';

import { WebDriver } from 'selenium-webdriver';
import { build, quit } from './utils/webdriver';
import api from './services/api';
import AgreementSearchPage from './pages/agreement_search';
import AgreementsPage, { Agreement } from './pages/agreements';

interface Log {
  beginDate: Date;
  endDate: Date;
  data: {
    location: {
      uf: string;
      city: string;
    };
    agreements: Agreement[];
  };
}

export interface Company {
  cnpj: string;
  name: string;
  city: {
    name: string;
    uf: string;
    ibge: string;
  };
  ibge: string;
  sphere: string;
}

interface Pagination {
  page: number;
  rowsPerPage: number;
}

async function run(): Promise<void> {
  let webdriver = await build();

  const logs: { [key: string]: Log } = {};

  const getCompanies = async ({ page, rowsPerPage }: Pagination) => {
    try {
      const response = await api.get<Company[]>('companies', {
        params: { page, rowsPerPage },
      });

      return response.data;
    } catch {
      return [];
    }
  };

  console.time('Total time:');

  const companies = await getCompanies({ page: 1, rowsPerPage: 100 });
  const agreements: Agreement[] = [];

  let lastPage = -1;

  let agreementSearchPage = new AgreementSearchPage(webdriver);
  let agreementsPage = new AgreementsPage(webdriver);

  const search = async ({
    newWebDriver,
    company,
  }: {
    newWebDriver: WebDriver;
    company: typeof companies[0];
  }) => {
    webdriver = newWebDriver;

    agreementSearchPage = new AgreementSearchPage(newWebDriver);
    agreementsPage = new AgreementsPage(newWebDriver);

    await agreementSearchPage.searchByCnpj({ cnpj: company.cnpj });
  };

  let companyCount = 0;

  // try {
  for (const company of companies) {
    if (company.cnpj.length !== 14) continue;

    await agreementSearchPage.searchByCnpj({ cnpj: company.cnpj });

    const pages = await agreementsPage.getPages();
    let pagesCount = 0;

    if (pages !== null) pagesCount = pages.length;

    const location = {
      city: company.city.name,
      uf: company.city.uf,
      ibge: company.city.ibge,
    };

    const logId = `${location.uf}-${location.city
      .toUpperCase()
      .replace(/ /g, '_')}-${location.ibge}`;
    let log = logs[logId] || {
      beginDate: new Date(),
      data: {
        location,
        agreements: [] as Agreement[],
      },
    };

    for (let i = -1; i < pagesCount; i++) {
      lastPage = i;

      const all = await agreementsPage.getAll(i, company, newWebDriver =>
        search({ newWebDriver, company }),
      );

      agreements.push(...all);

      log = {
        ...log,
        data: {
          ...log.data,
          agreements: [...log.data.agreements, ...all],
        },
      } as Log;

      if (pagesCount > 0)
        await agreementSearchPage.searchByCnpj({ cnpj: company.cnpj });
    }

    log = { ...log, endDate: new Date() } as Log;
    logs[logId] = log;

    const filePath = path.resolve(
      __dirname,
      '..',
      'output',
      'runtime',
      `${companyCount++}-${company.cnpj}-${logId}.json`,
    );

    fs.writeFile(
      filePath,
      JSON.stringify(
        {
          beginDate: log.beginDate,
          endDate: log.endDate,
          data: {
            location: log.data.location,
            agreements: log.data.agreements,
          },
        },
        null,
        2,
      ),
      (err): void => {
        if (err) return console.log(err);

        return console.log(
          'Agreements have been successfully saved to:',
          filePath,
        );
      },
    );
  }

  console.timeEnd('Total time:');

  for (const logId of Object.keys(logs)) {
    const log = logs[logId];

    const filePath = path.resolve(
      __dirname,
      '..',
      'output',
      `${logId}-${Date.now()}.json`,
    );

    fs.writeFile(
      filePath,
      JSON.stringify(
        {
          beginDate: log.beginDate,
          endDate: log.endDate,
          data: {
            location: log.data.location,
            agreements: log.data.agreements,
          },
        },
        null,
        2,
      ),
      (err): void => {
        if (err) return console.log(err);

        return console.log(
          'Agreements have been successfully saved to:',
          filePath,
        );
      },
    );
  }

  // const response = await api.post('/agreements', agreements);
  // console.log('response.data -> ', response.data);

  await quit(webdriver);
  // } catch (err) {
  //   console.log(`Occurred an unexpected error (${err}).`);

  //   const filePath = path.resolve(__dirname, '..', 'output', `error-${search.uf}-${search.city.replace(/ /g, '_')}-${Date.now()}.json`);

  //   console.log('Error saved to:', filePath);
  //   console.log('Running again...');

  //   fs.writeFile(filePath, JSON.stringify({
  //     startDate,
  //     endDate: new Date(),
  //     error: {
  //       page: lastPage,
  //       stackTrace: err,
  //     },
  //     data: {
  //       search,
  //       agreements,
  //     },
  //   }, null, 2), (error): void => {
  //     if (error) return console.log(error);

  //     return console.log('Agreements have been successfully saved to:', filePath);
  //   });

  //   await quit(webdriver);

  //   run();
  // }
}

run();
