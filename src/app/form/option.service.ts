import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

type TOption = {
  id: string;
  label: string;
  active: boolean;
};

type TFilter = { active?: boolean };

@Injectable({ providedIn: 'root' })
export class OptionService {
  readonly #http = inject(HttpClient);

  getOptions(filter: TFilter = {}) {
    const params = Object.entries(filter).reduce((acc, [key, value]) => {
      return acc.set(key, value);
    }, new HttpParams());

    return this.#http.get<TOption[]>('/api/v1/options', { params });
  }
}
