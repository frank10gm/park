import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { CarsPage } from '../cars/cars';

@Component({
    templateUrl: 'build/pages/marche/marche.html'
})
export class MarchePage {

    private searchQuery: string = '';
    private marche: any;
    private s_marche: any;

    constructor(private navCtrl: NavController, navParams: NavParams, private http: Http) {
        this.initializeMarche();
    }

    initializeMarche() {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        let link = 'http://www.stritwalk.com/Park/api/';
        let body2 = 'action=getMarche';
        let body = JSON.stringify({ action: 'getMarche' });

        this.http.post(link, body2, options)
            .map(res => res.json())
            .subscribe(data => {
                this.marche = data;
                this.initializeSearch();
            }, error => {
                console.log('error: ' + error._body);
            });
    }

    initializeSearch() {
        this.s_marche = this.marche;
    }

    //openMarche
    openMarca(event, marca) {
        this.navCtrl.push(CarsPage, {
            marca: marca
        });
    }

    searchMarche(ev: any) {
        this.initializeSearch();

        let val = ev.target.value;

        if (val && val.trim() != '') {
            this.s_marche = this.s_marche.filter((marca) => {
                return (marca.marca.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
    }
}
