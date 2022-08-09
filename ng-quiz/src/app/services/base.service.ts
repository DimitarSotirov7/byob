import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() {}

  setCookie(value: string, key: string | undefined = undefined) {
    key = key ? key : environment.cookieName;
    const date = new Date();
    date.setDate(date.getDate() + 30);
    document.cookie = `${key}=${value}; expires=${date}`;
  }

  removeCookie(key: string | undefined = undefined) {
    key = key ? key : environment.cookieName;
    const date = new Date();
    date.setDate(date.getDate() - 1);
    document.cookie = `${key}=; expires=${date}`;
  }

  getCookie(key: string | undefined = undefined): string | undefined {
    const separator = '; ';
    const cookies = document.cookie.split(separator)
      .map(c => c.split('=')
        .reduce((acc, curr, idx) => {
          if (idx === 0) { acc.key = curr }
          else { acc.value = curr }
          return acc;
        }, {} as { key: string, value: string }));

    key = key ? key : environment.cookieName;
    const item = cookies.find(c => c.key === key);
    return item?.value;
  }
}