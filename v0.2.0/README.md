Tienes razón. Hasta ahora \*\*no te había entregado el código completo de la versión 0.2.0\*\*. Vamos a hacerlo correctamente.



Esta versión introduce \*\*una nueva funcionalidad\*\*, por lo tanto es \*\*MINOR version → v0.2.0\*\*.



---



\# 📦 pii-detector



\## Version \*\*0.2.0\*\*



\### New Features



\* 📂 \*\*Selección de directorio completo\*\*

\* 🔁 \*\*Procesamiento recursivo de archivos\*\*

\* 🧾 Mostrar \*\*ruta relativa del archivo\*\*

\* 🧠 Mejor organización del código



\### Bug Fixes



\* manejo más seguro de archivos no soportados

\* protección cuando `.db` no contiene tablas



---



\# 📁 Estructura del proyecto



```

pii-detector/

│

├── index.html

├── VERSION

├── CHANGELOG.md

│

├── css/

│   └── style.css

│

└── js/

&nbsp;   ├── pii-patterns.js

&nbsp;   ├── file-readers.js

&nbsp;   ├── detector.js

&nbsp;   └── app.js

```



---



\# VERSION



```

0.2.0

```



---



\# CHANGELOG.md



```

\# pii-detector



\## v0.2.0

New features:

\- directory selection

\- recursive directory scanning

\- relative file path display



Bug fixes:

\- safer DB parsing

\- unsupported file protection



\## v0.1.0

Initial prototype

```



---



\# index.html



```html

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>PII Detector</title>



<link rel="stylesheet" href="css/style.css">



<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>

<script src="https://unpkg.com/mammoth/mammoth.browser.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"></script>



</head>



<body>



<h1>PII Detector</h1>



<div id="drop">

Drag \& Drop files here

</div>



<br>



<input type="file" id="fileInput" multiple>



<br><br>



<label>Select directory</label>

<input type="file" id="dirInput" webkitdirectory directory multiple>



<h2>Results</h2>



<table id="results">

<tr>

<th>File</th>

<th>Type</th>

<th>Match</th>

</tr>

</table>



<script src="js/pii-patterns.js"></script>

<script src="js/file-readers.js"></script>

<script src="js/detector.js"></script>

<script src="js/app.js"></script>



</body>

</html>

```



---



\# css/style.css



```css

body{

font-family:Arial;

margin:40px;

background:#f4f4f4;

}



\#drop{

border:3px dashed #888;

padding:40px;

text-align:center;

background:white;

}



table{

border-collapse:collapse;

width:100%;

margin-top:20px;

}



td,th{

border:1px solid #ccc;

padding:6px;

}

```



---



\# js/pii-patterns.js



```javascript

const PII\_PATTERNS = {



SSN:

/\\b(?!000|666|9\\d{2})\\d{3}\[- ]?(?!00)\\d{2}\[- ]?(?!0000)\\d{4}\\b/g,



EMAIL:

/\\b\[A-Za-z0-9.\_%+-]+@\[A-Za-z0-9.-]+\\.\[A-Za-z]{2,}\\b/g,



PHONE:

/\\b(?:\\+?1\[-.\\s]\*)?\\(?\[2-9]\\d{2}\\)?\[-.\\s]\*\\d{3}\[-.\\s]\*\\d{4}\\b/g,



CREDIT\_CARD:

/\\b(?:4\[0-9]{12}(?:\[0-9]{3})?|5\[1-5]\[0-9]{14}|3\[47]\[0-9]{13})\\b/g,



IPV4:

/\\b(?:(?:25\[0-5]|2\[0-4]\\d|1?\\d?\\d)\\.){3}(?:25\[0-5]|2\[0-4]\\d|1?\\d?\\d)\\b/g,



ZIP:

/\\b\\d{5}(?:-\\d{4})?\\b/g,



DOB:

/\\b(0?\[1-9]|1\[0-2])\[\\/\\-](0?\[1-9]|\[12]\\d|3\[01])\[\\/\\-](19|20)\\d{2}\\b/g



}

```



