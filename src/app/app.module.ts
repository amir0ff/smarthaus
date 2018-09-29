import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DeviceService } from './devices/device.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DevicesComponent } from './devices/devices.component';
import { DeviceComponent } from './devices/device/device.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './dashboard/widget/widget.component';
import { FontsModule } from './fonts.module';
import { SnackbarUiService } from './shared/snackbar-ui.service';

@NgModule({
  declarations: [
    AppComponent,
    DevicesComponent,
    DeviceComponent,
    DashboardComponent,
    WidgetComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    FontsModule
  ],
  providers: [DeviceService, SnackbarUiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
