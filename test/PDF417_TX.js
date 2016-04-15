var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');

describe('Texas - AAMVA Version 3', function() {
    var data = '@ANSI 636015030002DL00410217ZT02580015DLDCACDCBNONE\nDCDNONE\nDBA08042015\nDCSDOE\nDCTJOHN\nDBD08192014\nDBB02081977\nDBC1\nDAYBLK\nDAU 65 IN\nDAG5929 N ROCK ST\nDAIAUSTIN\nDAJTX\nDAK44556      \nDAQ38884194\nDCF18613490088119258857\nDCGUSA\nDCHNONE\nDAZBLK\nDCUZTZTA130ZTBA';

    var res = aamva.parse(data, '\n');


    describe('state', function() {
        it('should be set to TX', function(){
            expect(res.state).to.equal("TX");
        });
    });

    describe('address', function() {
        it('should be set to 5929 N ROCK ST', function(){
            expect(res.address).to.equal("5929 N ROCK ST");
        });
    });

    describe('gender', function() {
        it('should be set to MALE', function(){
            expect(res.sex()).to.equal("MALE");
        });
    });

    describe('name', function() {
        it('first should be set to JOHN', function(){
            expect(res.name().first).to.equal("JOHN");
        });
        it('last should be set to DOE', function(){
            expect(res.name().last).to.equal("DOE");
        });
    });

    describe('birthday', function() {
        it('year should be 1977', function(){
            expect(res.birthday().getUTCFullYear()).to.equal(1977);
        });

        it('month should be 02', function(){
            expect(res.birthday().getUTCMonth()).to.equal(2);
        });

        it('day should be 08', function(){
            expect(res.birthday().getUTCDate() ).to.equal(8);
        });
    });

    describe('postal_code', function() {
        it('should be 44556', function(){
            expect(res.postal_code).to.equal("44556");
        });

    });
});
