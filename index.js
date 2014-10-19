
module.exports = {
    stripe: function(data) {
        data = data.replace(/\n/, "");
        var track = data.match(/(.*?\?)(.*?\?)(.*?\?)/);
        var res1 = track[1].match(/(\%)([A-Z]{2})([^\^]{0,13})\^?([^\^]{0,35})\^?([^\^]{0,29})\^?\s*?\?/);
        var res2 = track[2].match(/(;)(\d{6})(\d{0,13})(\=)(\d{4})(\d{8})(\d{0,5})\=?\?/);
        var res3 = track[3].match(/(\#|\%)(\d|\!)(\d|\s)([0-9A-Z ]{11})([0-9A-Z ]{2})([0-9A-Z ]{10})([0-9A-Z ]{4})([12]{1})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})([0-9A-Z ]{3})(.*?)\?/);
        
        return {
            "state": res1[2],
            "city": res1[3],
            "name": res1[4],
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
            "birthday": res2[6],
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
                        return "FAMALE";
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
                var res = res2[3].match(/(\d{2})(.*)/);
                return (String.fromCharCode(Number(res[1]) + 64)  + res[2] + res2[7]);
            }
        };
    }
}
