async function processFile(file){

const ext=file.name.split(".").pop().toLowerCase()

if(!allowed.includes(ext))
return

let text=""

if(["txt","md","html","csv","tsv"].includes(ext))
text=await readText(file)

else if(ext==="pdf")
text=await readPDF(file)

else if(ext==="docx")
text=await readDOCX(file)

else if(ext==="xlsx")
text=await readXLSX(file)

else if(ext==="db")
text=await readDB(file)

const path=file.webkitRelativePath || file.name

detectPII(text,path)

}

async function handleFiles(files){

for(const file of files){
await processFile(file)
}

}

/* file input */

document
.getElementById("fileInput")
.addEventListener("change",e=>{
handleFiles(e.target.files)
})

/* directory input */

document
.getElementById("dirInput")
.addEventListener("change",e=>{
handleFiles(e.target.files)
})

/* drag drop */

const drop=document.getElementById("drop")

drop.addEventListener("dragover",e=>{
e.preventDefault()
})

drop.addEventListener("drop",e=>{
e.preventDefault()
handleFiles(e.dataTransfer.files)
})