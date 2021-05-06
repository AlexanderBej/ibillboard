import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterEmployee' })
export class FilterEmployeePipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      var el = it.name + ' ' + it.surname
      return el.toLocaleLowerCase().includes(searchText);
    });
  }
}