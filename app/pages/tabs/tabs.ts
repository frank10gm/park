import { Component } from '@angular/core';
import { MarchePage } from '../marche/marche';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { ModalController, ViewController, NavParams } from 'ionic-angular';
import { CarModel} from '../../classes/CarModel.ts';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

    private tab1Root: any;
    private tab2Root: any;
    private tab3Root: any;

    constructor(public modalCtrl: ModalController) {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tab1Root = MarchePage;
        this.tab2Root = AboutPage;
        this.tab3Root = ContactPage;
    }

    presentModalAddCar() {
        let add_car_modal = this.modalCtrl.create(AddCar, { marca: 'scoreggia' });
        add_car_modal.onDidDismiss(data => {
            console.log(data);
        });
        add_car_modal.present();
    }
}


@Component({
    templateUrl: 'build/modals/add_car.html'
})
class AddCar {
    car = new CarModel();

    constructor(params: NavParams, public viewCtrl: ViewController) {

    }

    dismiss(){
        this.viewCtrl.dismiss();
     }

     save(car){
         this.viewCtrl.dismiss(car);
     }
}
