function checkspecialchar(str: string) {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
    return !format.test(str);
}
function JSONlength(json: Object) : number {
    return Object.keys(json).length;
}
function JSONvalidator(jsonbody: any,expected_length: number, expected_property: any){
    var flag_check = true;
    if(JSONlength(jsonbody) != expected_length){
        return false;
    }
    for(var i in expected_property) {
        flag_check=jsonbody.hasOwnProperty(expected_property[i]);
        if(flag_check == false)
            return flag_check
        flag_check=checkspecialchar(jsonbody[expected_property[i]]);
        if(flag_check == false)
            return flag_check
    }
}
module.exports = {
    checkspecialchar,
    JSONvalidator
}