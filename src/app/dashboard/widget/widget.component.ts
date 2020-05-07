import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeviceService} from '../../devices/device.service';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  @Input() registeredDevices;
  isLoading = true;
  isSyncing = false;
  isConnected;
  temperature;
  humidity;

  syncInterval = setInterval(() => {
    this.getTemperature('762263', 'temperature');
    this.getHumidity('762263', 'humidity');
  }, 10000);

  constructor(private deviceService: DeviceService) {
  }

  ngOnInit() {
    this.getTemperature('762263', 'temperature');
    this.getHumidity('762263', 'humidity');
  }

  ngOnDestroy() {
    clearInterval(this.syncInterval);
  }

  getTemperature(id, variable) {
    this.deviceService.getVariable(id, variable).subscribe((data) => {
      console.log(data);
      if (data) {
        this.isConnected = true;
        this.temperature = data['temperature'];
        this.isLoading = false;
        setTimeout(() => {
          this.isSyncing = false;
        }, 3500);
      } else {
        this.isConnected = false;
        this.isSyncing = false;
        this.isLoading = false;
      }
    }, (error) => {
      console.log('Device sync error', error);
    });
  }

  getHumidity(id, variable) {
    this.deviceService.getVariable(id, variable).subscribe((data) => {
      console.log(data);
      if (data) {
        this.isConnected = true;
        this.humidity = data['humidity'];
        this.isLoading = false;
        setTimeout(() => {
          this.isSyncing = false;
        }, 3500);
      } else {
        this.isConnected = false;
        this.isSyncing = false;
        this.isLoading = false;
      }
    }, (error) => {
      console.log('Device sync error', error);
    });
  }

  sync() {
    this.isSyncing = true;
    this.isLoading = true;
    this.getTemperature('762263', 'temperature');
    this.getHumidity('762263', 'humidity');
  }

  onOff(id, pin, value) {
    this.deviceService.digitalWrite(id, pin, value);
  }

  gpioDigitalWrite(pin, value) {
    this.deviceService.gpioDigitalWrite(pin, value);
  }

  mode(id, pin, mode) {
    this.deviceService.pinMode(id, pin, mode);
  }
}
