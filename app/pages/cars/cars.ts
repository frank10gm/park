import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { CarPage } from '../car/car';

@Component({
    templateUrl: 'build/pages/cars/cars.html'
})
export class CarsPage {

    private searchQuery: string = '';
    private cars: any;
    private s_cars: any;
    selectedMarca: any;

    constructor(private navCtrl: NavController, navParams: NavParams, private http: Http) {
        this.selectedMarca = navParams.get('marca');
        this.initializeCars();
    }

    initializeCars() {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        let link = 'http://www.stritwalk.com/Park/api/';
        let body2 = 'action=getCars&marca=' + this.selectedMarca.marca;
        let body = JSON.stringify({ action: 'getMarche' });

        this.http.post(link, body2, options)
            .map(res => res.json())
            .subscribe(data => {
                this.cars = data;
                this.initializeSearch();
            }, error => {
                console.log('error: ' + error._body);
            });
    }

    initializeSearch() {
        this.s_cars = this.cars;
    }

    //openMarche
    openCar(event, car) {
        this.navCtrl.push(CarPage, {
            car: car
        });
    }

    searchCars(ev: any) {
        this.initializeSearch();

        let val = ev.target.value;

        if (val && val.trim() != '') {
            this.s_cars = this.s_cars.filter((car) => {
                return (car.modello.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }
}
