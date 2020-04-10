import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class DeviceService {

  constructor(private http: HttpClient) {
  }

  getDevices() {
    // Return an Observable of registered devices
    return this.http.get(environment.apiEntryPoint + 'devices');
  }

  pinMode(id, pin, mode) {
    this.http.get(environment.apiEntryPoint + id + '/mode/' + pin + '/' + mode)
      .subscribe((data) => {
        console.log(data);
      });
  }

  digitalWrite(id, pin, value) {
    this.http.get(environment.apiEntryPoint + id + '/digital/' + pin + '/' + value)
      .subscribe((data) => {
        console.log(data);
      });
  }

  analogWrite(id, pin, value) {
    this.http.get(environment.apiEntryPoint + id + '/analog/' + pin + '/' + value)
      .subscribe((data) => {
        console.log(data);
      });
  }

  analogRead(id, pin) {
    return this.http.get(environment.apiEntryPoint + id + '/analog/' + pin);
  }

  digitalRead(id, pin) {
    return this.http.get(environment.apiEntryPoint + id + '/digital/' + pin);
  }

  getVariable(id, variable) {
    return this.http.get(environment.apiEntryPoint + 'device/' + id + '/' + variable);
  }

  callFunction(id, called_function, parameters) {
    this.http.get(environment.apiEntryPoint + id + '/' + called_function + '?params=' + parameters)
      .subscribe((data) => {
        console.log(data);
      });
  }

  gpioDigitalWrite(pin, value) {
    this.http.get(environment.apiEntryPoint + 'pi' + '/' + pin + '/' + value)
      .subscribe((data) => {
        console.log(data);
      });
  }

}
