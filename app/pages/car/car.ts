import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController, ModalController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'build/pages/car/car.html'
})
export class CarPage {
    car: any;
    brand: any;
    car_content: any = {};

    constructor(public navCtrl: NavController, navParams: NavParams, private http: Http, public events: Events, public alertCtrl: AlertController, public modalCtrl: ModalController) {
        this.car = navParams.get('car');
        this.brand = navParams.get('marca');

        this.car_content.description = '' + this.car.descrizione;
        this.car_content.image = this.car.immagine;
        this.car_content.year = this.car.serieNuova;
        this.car_content.types = this.car.modelli;
        this.car_content.engines = this.car.motori;
        this.car_content.dimensions = this.car.dimensioni;
        this.car_content.price = this.car.prezzo;
    }

    reloadCar(description, image, year, types, engines, dimensions, price) {
        this.car_content.description = '' + description;
        this.car_content.image = image;
        this.car_content.year = year;
        this.car_content.types = types;
        this.car_content.engines = engines;
        this.car_content.dimensions = dimensions;
        this.car_content.price = price;
    };

    edit() {
        let edit_car_modal = this.modalCtrl.create(EditCar, { brand: this.brand, model: this.car.modello, status: this.car.vecchio, year: this.car_content.year, image: this.car_content.image, dimensions: this.car_content.dimensions, engines: this.car_content.engines, types: this.car_content.types, price: this.car_content.price, description: this.car_content.description, id: this.car.id });
        edit_car_modal.onDidDismiss(data => {
            if (data) {
                this.saveCarDb(data);
            }
        });
        edit_car_modal.present();
    }

    saveCarDb(data) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        if (data.status == null || data.status == '') {
            data.status = '0';
        }


        let link = 'http://www.stritwalk.com/Park/api/';
        var body = 'action=editCar&marca=';
        body += data.brand;
        body += '&modello=' + data.model;
        body += '&vecchio=' + data.status;
        body += '&motori=' + data.engines;
        body += '&serieNuova=' + data.year;
        body += '&immagine=' + data.image;
        body += '&serieVecchia=' + '';
        body += '&dimensioni=' + data.dimensions;
        body += '&modelli=' + data.types;
        body += '&prezzo=' + data.price;
        body += '&descrizione=' + data.description;
        body += '&id=' + data.id;

        this.http.post(link, body, options)
            .map(res => res.json())
            .subscribe(data2 => {
                this.events.publish('reloadCars');
                this.reloadCar(data.description, data.image, data.year, data.types, data.engines, data.dimensions, data.price);
            }, error => {
                console.log('error: ' + error._body);
            });
    }

    showDelete() {
        let prompt = this.alertCtrl.create({
            title: 'Alert',
            message: "Enter admin password to delete this car",
            inputs: [
                {
                    name: 'password',
                    placeholder: 'Password',
                    type: 'password'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Confirm',
                    handler: data => {
                        if (data.password == 'deletami') {
                            this.delete();
                            this.navCtrl.pop();
                        }
                    }
                }
            ]
        });
        prompt.present();
    }

    delete() {
        var data = this.car;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        let link = 'http://www.stritwalk.com/Park/api/';
        var body = 'action=deleteCar&marca=';
        body += this.brand;
        body += '&modello=' + data.modello;
        body += '&id=' + data.id;

        this.http.post(link, body, options)
            .map(res => res.json())
            .subscribe(data => {
                console.log('success: ' + JSON.stringify(data));
                this.events.publish('reloadCars');
            }, error => {
                console.log('error: ' + JSON.stringify(error));
            });
    }
}



@Component({
    templateUrl: 'build/modals/edit_car.html'
})
class EditCar {
    //car: CarModel;
    car: any = {};

    constructor(params: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController) {
        this.car = { brand: params.data.brand, model: params.data.model, status: params.data.status, year: params.data.year, image: params.data.image, dimensions: params.data.dimensions, engines: params.data.engines, types: params.data.types, price: params.data.price, description: params.data.description, id: params.data.id };
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    save() {
        this.viewCtrl.dismiss(this.car);
    }
}
