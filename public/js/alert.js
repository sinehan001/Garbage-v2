function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
    }
    return "";
  }
if(getCookie("alert")) {
    console.log(document.cookie);
    document.getElementsByClassName('alert')[0].style.display="block";
    document.cookie = 'alert=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}