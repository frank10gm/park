import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: 'build/pages/car/car.html'
})
export class CarPage {
  selectedCar: any;

  constructor(public navCtrl: NavController, navParams: NavParams, private http: Http) {
    this.selectedCar = navParams.get('car');
  }
}
