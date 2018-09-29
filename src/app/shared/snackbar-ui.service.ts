import { Injectable } from '@angular/core';

@Injectable()
export class SnackbarUiService {

  constructor() {
  }

  showSnackbar(message, type, speed) {
    const snackbar = document.getElementById('snackbar');
    snackbar.className = 'show alert ' + type;
    snackbar.innerText = message;
    snackbar.style.marginLeft = '-' + (snackbar.getBoundingClientRect().width / 2).toString() + 'px';
    setTimeout(function () {
      snackbar.className = snackbar.className.replace('show', '');
    }, speed);
  }
}
