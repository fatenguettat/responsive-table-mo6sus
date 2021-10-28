import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TemplatePortalDirective } from '@angular/cdk/portal';

@Directive({selector: '[qtColumnDef]'})
export class ColumnDefDirective extends TemplatePortalDirective {

  @Input() qtColumnDef: string;
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}