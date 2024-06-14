import { IDatasource, IGetRowsParams } from 'ag-grid-community';

export class Datasource implements IDatasource {
  getRows({ successCallback, failCallback }: IGetRowsParams): void {
    successCallback([]);
    failCallback();
  }
}
