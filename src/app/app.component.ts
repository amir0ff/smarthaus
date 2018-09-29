import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

declare var $: $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
    $(function () {
      $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        boundary: 'body'
      });
    });
  }
}
