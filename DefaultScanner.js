"use strict";

import Scanner from "./Scanner";

class DefaultScanner extends Scanner {

    /**
     * @param {String} data
     * @returns {Array}
     */
    getVersionMatch(data){
        return data.match(/(ANSI |AAMVA)\d{6}(\d{2})/);
    }

    /**
     *
     * @param {String} data
     * @returns {Object}
     */
    scan(data) {
        function getPdf417Parsed(data, separator) {

            if(!separator) {
                separator = '\n';
            }

            // get version of aamva (before 2000 or after)
            var versionMatch = this.getVersionMatch(data);
            // var versionMatch = data.match(/(ANSI |AAMVA)\d{6}(\d{2})/);
            /* version 01 year 2000 */
            if(!versionMatch) {
                console.log('unable to get version');
                return;
            }

            var parsedData = {};

            var version = Number(versionMatch[2]);
            parsedData.version = version;

            var parseRegex;

            for (var i = 0; i <= Scanner.FIELDS.length - 1; i++) {
                //var regex = new RegExp(Scanner.FIELDS[i] + '[^' + separator + ']+' + separator);
                //console.log("Field is: " + Scanner.FIELDS[i]);
                var regex = new RegExp('(' + Scanner.FIELDS[i] + '[0-9a-zA-z ]+' + ')' + '+');
                var match = regex.exec(data);

                if(match != null) {
                    console.log();
                    console.log("regex is: " + regex);
                    console.log("***MATCHED: " + match);
                } else {
                    console.log(regex + " -> not found");
                }

                if(match){
                    // TODO: FIX THIS
                    console.log("Match[0] is " + match[0]);

                    if(match[0].slice(3, match[0].length)) {
                        //parsedData[Scanner.FIELDS[i]] = match[0].slice(3, match[0].length - 1).trim();
                        parsedData[Scanner.FIELDS[i]] = match[0].slice(3, match[0].length).trim();
                        console.log("NEW parse is: " + parsedData[Scanner.FIELDS[i]] );
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
            console.log("DATA IS: " + data);
            console.log("SEPARATOR IS: " + separator);  //undefined
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
                // TODO (remove comment) "dl": parsedData.DAQ.replace(' ', ''),
                "expiration_date": parsedData.DBA,
                /*TODO (remove comment) "birthday": function() {
                 var dob = parsedData.DBB.match(/(\d{2})(\d{2})(\d{4})/);
                 dob[1] = parseInt(dob[1]);
                 dob[2] = parseInt(dob[2]);
                 dob[3] = parseInt(dob[3]);

                 return (
                 new Date(
                 Date.UTC(dob[3], dob[1], dob[2])
                 )
                 );
                 },*/
                "dob": parsedData.DBB,
                "dl_overflow": undefined,
                "cds_version": undefined,
                "aamva_version": parsedData.version,
                "jurisdiction_version": undefined,
                // TODO (remove comment) "postal_code": parsedData.DAK.match(/\d{-}\d+/)? parsedData.DAK : parsedData.DAK.substring(0,5),
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
                    // TODO (remove comment) return parsedData.DAQ.replace(/[^A-ZA-Z0-9]/g, "");
                }
            };

            return rawData;
        };
    }

}

export {DefaultScanner};
export default DefaultScanner;
