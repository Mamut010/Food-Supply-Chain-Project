const params = location.search.slice(1).split('&').reduce((acc, s) => {
    const [k, v] = s.split('=')
    return Object.assign(acc, {[k]: v})
}, {})
if(params.message) {
    Swal.fire({
        title: decodeURI(queryDict.message),
        icon: 'error',
        confirmButtonColor: '#3085d6',
        footer: "<p>Contact your admin to if you don't have account</p>"
    })
}
var input = document.querySelector('.secret');
var show = document.querySelector('.show');
show.addEventListener('click', () => {
    if(input.type=="password"){
        input.type = "text";
        show.style.color = "#1DA1F2";
        show.textContent = "HIDE";
    }else{
        input.type = "password";
        show.textContent = "SHOW";
        show.style.color = "#111";
    }
})