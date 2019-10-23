export class DocList {

    constructor(location, firstname, lastname, query) {
        this.location = location != "" ? `location=${location}` : "";
        
        this.name = (firstname != "") ? `&first_name=${firstname}` : "";

        this.name += (lastname != "") ? `&last_name=${lastname}` : "";

        this.query = (query != undefined) ? ("&query=" + query.split(' ').join('%20')) : "";
        this.url = `https://api.betterdoctor.com/2016-03-01/doctors?${this.location}&skip=2&limit=10${this.query}${this.name}&user_key=` + process.env.API_KEY;
        this.responsetext = [];
        this.entries = [];
    }
    Call() {
        let theobj = this;
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                theobj.responsetext = JSON.parse(this.responseText);
                theobj.Parse();
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
            var newdoc = `<blockquote> <div class='container'>`;
            console.log(thisone.specialties);
            thisone.practices.forEach(function (prctce) {

                newdoc += `City: ${prctce.visit_address.city}<br> Latitude: ${prctce.visit_address.lat} <br> Longitude: ${prctce.visit_address.lon} <br> State:${prctce.visit_address.state} (${prctce.visit_address.state_long})<br> Street:${prctce.visit_address.street}<br> ZIP: ${prctce.visit_address.zip}`;
                newdoc += "<br> <div> Languages";
                prctce.languages.forEach(function (lang) {
                    newdoc += `${lang.name} (${lang.code})`;
                });
                newdoc+= "<br>Phone number:<br>"
                prctce.phones.forEach(function(phone){
                    newdoc += `${phone.number}`;
                    
                })
                newdoc += `</div> </blockquote>`;
                console.log(prctce.phones);
                
            });
            theobj.entries.push(newdoc);
            console.log(theobj.entries);
        });
    }
}