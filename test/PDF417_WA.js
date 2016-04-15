var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');


describe('Washington - AAMVA Version 3', function() {
    var data = '@ ANSI 636045030002DL00410231ZW02720051DL\nDCANONE\nDCBNONE\nDCDNONE\nDBA07212017\nDCSIMLAYDOE\nDCTJOHN J GDCU\nDBD09252012\nDBB07211988\nDBC1\nDAYBLU\nDAU069 in\nDCE3DAG6224 8TH AVE NW\nDAISEATTLE\nDAJWA\nDAK981082136  \nDAQIMLAYSJ122N6\nDCFIMLAYSJ126N632122691B1507\nDCGUSADCHNONE ZWZWA122691B1507ZWBZWC32ZWDZWEZWFRev09162009'

    var res = aamva.parse(data, '\n');

    describe('state', function() {
        it('should be set to WA', function(){
            expect(res.state).to.equal("WA");
        });
    });

    describe('address', function() {
        it('should be set to 6224 8TH AVE NW', function(){
            expect(res.address).to.equal("6224 8TH AVE NW");
        });
    });

    describe('gender', function() {
        it('should be set to MALE', function(){
            expect(res.sex()).to.equal("MALE");
        });
    });

    describe('name', function() {
        it('first should be set to JOHN', function(){
            expect(res.name().first).to.equal("JOHN J GDCU");
        });
        it('last should be set to DOE', function(){
            expect(res.name().last).to.equal("IMLAYDOE");
        });
    });

    describe('dob', function() {

        it('should be 07211988', function(){
            expect(res.dob).to.equal('07211988');
        });

    });

    describe('postal_code', function() {
        it('should be 98108', function(){
            expect(res.postal_code).to.equal("98108");
        });

    });
});
