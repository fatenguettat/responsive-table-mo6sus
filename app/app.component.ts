import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class ExampleDataSource extends DataSource<any> {
  connect(): Observable<any[]> {
    const rows = [];
    data.forEach((element) => rows.push(element, { detailRow: true, element }));
    return Observable.of(rows);

    // return Observable.of(data)
  }

  disconnect() {}
}

@Component({
  selector: 'material-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit {
  data = new ExampleDataSource();
  columns: any[] = [
    {
      id: 'action',
      label: '',
      hideOrder: 0,
    },
    {
      id: 'seqno',
      label: 'GNR_NO_NUMBER',
      hideOrder: 1,
    },
    {
      id: 'invId',
      label: 'Invoice id',
      hideOrder: 2,
    },
  ];

  @ViewChild(MatSort) sort: MatSort;

  cards = [1, 2, 3, 4];

  click(row) {
    console.log(row);
  }

  ngAfterViewInit() {
    console.log(this.sort);
  }
}

const data = JSON.parse(`[
        {
            "seqno": 102,
            "invId": "823e81e8-cbb7-401c-a3be-065c7e41fe22",
            "cus": {
                "cmpId": "5edd10c2-b089-4e55-b8ca-48333072751f",
                "name": {
                    "name": "asdasd",
                    "ent": "cmp"
                }
            },
            "vnd": {
                "cmpId": "f9b12bb8-9fe1-4db8-8b7a-679e67e26a73"
            },
            "name": "Dfghbv",
            "tot": {
                "a": 500.65,
                "c": "USD"
            },
            "blnc": {
                "a": -1517.6,
                "c": "USD"
            },
            "stx": 0.55,
            "sndts": "08/30/2017 11:15 UTC",
            "ts": "06/07/2017",
            "mdsts": 550
        },
        {
            "seqno": 101,
            "invId": "0905aefd-cb78-44ff-853e-6322caed1ced",
            "cus": {
                "cmpId": "04d27edb-cc92-4a01-bdac-220e21c93d8b",
                "name": {
                    "name": "Tomek's Electric Services",
                    "ent": "cmp"
                },
                "adr": {
                    "adr": "11 Wall Street",
                    "city": "New York",
                    "st": "NY",
                    "zip": "10005"
                },
                "lgo": {
                    "source": 200,
                    "tmplImage": "tmpl1.png",
                    "cmpName": "Tomek's Electric Services",
                    "cmpNameColor": "#808080",
                    "cmpMotto": "Electrician",
                    "cmpMottoColor": "#FF9500"
                }
            },
            "vnd": {
                "cmpId": "f9b12bb8-9fe1-4db8-8b7a-679e67e26a73"
            },
            "name": "Fixing leaking valve for contractor. Sales tax of 8% charged.",
            "tot": {
                "a": 2175,
                "c": "USD"
            },
            "blnc": {
                "a": 225,
                "c": "USD"
            },
            "stx": 0.5,
            "sndts": "06/29/2017 08:39 UTC",
            "ts": "06/27/2017",
            "mdsts": 100
        }
]`);

/**
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
