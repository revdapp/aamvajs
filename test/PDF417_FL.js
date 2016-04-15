var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');

describe('Florida - AAMVA Version 1', function() {
    var data = '@ANSI 6360100102DL00390190ZF02290063DLDAADOE,JOHN\nDAG5929 N ROCK ST\nDAIDELRAY SHORE\nDAJFL\nDAK44556-     \nDAQJ641720820450\nDARI   \nDAS          \nDAT     \nDBA20210108\nDBB19770208\nDBC1\nDBD20120612\nDBHN         \nDAU600ZFZFAREPLACED: 00000000ZFB ZFCP771206120090ZFD ZFE07-01-11';

    var res = aamva.parse(data);


    describe('state', function() {
        it('should be set to FL', function(){
            expect(res.state).to.equal("FL");
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
