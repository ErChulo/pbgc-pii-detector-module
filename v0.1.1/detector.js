function detectPII(text,file){

for(const [type,regex] of Object.entries(PII_PATTERNS)){

const matches=text.match(regex)

if(matches){

matches.forEach(m=>{
addResult(file,type,m)
})

}

}

}

function addResult(file,type,match){

const row=document.createElement("tr")

row.innerHTML=`
<td>${file}</td>
<td>${type}</td>
<td>${match}</td>
`

document.querySelector("#results").appendChild(row)

}