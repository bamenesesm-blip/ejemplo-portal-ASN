// Estado global de la aplicación
let asns = [
    { id: 'ASN-1001', proveedor: 'Logística Central S.A.', placa: 'AB-123-CD', chofer: 'Carlos Pérez', fecha: '2026-10-07', hora: '08:00', bultos: 24, anden: 'Andén 1', estado: 'En Andén' },
    { id: 'ASN-1002', proveedor: 'Distribuidora del Norte', placa: 'EF-456-GH', chofer: 'María Rodríguez', fecha: '2026-10-07', hora: '09:30', bultos: 12, anden: 'Andén 2', estado: 'En Garita' },
    { id: 'ASN-1003', proveedor: 'Alimentos y Más', placa: 'IJ-789-KL', chofer: 'Jorge Gómez', fecha: '2026-10-07', hora: '11:00', bultos: 40, anden: 'Andén 3', estado: 'Programado' },
    { id: 'ASN-1004', proveedor: 'Embalajes Globales', placa: 'MN-012-OP', chofer: 'Ana Martinez', fecha: '2026-10-07', hora: '13:00', bultos: 18, anden: 'Andén 4', estado: 'En Patio' }
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initCharts();
    renderASNTable();
    renderDockMatrix();
    renderYMS();

    document.getElementById('form-asn').addEventListener('submit', handleNewASN);
});

