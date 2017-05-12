

var parse = function(data, separator) {
    // replace spaces with regular space
    //data = data.replace(/\s/g, " ");

    if ( /^@/.test(data) === true ) {
        return pdf417(data, separator);
    } else if ( /^%/.test(data) === true  ) {
        return stripe(data);
    } else {
        console.log('Couldn\'t identify format');
    }
};

var stripe = function(data) {
    //data = data.replace(/\n/, "");
    // replace spaces with regular space
    data = data.replace(/\s/g, " ");
    var track = data.match(/(.*?\?)(.*?\?)(.*?\?)/);
    var res1 = track[1].match(/(\%)([A-Z]{2})([^\^]{0,13})\^?([^\^]{0,35})\^?([^\^]{0,29})\^?\s*?\?/);
    var res2 = track[2].match(/(;)(\d{6})(\d{0,13})(\=)(\d{4})(\d{8})(\d{0,5})\=?\?/);
    var res3 = track[3].match(/(\#|\%|\+)(\d|\!|\")(\d|\s)([0-9A-Z ]{11})([0-9A-Z ]{2})([0-9A-Z ]{10})([0-9A-Z ]{4})([12 ]{1})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})(.*?)\?/);
    return {
        "state": res1[2],
        "city": res1[3],
        "name": function() {
            var res = res1[4].match(/([^\$]{0,35})\$?([^\$]{0,35})?\$?([^\$]{0,35})?/);
            return {
                last: res[1],
                first: res[2],
                middle: res[3]
            }
        },
        "address": res1[5],
        "iso_iin": res2[2],
        "dl": res2[3],
        "expiration_date": res2[5],
        "birthday": function() {
            var dob = res2[6].match(/(\d{4})(\d{2})(\d{2})/);
            dob[1] = parseInt(dob[1]);
            dob[2] = parseInt(dob[2]);
            dob[3] = parseInt(dob[3]);

            if (dob[2] === 99) {
                /* FL decided to reverse 2012 aamva spec, 99 means here
                 that dob month === to expiration month, it should be
                 opposite
                 */
                var exp_dt = res2[5].match(/(\d{2})(\d{2})/);
                dob[2] = parseInt(exp_dt[2]);
            }
            dob[2]--;

            return (new Date(Date.UTC(dob[1], dob[2], dob[3])));
        },
        "dl_overflow": res2[7],
        "cds_version": res3[1],
        "jurisdiction_version": res3[2],
        "postal_code": res3[4],
        "class": res3[5],
        "restrictions": res3[6],
        "endorsments": res3[7],
        "sex": function() {
            switch(Number(res3[8])) {
                case 1:
                    return "MALE";
                    break;
                case 2:
                    return "FEMALE";
                    break;
                default:
                    return "MISSING/INVALID";
                    break;
            }
        },
        "height": res3[9],
        "weight": res3[10],
        "hair_color": res3[11],
        "eye_color": res3[12],
        "misc": res3[13],
        "id": function(){
            var id;
            switch(this.state) {
                case "FL":
                    var res = res2[3].match(/(\d{2})(.*)/);
                    id = (String.fromCharCode(Number(res[1]) + 64)  + res[2] + res2[7]);
                    break;
                default:
                    id = res2[3];
                    break;
            }
            return id;
        }
    };
};

function getPdf417Parsed(data, separator) {

    if(!separator) {
        separator = '\n';
    }

    // get version of aamva (before 2000 or after)
    var versionMatch = String(data).match(/(ANSI |AAMVA)\d{6}(\d{2})/);
    /* version 01 year 2000 */
    if(!versionMatch) {
        console.log('unable to get version');
        return;
    }

    var parsedData = {};

    var version = Number(versionMatch[2]);
    parsedData.version = version;

    var parseRegex;
    var fields = [
        'DAA',
        'DAB',
        'DAC',
        'DAD',
        'DAE',
        'DAF',
        'DAG',
        'DAH',
        'DAI',
        'DAJ',
        'DAK',
        'DAL',
        'DAM',
        'DAN',
        'DAO',
        'DAP',
        'DAQ',
        'DAR',
        'DAS',
        'DAT',
        'DAU',
        'DAV',
        'DAW',
        'DAX',
        'DAY',
        'DAZ',
        'DBA',
        'DBB',
        'DBC',
        'DBD',
        'DBE',
        'DBF',
        'DBG',
        'DBH',
        'DBI',
        'DBJ',
        'DBK',
        'DBL',
        'DBM',
        'DBN',
        'DBO',
        'DBP',
        'DBQ',
        'DBR',
        'DBS',
        'DCA',
        'DCB',
        'DCD',
        'DCE',
        'DCF',
        'DCG',
        'DCH',
        'DCI',
        'DCJ',
        'DCK',
        'DCL',
        'DCM',
        'DCN',
        'DCO',
        'DCP',
        'DCQ',
        'DCR',
        'DCS',
        'DCT',
        'DCU',
        'DDA',
        'DDB',
        'DDC',
        'DDD',
        'DDE',
        'DDF',
        'DDG',
        'DDH',
        'DDI',
        'DDJ',
        'DDK',
        'DDL',
        'PAA',
        'PAB',
        'PAC',
        'PAD',
        'PAE',
        'PAF'
    ];

    for (var i = 0; i <= fields.length - 1; i++) {
        //var regex = new RegExp(fields[i] + '[^' + separator + ']+' + separator);
        //console.log("Field is: " + fields[i]);
        var regex = new RegExp('(' + fields[i] + '[0-9a-zA-z ]+' + ')' + '+');
        var match = regex.exec(data);

        //----------------------------------
        // For debugging:
        //----------------------------------
        // if(match != null) {
        //     console.log("regex is: " + regex);
        //     console.log("***MATCHED: " + match);
        // } else {
        //     console.log(regex + " -> not found");
        // }

        if(match){
            // TODO: double check this
            if(match[0].slice(3, match[0].length)) {
                //parsedData[fields[i]] = match[0].slice(3, match[0].length - 1).trim();
                parsedData[fields[i]] = match[0].slice(3, match[0].length).trim();
            }
        }
    }

    console.log("Parsed data is: " + parsedData);

    // version 3 putting middle and first names in the same field
    if(parsedData.hasOwnProperty('DCT')) {
        var name = parsedData.DCT.split(',');
        parsedData.DAC = name[0]; // first name
        parsedData.DAD = name[1] ? name[1] : '' ; // middle name
    }
    if(parsedData.hasOwnProperty('DAQ')) {
        parsedData.DAQ = parsedData.DAQ.replace(/ /g, '');
        parsedData.DAQ = parsedData.DAQ.replace(/-/g, '');
    }

    if(parsedData.hasOwnProperty('DAA')) {
        var name = parsedData.DAA.split(',');
        parsedData.DCS = name[0];
        parsedData.DAC = name[1];
        parsedData.DAD = name[2];
    }

    if(parsedData.hasOwnProperty('DAR')) {
        parsedData.DCA = parsedData.DAR;
    }

    if(Number(version) === 1 && parsedData.hasOwnProperty('DBB')) {
        // date on 01 is CCYYMMDD while on 07 MMDDCCYY
        parsedData.DBB = (
            parsedData.DBB.substring(4,6) +  // month
            parsedData.DBB.substring(6,8) +  // day
            parsedData.DBB.substring(0,4)    // year
        );
    };
    if(Number(version) === 1 && parsedData.hasOwnProperty('DAL')) {
        // Because fuck oregon.
        parsedData.DAG = parsedData.DAG || parsedData.DAL;
    }
    return parsedData;
};

var pdf417 = function(data, separator) {
    var parsedData = getPdf417Parsed(data, separator);
    var rawData = {
        "state": parsedData.DAJ,
        "city": parsedData.DAI,
        "name": function() {
            return {
                last: parsedData.DCS,
                first: parsedData.DAC,
                middle: parsedData.DAD
            }
        },
        "address": parsedData.DAG,
        "iso_iin": undefined,
        // Because Michigican puts spaces in their license numbers. Why...
        "dl": parsedData.DAQ.replace(' ', ''),
        "expiration_date": parsedData.DBA,
        "birthday": function() {
         var dob = parsedData.DBB.match(/(\d{2})(\d{2})(\d{4})/);
         dob[1] = parseInt(dob[1]);
         dob[2] = parseInt(dob[2]);
         dob[3] = parseInt(dob[3]);

         return (
         new Date(
         Date.UTC(dob[3], dob[1], dob[2])
         )
         );
         },
        "dob": parsedData.DBB,
        "dl_overflow": undefined,
        "cds_version": undefined,
        "aamva_version": parsedData.version,
        "jurisdiction_version": undefined,
        "postal_code": parsedData.DAK.match(/\d{-}\d+/)? parsedData.DAK : parsedData.DAK.substring(0,5),
        "class": parsedData.DCA,
        "restrictions": undefined,
        "endorsments": undefined,
        "sex": function() {
            switch( Number(parsedData.DBC) ) {
                case 1:
                    return "MALE";
                    break;
                case 2:
                    return "FEMALE";
                    break;
                default:
                    return "MISSING/INVALID";
                    break;
            }
        },
        "height": undefined,
        "weight": undefined,
        "hair_color": undefined,
        "eye_color": undefined,
        "misc": undefined,
        "id": function(){
            return parsedData.DAQ.replace(/[^A-ZA-Z0-9]/g, "");
        }
    };

    return rawData;
};


//------------------------------------------------------------
// DEBUGGING:
//------------------------------------------------------------

// var barcode_data = '@\n\u001e\rANSI 636045030002DL00410231ZW02720059DLDCANONE\nDCBNONE\nDCDNONE\nDBA11282017\nDCSHELLE\nDCTKYLE JOSEPH\nDCU\nDBD11202012\nDBB11281991\nDBC1\nDAYBLU\nDAU072 in\n6867694\nDAG4107 SW AUSTIN ST\nDAISEATTLE\nDAJWA\nDAK981362109  \nDAQHELLEKJ096Q8\nDCFHELLEKJ096Q832123253H1601\nDCGUSA\nDCHNONE\n\rZWZWA123253H1601\nZWB\nZWC32\nZWD\nZWE11282012\nZWFRev09162009\n\r';
//
// var parsedResult = pdf417(barcode_data);
// console.log("DMV ID:", parsedResult.id()); /* D621720820090 */
// console.log("First name:", parsedResult.name().first); /* JOHN */
// console.log("Last name:", parsedResult.name().last); /* DOE */
// console.log("Middle name:", parsedResult.name().middle); /* "" */
// console.log("Sex:", parsedResult.sex()); /* MALE, FEMALE, MISSING/INVALID */
// console.log("DOB:", parsedResult.birthday()); /* Thu Jan 08 1987 00:00:00 GMT-0500 (EST) */
// console.log("Entire object", parsedResult);


module.exports.parse = parse;
module.exports.stripe = stripe;
module.exports.pdf417 = pdf417;
module.exports.getPdf417Parsed = getPdf417Parsed;
