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
        $("#loading").show();

        setTimeout(() => {
            $("#loading").hide();
            if (mainDoc.entries.length != 0){
                mainDoc.entries.forEach( function(entry) {
                    $("#doc").append(entry);

                });

            }
            else{
                $("#doc").html(mainDoc.statusread);
                $("#doc").append("No entries to display, try again.");
            }
        }, 2500);

    });





});