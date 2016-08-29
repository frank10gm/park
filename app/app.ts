import { Component, ViewChild } from '@angular/core';
import { Platform, ionicBootstrap, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { TabsPage } from './pages/tabs/tabs';


@Component({
    //template: '<ion-nav [root]="rootPage"></ion-nav>'
    templateUrl: 'build/app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    private rootPage: any;

    constructor(private platform: Platform) {
        this.rootPage = TabsPage;

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }
}

ionicBootstrap(MyApp);
