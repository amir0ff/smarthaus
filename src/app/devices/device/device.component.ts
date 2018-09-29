import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
  @Input() registeredDevices;
  @Input() isLoading;

  constructor() {
  }

  ngOnInit() {
  }

}
