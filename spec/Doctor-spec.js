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
    let mainDoc = new DocList("45.5051, -122.6750,100", "Joseph", undefined, undefined);
    
    mainDoc.Call();
    
    
   
    
    it("Create object properly", function () {
        expect(mainDoc).toBeDefined();
        
    });
    it("Receive API input", function(){
        jasmine.clock().tick(600);
        expect(mainDoc.responsetext).toBeDefined();
    });
    it("parse data into entries array", function () {
        jasmine.clock().tick(600);
        expect(mainDoc.entries).toBeDefined();
    });
    it("catches errors", function(){
        let faildoc = new DocList("zhdhsdflahsfklhksdgf", "Joseph", undefined, undefined);
    expect(faildoc.responsetext.meta.http_status_code).toBe(401); 
    });
});