---



\# js/file-readers.js



```javascript

const allowed = \[

"txt","md","html","pdf","docx","xlsx","csv","tsv","db"

]



async function readText(file){

return await file.text()

}



async function readPDF(file){



const buf=await file.arrayBuffer()



const pdf=await pdfjsLib.getDocument({data:buf}).promise



let text=""



for(let i=1;i<=pdf.numPages;i++){



const page=await pdf.getPage(i)

const content=await page.getTextContent()



content.items.forEach(item=>{

text+=item.str+" "

})



}



return text

}



async function readDOCX(file){



const buf=await file.arrayBuffer()



const result=await mammoth.extractRawText({arrayBuffer:buf})



return result.value

}



async function readXLSX(file){



const buf=await file.arrayBuffer()



const wb=XLSX.read(buf)



let text=""



wb.SheetNames.forEach(name=>{

const sheet=XLSX.utils.sheet\_to\_csv(wb.Sheets\[name])

text+=sheet

})



return text

}



async function readDB(file){



const SQL=await initSqlJs({

locateFile:file=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/"+file

})



const buf=await file.arrayBuffer()



const db=new SQL.Database(new Uint8Array(buf))



let text=""



const tables=db.exec(

"SELECT name FROM sqlite\_master WHERE type='table'"

)



if(!tables.length) return ""



tables\[0].values.forEach(t=>{



const rows=db.exec(`SELECT \* FROM ${t\[0]}`)



if(rows.length){



rows\[0].values.forEach(r=>{

text+=r.join(" ")

})



}



})



return text

}

```



---



\# js/detector.js



```javascript

function detectPII(text,file){



for(const \[type,regex] of Object.entries(PII\_PATTERNS)){



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

```



---



\# js/app.js



```javascript

async function processFile(file){



const ext=file.name.split(".").pop().toLowerCase()



if(!allowed.includes(ext)){

console.warn("unsupported:",file.name)

return

}



let text=""



try{



if(\["txt","md","html","csv","tsv"].includes(ext))

text=await readText(file)



else if(ext==="pdf")

text=await readPDF(file)



else if(ext==="docx")

text=await readDOCX(file)



else if(ext==="xlsx")

text=await readXLSX(file)



else if(ext==="db")

text=await readDB(file)



}catch(err){



console.error("read error",file.name,err)

return



}



const path=file.webkitRelativePath || file.name



detectPII(text,path)



}



async function handleFiles(files){



for(const file of files){

await processFile(file)

}



}



/\* upload \*/



document

.getElementById("fileInput")

.addEventListener("change",e=>{

handleFiles(e.target.files)

})



/\* directory \*/



document

.getElementById("dirInput")

.addEventListener("change",e=>{

handleFiles(e.target.files)

})



/\* drag drop \*/



const drop=document.getElementById("drop")



drop.addEventListener("dragover",e=>{

e.preventDefault()

})



drop.addEventListener("drop",e=>{

e.preventDefault()

handleFiles(e.dataTransfer.files)

})

```



---



\# 🚀 Cómo probar v0.2.0



1️⃣ crear carpeta



```

pii-detector

```



2️⃣ copiar archivos según estructura



3️⃣ abrir



```

index.html

```



4️⃣ probar:



\* arrastrar archivos

\* seleccionar archivos

\* seleccionar \*\*directorio completo\*\*



---



Si quieres, el siguiente paso lógico es \*\*v0.3.0\*\*, donde podemos añadir cosas que vuelven el proyecto \*\*mucho más profesional\*\*:



\* ⚡ \*\*Web Workers (procesamiento paralelo)\*\*

\* 📊 \*\*barra de progreso\*\*

\* 🔎 \*\*20+ detectores PII\*\*

\* 📁 \*\*export JSON / CSV\*\*

\* 🧠 \*\*detección de API keys y secrets\*\*



y eso ya se acerca bastante a herramientas de \*\*data loss prevention\*\* reales.



