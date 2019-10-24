export class DocList {

    constructor(location, firstname, lastname, query, distance) {
        this.location = location;
        this.name = (firstname != "") ? `&first_name=${firstname}` : "";
        this.name += (lastname != "") ? `&last_name=${lastname}` : "";
        this.query = (query != "") || typeof query != String ? ("&query= " + query.split(' ').join('%20')) : " ";
        this.geoURL = `https://api.geocod.io/v1.4/geocode?q=${this.location}&limit=1&api_key=` + process.env.GEO_KEY;
        this.distance = distance;
        this.responsetext = [];
        this.entries = [];
        this.georesponsetext = [];

    }
    CallGeo() {
        let theobj = this;
        let georequest = new XMLHttpRequest();
        georequest.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                theobj.georesponsetext = JSON.parse(this.response);
                console.log(theobj.georesponsetext);
                try {
                    theobj.location = theobj.georesponsetext.results[0].location.lat + "," + theobj.georesponsetext.results[0].location.lng;

                } catch (error) {
                    console.log("This location isn't formatted properly!");
                }
                theobj.Call();
            } else if (this.readyState === 4 && this.status === 400) {
                console.log("Invalid query.");
            } else if (this.readyState === 4 && this.status === 401) {
                console.log("UNAUTHORIZED ERROR, BEEP BOOP");
            } else if (this.readyState === 4 && this.status === 422) {
                console.log("Can't process!");
            }
        }
        georequest.open("GET", theobj.geoURL, true);
        georequest.send();


    }
    Call() {
        this.url = `https://api.betterdoctor.com/2016-03-01/doctors?location=${this.location},${this.distance}&skip=2&limit=5${this.query}${this.name}&user_key=` + process.env.API_KEY;
        let theobj = this;
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {
                theobj.responsetext = JSON.parse(this.responseText);
                theobj.Parse();
            } else if (this.readyState === 4 && this.status === 400) {
                console.log("Invalid query.");
            } else if (this.readyState === 4 && this.status === 401) {
                console.log("UNAUTHORIZED ERROR, BEEP BOOP");
            }
        }
        request.open("GET", this.url, true);
        request.send();
    }
    Parse() {
        var theobj = this;
        //profile contains vars of: first_name, middle_name, last_name, slug,
        //  title, image_url, gender, languages (name, code), bio
        // we're using practices data, specifically accepts_new_patients, distance, office_hours, phones, and visit_address

        this.responsetext.data.forEach(function (thisone) {
            console.log(thisone.profile.slug.split('-').join(" "));
            console.log(thisone.profile.first_name);
            console.log(thisone.profile.last_name);
            var newdoc = `<div class='maindoc container'> ${thisone.profile.first_name} ${thisone.profile.last_name} <br>`;
            newdoc += `<img src='${thisone.profile.image_url}'></img><br> Specialties:`;
            thisone.specialties.forEach(function (special) {
                newdoc += `<div class='container'>${special.name}<br></div>`;

            });
            console.log(thisone.specialties);

            thisone.practices.forEach(function (prctce) {

                newdoc += `<div class='bordered container'> Practice: ${prctce.name} <br>  City: ${prctce.visit_address.city}<br> Latitude: ${prctce.visit_address.lat} <br> Longitude: ${prctce.visit_address.lon} <br> State:${prctce.visit_address.state} (${prctce.visit_address.state_long})<br> Street:${prctce.visit_address.street}<br> ZIP: ${prctce.visit_address.zip}`;
                newdoc += "<br>  Languages: <br>";
                prctce.languages.forEach(function (lang) {
                    newdoc += `${lang.name} (${lang.code})`;
                });

                newdoc += "<div class='phonedoc'><br>"
                prctce.phones.forEach(function (phone) {
                    newdoc += `${phone.type}: ${phone.number}`;

                });
                newdoc += "</div>";
                newdoc += `</div> `;
                console.log(prctce.phones);

            });
            theobj.entries.push(newdoc);
            console.log(theobj.entries);
        });
    }
}