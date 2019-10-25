export class DocList {

    constructor(location, firstname, lastname, query, distance) {
        this.location = location;
        this.name = (firstname != "") ? `&first_name=${firstname}` : "";
        this.name += (lastname != "") ? `&last_name=${lastname}` : "";
        this.query = (query != "") || typeof query == String ? ("&query= " + query.split(' ').join('%20')) : " ";
        this.geoURL = `https://api.geocod.io/v1.4/geocode?q=${location}&limit=1&api_key=` + process.env.GEO_KEY;
        this.distance = distance != "" || typeof distance == Number ? ","+ distance : ', 100';
        this.responsetext = [];
        this.entries = [];
        this.georesponsetext = [];
        this.url;
        this.statusread = "";
        if(location.length == 0 || location == '' || location == null || location == undefined){
            console.log("Hello")
            this.url = `https://api.betterdoctor.com/2016-03-01/doctors?skip=2&limit=5${this.query}${this.name}&user_key=` + process.env.API_KEY;
            this.Call();
        }
        else{
            
         
            this.CallGeo();
        }
    }
    CallGeo() {
    
        let theobj = this;
        let georequest = new XMLHttpRequest();
        georequest.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                theobj.georesponsetext = JSON.parse(this.response);

                setTimeout(() => {
                    

                try {
                    theobj.location = theobj.georesponsetext.results[0].location.lat + "," + theobj.georesponsetext.results[0].location.lng;
                    theobj.url = `https://api.betterdoctor.com/2016-03-01/doctors?location=${theobj.location}${theobj.distance}&skip=2&limit=5${theobj.query}${theobj.name}&user_key=` + process.env.API_KEY;
                                theobj.Call();
                } catch (error) {
                    theobj.statusread = "The Geocoding API says this is not formatted properly.<br>";

                }
            }, 1000);

            } else if (this.readyState === 4 && this.status === 400) {
                theobj.statusread = "Geocoding API:Invalid query.";
                
            } else if (this.readyState === 4 && this.status === 401) {
                theobj.statusread = "Geocoding API:Unauthorized error!";
                
            } else if (this.readyState === 4 && this.status === 422) {
                theobj.statusread = "Geocoding API:Can't process!" 
                
            }
            
        }
        georequest.open("GET", theobj.geoURL, true);
        georequest.send();
       

    }
    Call() {
        
        let theobj = this;
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {
                theobj.responsetext = JSON.parse(this.responseText);
                theobj.Parse();
            } else if (this.readyState === 4 && this.status === 400) {
                theobj.statusread += "<br>Doctor API: Invalid query.";
                
            } else if (this.readyState === 4 && this.status === 401) {
                theobj.statusread += "<br>Doctor API:Unauthorized error!";
                
            } else if (this.readyState === 4 && this.status === 422) {
                theobj.statusread = "<br>Doctor API:Can't process!" 
                
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

            var newdoc = `<div class='maindoc container'> ${thisone.profile.first_name} ${thisone.profile.last_name} <br>`;
            newdoc += `<img src='${thisone.profile.image_url}'></img><br> Specialties:`;
            thisone.specialties.forEach(function (special) {
                newdoc += `<div class='container'>${special.name}<br></div>`;

            });


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


            });
            theobj.entries.push(newdoc);

        });
    }
}