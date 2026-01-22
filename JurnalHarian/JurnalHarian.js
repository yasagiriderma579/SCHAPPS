const KEY="jurnal_harian"
let jurnal=[]
let activeId=null

function esc(t){
    const d=document.createElement("div")
    d.textContent=t
    return d.innerHTML
}

function save(){
    localStorage.setItem(KEY,JSON.stringify(jurnal))
}

function load(){
    const data=localStorage.getItem(KEY)
    jurnal=data?JSON.parse(data):[]
}

function tuliJurnal(){
    const text=document.getElementById('jurnalText').value.trim()
    const date=document.getElementById('jurnalDate').value
    
    if(!text||!date){
        alert('⚠️ Lengkapi deskripsi dan tanggal!')
        return
    }
    
    jurnal.push({
        id:Date.now(),
        text:text,
        date:date,
        createdAt:new Date().toLocaleString('id-ID')
    })
    
    save()
    render()
    clearForm()
    alert('✅ Jurnal berhasil disimpan!')
}

function clearForm(){
    document.getElementById('jurnalText').value=''
    document.getElementById('jurnalDate').value=''
}

function sortJurnalByDate(data){
    return data.sort((a,b)=>{
        return new Date(b.date)-new Date(a.date)
    })
}

function formatDate(dateStr){
    const date=new Date(dateStr+'T00:00:00')
    return date.toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
}

function render(){
    const output=document.getElementById('output')
    const sorted=sortJurnalByDate([...jurnal])
    
    if(sorted.length===0){
        output.innerHTML=`
            <div class="empty-state">
                <div class="empty-state-icon">📓</div>
                <p>Belum ada jurnal. Mulai tuliskan jurnal harian Anda sekarang! ✨</p>
            </div>
        `
        return
    }
    
    output.innerHTML=sorted.map(j=>`
        <div class="jurnal-card" onclick="bukaBaca(${j.id})">
            <div class="jurnal-header">
                <span class="jurnal-tanggal">${formatDate(j.date)}</span>
                <button class="btn-delete-jurnal" onclick="event.stopPropagation();hapusJurnalCepat(${j.id})">Hapus</button>
            </div>
            <div class="jurnal-preview">${esc(j.text)}</div>
            <div class="jurnal-read-more">Baca selengkapnya →</div>
        </div>
    `).join('')
}

function bukaBaca(id){
    const j=jurnal.find(x=>x.id===id)
    if(!j) return
    
    activeId=id
    document.getElementById('modalTitle').textContent='Jurnal Hari Ini'
    document.getElementById('modalDate').textContent=formatDate(j.date)
    document.getElementById('modalBody').textContent=j.text
    document.getElementById('modal').style.display='flex'
}

function tutupModal(){
    document.getElementById('modal').style.display='none'
    activeId=null
}

function hapusJurnal(){
    if(confirm('Yakin ingin menghapus jurnal ini?')){
        jurnal=jurnal.filter(j=>j.id!==activeId)
        save()
        tutupModal()
        render()
    }
}

function hapusJurnalCepat(id){
    if(confirm('Yakin ingin menghapus jurnal ini?')){
        jurnal=jurnal.filter(j=>j.id!==id)
        save()
        render()
    }
}

// Set tanggal hari ini sebagai default
document.getElementById('jurnalDate').valueAsDate=new Date()

// Close modal saat klik di luar
document.getElementById('modal').addEventListener('click',(e)=>{
    if(e.target.id==='modal') tutupModal()
})

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
document.getElementById('jurnalText').focus()