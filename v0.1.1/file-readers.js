const allowed = [
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
const sheet=XLSX.utils.sheet_to_csv(wb.Sheets[name])
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

const tables=db.exec("SELECT name FROM sqlite_master WHERE type='table'")

tables[0].values.forEach(t=>{

const rows=db.exec(`SELECT * FROM ${t[0]}`)

if(rows[0]){
rows[0].values.forEach(r=>{
text+=r.join(" ")
})
}

})

return text
}