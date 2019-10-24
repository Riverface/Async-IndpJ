import {
    DocList
} from "../src/Doctor";
beforeEach(function(){
jasmine.clock().install();
});
afterEach(function(){
jasmine.clock().uninstall();
});
describe("User can", function () {
    //location,firstname,lastname,query
    let mainDoc = new DocList("45.5051, -122.6750,100", "Joseph", undefined, "nose",'100');
    mainDoc.CallGeo();
    it("Create object properly", function () {
        expect(mainDoc).toBeDefined();
        
    });
    it("Receive API input", function(){
        
        setTimeout(() => {
            expect(mainDoc.responsetext).toBeDefined();
            
        }, 600);
    });
    it("parse data into entries array", function () {

        setTimeout(() => {
            expect(mainDoc.entries).toBeDefined();
            
        }, 600);

    });
    it("catches errors", function(){
        let faildoc = new DocList("zhdhsdflahsfklhksdgf", "Joseph", undefined, "nose ",'100');
        faildoc.CallGeo();
        setTimeout(() => {
     expect(faildoc.responsetext.meta.http_status_code).toBe(401); 
    
        }, 600);
    });
});