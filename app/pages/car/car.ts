import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: 'build/pages/car/car.html'
})
export class CarPage {
    car: any;
    brand: any;

    constructor(public navCtrl: NavController, navParams: NavParams, private http: Http, public events: Events, public alertCtrl: AlertController) {
        this.car = navParams.get('car');
        this.brand = navParams.get('marca');
        console.log(JSON.stringify(this.car));
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
                        if(data.password == 'deletami'){
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
