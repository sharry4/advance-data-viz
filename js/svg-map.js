// svg-map.js

function addColor(n) {
  return n>6 ? "#580b00" :
         n>5 ? "#962515" :
         n>4 ? "#b54130" :
         n>3 ? "#c65a49" :
         n>2 ? "#e57a69" :
         n>1 ? "#ed9587" :
               "#ffbdb2"

}

var provinceCount = {};

for (i=0; i < chinaHeritage.length; i++) {
  var province = chinaHeritage[i]["abbr"];

  if(provinceCount[province]) {
    provinceCount[province] +=1;
  } else {
    provinceCount[province] =1;
  }
}

// console.log(provinceCount)

for (var province in provinceCount) {
  var provinceSvg = document.getElementById(province);
  provinceSvg.style.fill = addColor(provinceCount[province])
}
