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
    let mainDoc = new DocList("45.5051,-122.6750,100", "Joseph", undefined, undefined);
    
    mainDoc.Call();
    
    
   
    
    it("Creates object properly", function () {
        expect(mainDoc).toBeDefined();
        
    });
    it("Receives API input", function(){
        jasmine.clock().tick(600);
        expect(mainDoc.responsetext).toBeDefined();
    });
    it("parses data into entries array", function () {
        jasmine.clock().tick(600);
        expect(mainDoc.entries).toBeDefined();
    });
});