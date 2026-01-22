const KEY="tugas_sekolah"
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

function addTugas(){
    const nama=document.getElementById('namaTugas').value.trim()
    const mapel=document.getElementById('mapel').value
    const deadline=document.getElementById('deadline').value

    if(!nama||!mapel||!deadline)
        return alert("Lengkapi semua field!")

    data.push({
        id:Date.now(),
        nama:nama,
        mapel:mapel,
        deadline:deadline
    })
    save()
    renderTugas()
    updateFilterOptions()
    clearForm()
    alert("✅ Tugas berhasil ditambahkan!")
}

function clearForm(){
    document.getElementById('namaTugas').value=""
    document.getElementById('mapel').value=""
    document.getElementById('deadline').value=""
}

function sortByDeadline(tasks){
    return tasks.sort((a,b)=>{
        return new Date(a.deadline)-new Date(b.deadline)
    })
}

function isUrgent(deadline){
    const today=new Date()
    today.setHours(0,0,0,0)
    const deadlineDate=new Date(deadline)
    deadlineDate.setHours(0,0,0,0)
    const daysLeft=Math.ceil((deadlineDate-today)/(1000*60*60*24))
    return daysLeft<=1
}

function getDaysLeft(deadline){
    const today=new Date()
    today.setHours(0,0,0,0)
    const deadlineDate=new Date(deadline)
    deadlineDate.setHours(0,0,0,0)
    return Math.ceil((deadlineDate-today)/(1000*60*60*24))
}

function renderTugas(){
    const filterValue=document.getElementById('filterMapel').value
    let filtered=filterValue?data.filter(t=>t.mapel===filterValue):data
    filtered=sortByDeadline(filtered)
    
    const output=document.getElementById('output')

    if(filtered.length===0){
        output.innerHTML='<div class="empty-state">Belum ada tugas. Buat tugas baru untuk memulai!</div>'
        return
    }

    output.innerHTML=filtered.map(t=>{
        const daysLeft=getDaysLeft(t.deadline)
        let urgencyClass=''
        const deadlineText=daysLeft===0?"Hari ini":daysLeft===1?"Besok":daysLeft>0?daysLeft+" hari lagi":"Lewat"
        
        if(daysLeft<=1) urgencyClass='urgent'
        else if(daysLeft<=3) urgencyClass='warning'
        
        return `
        <div class="card thumb" onclick="openDetail(${t.id})">
            <button class="btn-delete-task" onclick="event.stopPropagation();hapusTugasQuick(${t.id})">Hapus</button>
            <h3>${esc(t.nama)}</h3>
            <div class="task-meta">
                <span class="task-mapel">${esc(t.mapel)}</span>
                <span class="task-deadline ${urgencyClass}">📅 ${new Date(t.deadline).toLocaleDateString("id-ID")} (${deadlineText})</span>
            </div>
        </div>
        `
    }).join("")
}

function updateFilterOptions(){
    const mapels=[...new Set(data.map(t=>t.mapel))].sort()
    const filterSelect=document.getElementById('filterMapel')
    const currentValue=filterSelect.value
    
    const options='<option value="">-- Semua Mapel --</option>'+
        mapels.map(m=>`<option value="${m}">${m}</option>`).join("")
    
    filterSelect.innerHTML=options
    filterSelect.value=currentValue
}

function openDetail(id){
    const t=data.find(x=>x.id===id)
    activeId=id
    const daysLeft=getDaysLeft(t.deadline)
    const deadlineText=daysLeft===0?"Hari ini":daysLeft===1?"Besok":daysLeft>0?daysLeft+" hari lagi":"Lewat"
    
    document.getElementById('mNamaTugas').textContent=t.nama
    document.getElementById('mMapel').textContent=t.mapel
    document.getElementById('mDeadline').textContent="📅 "+new Date(t.deadline).toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric"})+" ("+deadlineText+")"
    document.getElementById('mInfo').textContent=`Deadline: ${deadlineText}`
    document.getElementById('modal').style.display="flex"
}

function closeModal(){
    document.getElementById('modal').style.display="none"
}

function hapusTugas(){
    if(confirm("Yakin ingin menghapus tugas ini?")){
        data=data.filter(d=>d.id!==activeId)
        save()
        closeModal()
        renderTugas()
        updateFilterOptions()
        alert("✅ Tugas berhasil dihapus!")
    }
}

function hapusTugasQuick(id){
    if(confirm("Yakin ingin menghapus tugas ini?")){
        data=data.filter(d=>d.id!==id)
        save()
        renderTugas()
        updateFilterOptions()
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
renderTugas()
updateFilterOptions()