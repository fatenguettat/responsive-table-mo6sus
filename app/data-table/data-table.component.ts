import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterContentInit,
  QueryList,
  ContentChildren,
  TemplateRef,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  NgZone
} from "@angular/core";
import { DataSource } from "@angular/cdk/collections";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { Subscription } from "rxjs/Subscription";
import { ColumnDefDirective } from "../column-def.directive";

import { MatTable } from "@angular/material";
import { trigger, state, style, animate, transition } from '@angular/animations';

export interface Column {
  id: string;
  visible?: boolean
  label: string,
  hideOrder: number,
  width?: number
}

const MIN_COLUMN_WIDTH = 200;

@Component({
  selector: "data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('expanded', style({height: '*', visibility: 'visible'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataTableComponent implements AfterContentInit, OnDestroy {
  visibleColumns: Column[];
  hiddenColumns: Column[];
  expandedElement = {}

  @Input() dataSource: DataSource<any>;
  @Input() columns: Column[]

  get visibleColumnsIds() {
    const visibleColumnsIds = this.visibleColumns.map(column => column.id)

    return this.hiddenColumns.length ? ['trigger', ...visibleColumnsIds] : visibleColumnsIds
  }

  get hiddenColumnsIds() {
    return this.hiddenColumns.map(column => column.id)
  }

  areCollumnsHidden = () => this.hiddenColumns.length
  isExpansionDetailRow = (row) => row.hasOwnProperty('detailRow');
  isExpansionDetailRow2 = (row) => !row.hasOwnProperty('detailRow');

  @Output() rowClick = new EventEmitter();

  @ViewChild(MatTable, { read: ElementRef })
  table: ElementRef;


  private rulerSubscription: Subscription;
  private _templateMap: Map<string, TemplateRef<any>> = new Map<
    string,
    TemplateRef<any>
  >();

  @ContentChildren(ColumnDefDirective)
  _templates: QueryList<ColumnDefDirective>;

  constructor(private ruler: ViewportRuler, private _changeDetectorRef: ChangeDetectorRef, private zone: NgZone) {
    this.rulerSubscription = this.ruler.change(500).subscribe(data => {
      // accesing clientWidth cause browser layout, cache it!
      // const tableWidth = this.table.nativeElement.clientWidth;
      this.toggleColumns(this.table.nativeElement.clientWidth);
    });
  }
  
  toggleColumns(tableWidth: number) {
    this.zone.runOutsideAngular(() => {
      const sortedColumns = this.columns.slice()
        .map((column, index) => ({ ...column, order: index }))
        .sort((a, b) => a.hideOrder - b.hideOrder);

      for (const column of sortedColumns) {
        const columnWidth = column.width ? column.width : MIN_COLUMN_WIDTH;

        if (column.hideOrder && tableWidth < columnWidth) {
          column.visible = false;

          continue;
        }

        tableWidth -= columnWidth;
        column.visible = true;
      }

      this.columns = sortedColumns.sort((a, b) => a.order - b.order);
      this.visibleColumns = this.columns.filter(column => column.visible);
      this.hiddenColumns = this.columns.filter(column => !column.visible)
    })

    this._changeDetectorRef.detectChanges();
  }

  ngAfterContentInit() {
    for (let i: number = 0; i < this._templates.toArray().length; i++) {
      this._templateMap.set(
        this._templates.toArray()[i].qtColumnDef,
        this._templates.toArray()[i].templateRef
      );
    }
    console.log(this._templateMap);

    this.toggleColumns(this.table.nativeElement.clientWidth);
  }

  ngOnDestroy() {
    this.rulerSubscription.unsubscribe();
  }

  getTemplateRef(name: string): TemplateRef<any> {
    return this._templateMap.get(name);
  }
}