// Navegación por pestañas
function switchTab(tabId) {
    document.querySelectorAll('.view-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-indigo-600', 'text-white');
        btn.classList.add('text-slate-400');
    });

    document.getElementById(`view-${tabId}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`tab-${tabId}`);
    activeBtn.classList.add('active', 'bg-indigo-600', 'text-white');
    activeBtn.classList.remove('text-slate-400');
}

// Modales
function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    document.getElementById(id).classList.add('flex');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
    document.getElementById(id).classList.remove('flex');
}

// Renderizado de la tabla ASN
function renderASNTable() {
    const tbody = document.getElementById('asn-table-body');
    tbody.innerHTML = asns.map(asn => `
        <tr class="hover:bg-slate-700/30 transition">
            <td class="p-4 font-mono text-indigo-400 font-medium">${asn.id}</td>
            <td class="p-4">${asn.proveedor}</td>
            <td class="p-4">
                <div class="font-semibold">${asn.placa}</div>
                <div class="text-xs text-slate-400">${asn.chofer}</div>
            </td>
            <td class="p-4">${asn.fecha} ${asn.hora}</td>
            <td class="p-4">${asn.bultos} pallets</td>
            <td class="p-4">${getBadge(asn.estado)}</td>
            <td class="p-4 text-right">
                <button onclick="updateStatus('${asn.id}')" class="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-md transition">
                    Avanzar Estado
                </button>
            </td>
        </tr>
    `).join('');
}

function getBadge(estado) {
    const colors = {
        'Programado': 'bg-slate-700 text-slate-300',
        'En Garita': 'bg-blue-900/60 text-blue-300 border-blue-700',
        'En Patio': 'bg-amber-900/60 text-amber-300 border-amber-700',
        'En Andén': 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
        'Completado': 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
    };
    return `<span class="border text-xs px-2.5 py-1 rounded-full font-medium ${colors[estado] || 'bg-slate-700'}">${estado}</span>`;
}

// Crear ASN
function handleNewASN(e) {
    e.preventDefault();
    const newASN = {
        id: `ASN-${1000 + asns.length + 1}`,
        proveedor: document.getElementById('asn-proveedor').value,
        placa: document.getElementById('asn-placa').value,
        chofer: document.getElementById('asn-chofer').value,
        fecha: document.getElementById('asn-fecha').value,
        hora: document.getElementById('asn-hora').value,
        bultos: document.getElementById('asn-bultos').value,
        anden: document.getElementById('asn-anden').value,
        estado: 'Programado'
    };

    asns.unshift(newASN);
    renderASNTable();
    renderDockMatrix();
    renderYMS();
    closeModal('modal-asn');
    document.getElementById('form-asn').reset();
}

// Matriz de Andenes
function renderDockMatrix() {
    const container = document.getElementById('dock-matrix');
    const andenes = ['Andén 1', 'Andén 2', 'Andén 3', 'Andén 4', 'Andén 5', 'Andén 6'];
    
    let html = `<div class="grid grid-cols-7 gap-2 text-xs font-semibold border-b border-slate-700 pb-2 mb-2 text-slate-400">
        <div>Andén</div>
        <div>08:00</div><div>10:00</div><div>12:00</div><div>14:00</div><div>16:00</div><div>18:00</div>
    </div>`;

    andenes.forEach(a => {
        html += `<div class="grid grid-cols-7 gap-2 items-center py-2 border-b border-slate-700/40 text-xs">
            <div class="font-bold text-slate-300">${a}</div>`;
        
        const matchedASN = asns.find(item => item.anden === a);
        
        for (let i = 0; i < 6; i++) {
            if (matchedASN && i === 0) {
                html += `<div class="col-span-2 bg-indigo-900/40 border border-indigo-500/50 p-2 rounded-lg text-indigo-200">
                    <div class="font-bold">${matchedASN.id}</div>
                    <div class="text-[10px] text-slate-400">${matchedASN.proveedor}</div>
                </div>`;
                i++;
            } else {
                html += `<div class="bg-slate-900/40 border border-slate-800 p-2 rounded text-slate-600 text-center">Disponible</div>`;
            }
        }
        html += `</div>`;
    });

    container.innerHTML = html;
}

// Kanban YMS
function renderYMS() {
    const cols = {
        'col-garita': asns.filter(a => a.estado === 'En Garita'),
        'col-patio': asns.filter(a => a.estado === 'En Patio'),
        'col-anden': asns.filter(a => a.estado === 'En Andén'),
        'col-salida': asns.filter(a => a.estado === 'Completado')
    };

    Object.keys(cols).forEach(colId => {
        const container = document.getElementById(colId);
        container.innerHTML = cols[colId].map(item => `
            <div class="bg-slate-900 border border-slate-700 p-3 rounded-lg space-y-2 shadow-sm">
                <div class="flex justify-between items-start">
                    <span class="font-mono text-indigo-400 text-xs font-bold">${item.id}</span>
                    <span class="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-400">${item.anden}</span>
                </div>
                <div class="text-sm font-semibold text-slate-200">${item.placa}</div>
                <div class="text-xs text-slate-400">${item.proveedor}</div>
            </div>
        `).join('');
    });

    document.getElementById('count-garita').innerText = cols['col-garita'].length;
    document.getElementById('count-patio').innerText = cols['col-patio'].length;
    document.getElementById('count-anden').innerText = cols['col-anden'].length;
    document.getElementById('count-salida').innerText = cols['col-salida'].length;
}

// Cambiar estado secuencialmente
function updateStatus(id) {
    const flujo = ['Programado', 'En Garita', 'En Patio', 'En Andén', 'Completado'];
    const asn = asns.find(a => a.id === id);
    if (asn) {
        const idx = flujo.indexOf(asn.estado);
        if (idx < flujo.length - 1) {
            asn.estado = flujo[idx + 1];
            renderASNTable();
            renderDockMatrix();
            renderYMS();
        }
    }
}

// Gráficos Chart.js
function initCharts() {
    const ctxFlujo = document.getElementById('chartFlujo').getContext('2d');
    new Chart(ctxFlujo, {
        type: 'line',
        data: {
            labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
            datasets: [{
                label: 'Camiones Programados vs Reales',
                data: [2, 5, 8, 6, 9, 4, 2],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } },
            scales: {
                x: { ticks: { color: '#64748b' }, grid: { color: '#334155' } },
                y: { ticks: { color: '#64748b' }, grid: { color: '#334155' } }
            }
        }
    });

    const ctxEstados = document.getElementById('chartEstados').getContext('2d');
    new Chart(ctxEstados, {
        type: 'doughnut',
        data: {
            labels: ['En Patio', 'En Andén', 'Completado', 'Pendiente'],
            datasets: [{
                data: [4, 2, 8, 3],
                backgroundColor: ['#f59e0b', '#6366f1', '#10b981', '#475569']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
    });
}