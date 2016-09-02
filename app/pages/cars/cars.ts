import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
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
    groupedCars = [];
    searchBar: any;

    constructor(private navCtrl: NavController, navParams: NavParams, private http: Http, public events: Events) {
        this.selectedMarca = navParams.get('marca');
        this.initializeCars();
    }

    ionViewWillEnter() {
        this.events.subscribe('reloadCars', (data) => {
            this.initializeCars();
            this.searchBar = '';
        });
    }

    doRefresh(refresher) {
        this.initializeCars();
        refresher.complete();
    }

    initializeCars() {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        let link = 'http://www.stritwalk.com/Park/api/';
        let body = 'action=getCars&marca=' + this.selectedMarca.marca;
        //let body = JSON.stringify({ action: 'getMarche' });

        this.http.post(link, body, options)
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
        this.groupCars(this.s_cars);
    }

    compare(a, b) {
        if (a.vecchio < b.vecchio)
            return -1;
        if (a.vecchio > b.vecchio)
            return 1;
        return 0;
    }

    compare2(a, b){
        if (a.modello < b.modello)
            return -1;
        if (a.modello > b.modello)
            return 1;
        return 0;
    }

    groupCars(cars) {
        this.groupedCars = [];
        let sortedCars = cars.sort(this.compare);
        let currentStatus = -1;
        let currentCars = [];
        var status = '';

        sortedCars.forEach((value, index) => {
            if (value.vecchio != currentStatus) {

                currentStatus = value.vecchio;
                switch (value.vecchio) {
                    case 0:
                        status = 'For sale';
                        break;
                    case 1:
                        status = 'Heritage';
                        break;
                    case 2:
                        status = 'Prototype';
                        break;
                }

                let newGroup = {
                    status: status,
                    cars: []
                };

                currentCars = newGroup.cars;
                this.groupedCars.push(newGroup);
            }
            currentCars.push(value);
        });
        this.groupedCars[0].cars = this.groupedCars[0].cars.sort(this.compare2);
        this.groupedCars[1].cars = this.groupedCars[1].cars.sort(this.compare2);
        this.groupedCars[2].cars = this.groupedCars[2].cars.sort(this.compare2);
    }

    //openMarche
    openCar(event, car) {
        this.navCtrl.push(CarPage, {
            marca: this.selectedMarca.marca,
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
            this.groupCars(this.s_cars);
        }
    }
}
