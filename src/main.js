import $ from 'jquery'
import {
    DocList
} from './Doctor';
import './styles.css';
$(document).ready(function () {
    // This code depends on jQuery Core and Handlebars.js 
    $("#docform").submit(function () {
        event.preventDefault();
        var loc = $("#location").val();
        var lastname = $("#lastname").val();
        var firstname = $("#firstname").val();
        var query = $("#query").val();
        var distance = $("#distance").val();
        let mainDoc = new DocList(loc, firstname, lastname, query, distance);
        console.log(mainDoc);



        setTimeout(() => {
            mainDoc.entries.forEach(entry => {
                $("#doc").append(entry);
                console.log(entry);
            });
        }, 5000);

    });





});