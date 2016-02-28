var should = require('chai').should(),
    expect = require('chai').expect,
    aamva = require('../index');

    var data = '@ ANSI 636045030002DL00410231ZW02720051DLDCANONEDCBNONEDCDNONEDBA07212017DCSIMLAYDOEDCTJOHN J GDCUDBD09252012DBB07211988DBC1DAYBLUDAU069 inDCE3DAG6224 8TH AVE NWDAISEATTLEDAJWADAK981082136  DAQIMLAYSJ122N6DCFIMLAYSJ126N632122691B1507DCGUSADCHNONE ZWZWA122691B1507ZWBZWC32ZWDZWEZWFRev09162009'

    var res = aamva.parse(data);


describe('state', function() {
    it('should be set to WA', function(){
        expect(res.state).to.equal("WA");
    });
});

describe('address', function() {
    it('should be set to 5929 N ROCK ST', function(){
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
