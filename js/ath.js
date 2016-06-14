var trl,tmr;
console.log("Aqui estou!!!");
if (!(localStorage.CFE)){
  if (!(sessionStorage.ath)){
    if (localStorage.TMR <= 0) {localStorage.removeItem("DBlogin");}
    if (!(localStorage.TRL)) {
      localStorage.TRL=5;
    } else {
      trl = localStorage.TRL;
      trl--;
      localStorage.TRL = trl;
      sessionStorage.ath=1;
    }
  }

}
else {
  if (!(sessionStorage.ath)){
    tmr = localStorage.TMR;
    tmr--;
    localStorage.TMR = tmr;
    sessionStorage.ath=1;
    if (tmr <= 0) {
      localStorage.removeItem("DBlogin");
      localStorage.removeItem("CFE");
      localStorage.TRL=0;
    }
  }
}
