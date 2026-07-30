const API_URL = "http://localhost:3000/api/auth";

const signupForm = document.getElementById("signupForm");

if (signupForm) {

signupForm.addEventListener("submit", async (e)=>{

e.preventDefault();

const body = {

name: document.getElementById("name").value,

email: document.getElementById("email").value,

password: document.getElementById("password").value

};

const response = await fetch(`${API_URL}/signup`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body)

});

const data = await response.json();

alert(data.message);

if(response.ok){

window.location="login.html";

}

});

}

const loginForm = document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

const body={

email:document.getElementById("email").value,

password:document.getElementById("password").value

};

const response=await fetch(`${API_URL}/login`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(body)

});

const data=await response.json();

if(response.ok){

localStorage.setItem("token",data.token);

localStorage.setItem("user",JSON.stringify(data.user));

window.location="index.html";

}else{

alert(data.message);

}

});

}