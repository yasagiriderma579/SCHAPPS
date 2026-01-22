const KEY="jadwal_sekolah"
const HARI=["Senin","Selasa","Rabu","Kamis","Jumat"]
let jadwal={}
let currentHari=null

function initJadwal(){
    HARI.forEach(hari=>{
        if(!jadwal[hari]) jadwal[hari]=[]
    })
}

function save(){
    localStorage.setItem(KEY,JSON.stringify(jadwal))
}

function load(){
    const data=localStorage.getItem(KEY)
    jadwal=data?JSON.parse(data):{}
    initJadwal()
}

function render(){
    const container=document.getElementById('jadwalContainer')
    container.innerHTML=HARI.map(hari=>`
        <div class="hari-card">
            <div class="hari-header">
                <div class="hari-nama">${hari}</div>
                <button class="btn-add-jadwal" onclick="openModal('${hari}')">+</button>
            </div>
            
            <div class="jadwal-list" id="list-${hari}">
                ${jadwal[hari].length===0?'<div class="empty-state">Belum ada jadwal</div>':''}
                ${jadwal[hari].map((j,i)=>`
                    <div class="jadwal-row">
                        <div class="jadwal-mapel">${esc(j.mapel)}</div>
                        <div class="jadwal-waktu">${esc(j.waktu)}</div>
                        <button class="btn-delete-jadwal" onclick="deleteJadwal('${hari}',${i})">✕</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('')
}

function openModal(hari){
    currentHari=hari
    document.getElementById('modalTitle').textContent=`Tambah Jadwal ${hari}`
    document.getElementById('inputMapel').value=''
    document.getElementById('inputWaktu').value=''
    document.getElementById('modal').style.display='flex'
    document.getElementById('inputMapel').focus()
}

function closeModal(){
    document.getElementById('modal').style.display='none'
    currentHari=null
}

function submitJadwal(){
    const mapel=document.getElementById('inputMapel').value.trim()
    const waktu=document.getElementById('inputWaktu').value.trim()
    
    if(!mapel||!waktu){
        alert('⚠️ Lengkapi semua field!')
        return
    }
    
    jadwal[currentHari].push({
        mapel:mapel,
        waktu:waktu
    })
    
    save()
    render()
    closeModal()
    alert(`✅ Jadwal ${currentHari} berhasil ditambahkan!`)
}

function deleteJadwal(hari,index){
    if(confirm(`Hapus jadwal ini?`)){
        jadwal[hari].splice(index,1)
        save()
        render()
    }
}

function esc(t){
    const d=document.createElement('div')
    d.textContent=t
    return d.innerHTML
}

// Close modal saat klik di luar
document.getElementById('modal').addEventListener('click',(e)=>{
    if(e.target.id==='modal') closeModal()
})

// Enter key untuk submit
document.addEventListener('keypress',(e)=>{
    if(e.key==='Enter'&&document.getElementById('modal').style.display==='flex'){
        submitJadwal()
    }
})

load()
render()