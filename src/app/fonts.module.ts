import {NgModule} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
  faAddressCard,
  faBell,
  faEnvelope,
  faInfoCircle,
  faLightbulb,
  faMicrochip,
  faPlus,
  faSignal,
  faSignInAlt,
  faSignOutAlt,
  faSpinner,
  faSyncAlt,
  faThermometerHalf,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import {faRaspberryPi} from '@fortawesome/free-brands-svg-icons';

library.add(
  faSignal,
  faPlus,
  faSpinner,
  faMicrochip,
  faUser,
  faLightbulb,
  faThermometerHalf,
  faSyncAlt,
  faAddressCard,
  faInfoCircle,
  faSignOutAlt,
  faSignInAlt,
  faEnvelope,
  faRaspberryPi,
  faBell,
  faPlus
);

@NgModule({
  imports: [
    FontAwesomeModule
  ],
  exports: [
    FontAwesomeModule
  ]
})
export class FontsModule {
}
