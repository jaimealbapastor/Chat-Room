/**
 * @author Marc Gaetano
 */

// To use this function an make an AJAX request, just buid one object
// like 'new simpleAjax(url,method,parameters,onSuccess,onFailure' with
// * url: the PHP script you want to call on the server
// * method: 'get' or 'post'
// * parameters: the parameters of the PHP script (like "name=Marc&nationality=French")
// * onSuccess: the function to call after the request succeeded
// * onFailure: the function to call after the request failed
function simpleAjax(url, method, parameters, onSuccess, onFailure) {

    function getMethod(method) {
        if (typeof method != "string")
            throw method + ": bad method (choose 'GET' or 'POST')";
        method = method.trim().toLowerCase();
        if (method != 'get' && method != 'post')
            throw method + ": bad method (choose 'GET' or 'POST')";
        return method;
    }

    function orsc(xmlhttp) {
        return function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                onSuccess(xmlhttp);
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 404)
                onFailure(xmlhttp);
        }
    }

    this.url = url;
    this.method = getMethod(method);
    this.parameters = parameters;
    this.xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    this.xmlhttp.onreadystatechange = orsc(this.xmlhttp);

    if (this.method == 'get') {
        if (this.parameters == "")
            this.xmlhttp.open("GET", this.url, true);
        else
            this.xmlhttp.open("GET", this.url + "?" + this.parameters, true);
        this.xmlhttp.send();
    }
    else {
        this.xmlhttp.open("POST", this.url, true);
        this.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xmlhttp.send(this.parameters);
    }
}