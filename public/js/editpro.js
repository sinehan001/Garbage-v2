var val = document.getElementById('bio').value;
document.getElementById('char').innerHTML=val.length+'/60 characters';
  function run()
  {
    var val = document.getElementById("email").value;
    if(val.indexOf("@")==-1||val.indexOf("@")==val.length-1)
    {
      document.getElementById("email").value="";
      alert("Please Enter valid email address");
    }
  }
  function mob()
  {
    var num = document.getElementById("number").value;
    var snum = num.toString();
    if(snum.length!=10)
    {
      document.getElementById("number").value="";
      alert("Please enter valid Phone Number");
    }
  }
  function mserver()
  {
    document.getElementById("formimg").submit();
  }
  function checkup()
  {
    var val = document.getElementById('bio').value;
    document.getElementById('char').innerHTML=val.length+'/60 characters';
  }
  function count(obj){
    document.getElementById("char").innerHTML = obj.value.length+'/60 characters';
}
    function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});