import { Component } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';

@Component({
    selector: 'dt-feature-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [AgGridAngular, MatTabGroup, MatTab, MatTabContent, LoadingBarHttpClientModule],
    host: {
        class: 'h-full block',
    }
})
export class HomeComponent {
  gridOptions: GridOptions<any> = {};
  defaultColDef: ColDef<any> = {
    flex: 1,
    minWidth: 100,
    editable: false,
    resizable: true,
  };
  columns: ColDef<any>[] = [
    { headerName: '#' },
    { headerName: 'Col 2' },
    { headerName: 'Col 3' },
    { headerName: 'Col 4' },
  ];
  protected data = [];
}
