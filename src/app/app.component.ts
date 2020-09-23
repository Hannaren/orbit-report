import { Component } from '@angular/core';
import { Satellite } from './satellite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'orbit-report';
  sourceList: Satellite[];
  displayList: Satellite[];
  typeList: { "type": string, "count": number }[];

  // constructor() {
  //   this.sourceList = [
  //      new Satellite("SiriusXM", "Communication", "2009-03-21", "LOW", true),
  //      new Satellite("Cat Scanner", "Imaging", "2012-01-05", "LOW", true),
  //      new Satellite("Weber Grill", "Space Debris", "1996-03-25", "HIGH", false),
  //      new Satellite("GPS 938", "Positioning", "2001-11-01", "HIGH", true),
  //      new Satellite("ISS", "Space Station", "1998-11-20", "LOW", true),
  //   ];
  // }

  constructor() {
    this.sourceList = [];
    this.displayList = [];
    this.typeList = [];

    let satellitesUrl = 'https://handlers.education.launchcode.org/static/satellites.json';
    let typesPresent = {};


    window.fetch(satellitesUrl).then(function(response) {
       response.json().then(function(data) {
 
          let fetchedSatellites = data.satellites;
          for (let s of fetchedSatellites) {
            let satellite = new Satellite (s.name, s.type, s.launchDate, s.orbitType, s.operational)
            this.sourceList.push(satellite)
          }

          for (let fs of fetchedSatellites) {
            typesPresent[fs.type] = typesPresent[fs.type] === undefined ? 1 : typesPresent[fs.type] += 1;
          }
  
          for (let key in typesPresent) {
            let value = typesPresent[key];
            this.typeList.push({ "type": key, "count": value });
          }
          
          this.displayList = this.sourceList.slice(0);
       }.bind(this));
    }.bind(this));
  }

  search(searchTerm: string): void {
    let matchingSatellites: Satellite[] = [];
    let typesPresent = {};
    searchTerm = searchTerm.toLowerCase();
    this.typeList = [];
    for (let i = 0; i < this.sourceList.length; i++) {
      let name = this.sourceList[i].name.toLowerCase();
      if (name.indexOf(searchTerm) >= 0) {
        matchingSatellites.push(this.sourceList[i]);
      }
    }

    for (let ms of matchingSatellites) {
      typesPresent[ms.type] = typesPresent[ms.type] === undefined ? 1 : typesPresent[ms.type] += 1;
    }

    for (let key in typesPresent) {
      let value = typesPresent[key];
      this.typeList.push({ "type": key, "count": value });
    }
    this.displayList = matchingSatellites;
  }
}


