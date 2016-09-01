import { Component } from '@angular/core';
import { MarchePage } from '../marche/marche';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { ModalController, ViewController, NavParams, AlertController, Events } from 'ionic-angular';
import { CarModel } from '../../classes/CarModel.ts';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import myGlobals = require('../../res/globals');

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

    private tab1Root: any;
    private tab2Root: any;
    private tab3Root: any;

    constructor(public modalCtrl: ModalController, private http: Http, public events: Events) {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tab1Root = MarchePage;
        //this.tab2Root = AboutPage;
        this.tab3Root = ContactPage;
    }

    saveCarDb(data) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        if(data.status == null || data.status == ''){
            data.status = '0';
        }

        let link = 'http://www.stritwalk.com/Park/api/';
        var body = 'action=uploadCar&marca=';
        body += data.brand;
        body += '&modello=' + data.model;
        body += '&vecchio=' + data.status;
        body += '&motori=' + data.engines;
        body += '&serieNuova=' + data.year;
        body += '&immagine=' + data.image
        body += '&dimensioni=' + data.dimensions;
        body += '&modelli=' + data.types;
        body += '&prezzo=' + data.price;
        body += '&descrizione=' + data.description;

        this.http.post(link, body, options)
            .map(res => res.json())
            .subscribe(data => {
                console.log('success: ' + JSON.stringify(data));
            }, error => {
                console.log('error: ' + error._body);
            });
    }

    presentModalAddCar() {
        let add_car_modal = this.modalCtrl.create(AddCar, { brand: myGlobals.selectedBrand.marca });
        add_car_modal.onDidDismiss(data => {
            if(data){
                this.saveCarDb(data);
                this.events.publish('reloadCars');
            }
        });
        add_car_modal.present();
    }
}


@Component({
    templateUrl: 'build/modals/add_car.html'
})
class AddCar {
    //car: CarModel;
    car: any = {};
    abilita_marca: any;

    constructor(params: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController) {
        this.car = new CarModel(params.data.brand);
        if (params.data.brand != '') {
            this.abilita_marca = true;
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    save() {
        if (this.car.brand != '' && this.car.model != '') {
            this.viewCtrl.dismiss(this.car);
        } else {
            let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: '"Brand" and "Model" are required.',
                buttons: ['Dismiss']
            });
            alert.present();
        }
    }
}
