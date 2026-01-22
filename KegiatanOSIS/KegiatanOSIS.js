const KEY="osis_kegiatan"
let data=[]
let activeId=null

function esc(t){
    const d=document.createElement("div")
    d.textContent=t
    return d.innerHTML
}

function save(){
    localStorage.setItem(KEY,JSON.stringify(data))
}
function load(){
    data=JSON.parse(localStorage.getItem(KEY))||[]
}

prog.oninput=()=>progVal.textContent=prog.value

function add(){
    if(!nama.value||!desk.value||!tgl.value)
        return alert("Lengkapi semua field!")

    data.push({
        id:Date.now(),
        nama:nama.value,
        desk:desk.value,
        tgl:tgl.value,
        prog:prog.value
    })
    save()
    render()
    clearForm()
}

function clearForm(){
    nama.value=""
    desk.value=""
    tgl.value=""
    prog.value=0
    progVal.textContent=0
}

function render(){
    output.innerHTML=data.length?data.map(d=>`
    <div class="card thumb" onclick="openDetail(${d.id})">
        <h3>${esc(d.nama)}</h3>
        <div class="date">${new Date(d.tgl).toLocaleDateString("id-ID")}</div>
        <div class="desc">${esc(d.desk.slice(0,70))}...</div>
        <div class="bar">
            <div class="fill" style="width:${d.prog}%"></div>
        </div>
    </div>
    `).join(""):`<div class="card">Belum ada kegiatan</div>`
}

function openDetail(id){
    const d=data.find(x=>x.id===id)
    activeId=id
    mNama.textContent=d.nama
    mTgl.textContent=new Date(d.tgl).toLocaleDateString(
        "id-ID",
        {weekday:"long",year:"numeric",month:"long",day:"numeric"}
    )
    mDesk.textContent=d.desk
    mProg.style.width=d.prog+"%"
    modal.style.display="flex"
}

function closeModal(){
    modal.style.display="none"
}

function hapus(){
    if(confirm("Hapus kegiatan ini?")){
        data=data.filter(d=>d.id!==activeId)
        save()
        closeModal()
        render()
    }
}

function toggleInputCard(){
    const inputCard = document.getElementById('inputCard');
    const floatingBtn = document.getElementById('floatingBtn');

    inputCard.classList.toggle('show');

    if(inputCard.classList.contains('show')){
        floatingBtn.classList.add('hidden');
        const firstInput = inputCard.querySelector('input');
        if(firstInput) firstInput.focus();
    }else{
        floatingBtn.classList.remove('hidden');
    }
}

load()
render()