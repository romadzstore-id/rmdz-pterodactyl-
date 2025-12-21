let order = {};

function nextStep(step) {
  if(step === 1){
    const ram = document.querySelector('input[name="ram"]:checked');
    if(!ram) return alert("Pilih paket terlebih dahulu");
    order.ram = ram.value;
  }

  if(step === 2){
    const username = document.getElementById('username').value;
    if(!/^[a-zA-Z0-9]+$/.test(username)) return alert("Username tidak valid");
    order.username = username;
    order.password = document.getElementById('password').value || "AUTO-GENERATED";
    document.getElementById("checkoutSummary").innerHTML =
      `Paket: ${order.ram}GB<br>Username: ${order.username}`;
  }

  document.querySelectorAll('.step-content').forEach(s=>s.classList.remove('active'));
  document.getElementById(`step${step+1}`).classList.add('active');

  document.querySelectorAll('.step').forEach((s,i)=>{
    s.classList.toggle('active', i <= step);
  });
}

function payNow(){
  fetch('/create-invoice',{method:'POST'})
  nextStep(3);
  setTimeout(checkPayment,2000);
}

function checkPayment(){
  fetch('/check-payment')
  .then(r=>r.json())
  .then(res=>{
    if(res.status === "SUCCESS"){
      nextStep(4);
      document.getElementById("panelResult").innerHTML = `
        URL: ${res.data.url}<br>
        Username: ${order.username}<br>
        Password: ${res.data.password}
      `;
      document.getElementById("loginBtn").href = res.data.url;
    } else {
      setTimeout(checkPayment,2000);
    }
  });
}

function copyData(){
  navigator.clipboard.writeText(document.getElementById("panelResult").innerText);
  alert("Data disalin");
}