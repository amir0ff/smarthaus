import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../devices/device.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  registeredDevices = [];
  widgets = [];

  constructor(private deviceService: DeviceService) {
  }

  ngOnInit() {
    this.getDevices();
  }

  getDevices() {
    this.deviceService.getDevices().subscribe((data: any) => {
      this.registeredDevices = data;
    });
  }


}
