let boards = [];
let activeBoardId = null;
let dragSrcId = null;
let openDropdown = null;
let colFormOpen = null;

const COLS = [
  {id: 'todo', label: 'Todo', dot: 'bg-[#6c7ef8]'},
  {id: 'doing', label: 'Doing', dot: 'bg-[#f6a94a]'},
  {id: 'done', label: 'Done', dot: 'bg-[#4ade80]'},
]

function load() {
  const saved = localStorage.getItem('kb_tw_v1');
  if (saved) {
    boards = JSON.parse(saved);
  } else {
    boards = [{
      id: 'board1',
      name: 'My Workspace',
      tasks: [
        {id: 't1', title: 'Research competitors', status: 'todo', priority: 'high', due: ''},
        {id: 't2', title: 'Design wireframes', status: 'todo', priority: 'medium', due: ''},
        {id: 't3', title: 'Set up project repo', status: 'doing', priority: 'high', due: ''},
        {id: 't4', title: 'Write API spec', status: 'doing', priority: 'medium', due: ''},
        {id: 't5', title: 'Deploy staging env', status: 'done', priority: 'low', due: ''},
      ],
    }];
  }
  activeBoardId = boards[0]?.id || null;
  save();
}

function save () {
  localStorage.setItem('kb_tw_v1', JSON.stringify(boards));
}

function activeBoard() {
  return boards.find(b => b.id === activeBoardId);
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function uid() {
  return 't' + dayjs().valueOf() + Math.random().toString(36).slice(2, 5);
}

const PRIORITY_CLASSES = {
  low: 'bg-green-400/10 text-green-400 border border-green-400/20',
  medium: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  high: 'bg-red-400/10 text-red-400 border border-red-400/20',
}

function dueBadgeHtml (due) {
  if (!due) return "";
  const dueDay = dayjs(due);
  const today = dayjs().startOf('day');
  const diff = dueDay.diff(today, 'day');

  let cls = 'text-base-400', label = '';
  if (diff < 0) {
    cls = 'text-red-400';
    label = `${Math.abs(diff)}d overdue`;
  } else if (diff === 0) {
    cls = 'text-amber-400';
    label = 'Today';
  } else if (diff === 1) {
    label = 'Tomorrow';
  } else {
    label = dueDay.format('MMM D');
  }

  return `<span class="flex items-center gap-0.5 font-mono text-[11px] ${cls}"><i class="ti ti-calendar text-[12px]" aria-hidden="true"></i>${label}</span>`;
}

function renderTabs() {
  const el = document.getElementById('board-tabs');
  el.innerHTML = boards.map(b => `
   <button onclick="switchBoard('${b.id}')"
      class="px-3.5 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap border transition-colors
             ${b.id === activeBoardId
               ? 'bg-base-700 border-base-600 text-base-100'
               : 'border-transparent text-base-300 hover:bg-base-800 hover:text-base-100'}">
      ${esc(b.name)}
    </button>`).join('') +
  `<button onclick="openNewBoardModal()" title="New board"
     class="px-2.5 py-1.5 rounded-md text-[13px] border border-dashed border-base-500 text-base-400
            hover:border-accent hover:text-accent transition-colors shrink-0">
     <i class="ti ti-plus" aria-hidden="true"></i>
   </button> `;
}

function renderStats() {
  const b = activeBoard();
  if (!b) {
    return;
  }
  const t = b.tasks;
  const total = t.length;
  const todo = t.filter(x => x.status === 'todo').length;
  const doing = t.filter(x => x.status === 'doing').length;
  const done = t.filter(x => x.status === 'done').length;
  const high = t.filter(x => x.status === 'high').length;

  const stat = (dot, count, label) => `
  <div class="flex items-center gap-2">
       <div class="w-2 h-2 rounded-full ${dot}"></div>
       <strong class="text-base-100 font-semibold font-mono text-sm">${count}</strong>
       <span>${label}</span>
     </div>`;

     document.getElementById('stats-bar').innerHTML =
     stat('bg-base-400', total, 'total') +
     stat('bg-[#6c7ef8]', todo, 'todo') +
     stat('bg-[#f6a94a]', doing, 'in progress') +
     stat('bg-[#4ade80]', done, 'done') +
     `<div class="flex items-center gap-2 ml-auto">
       <div class="w-2 h-2 rounded-full bg-red-400"></div>
       <strong class="text-base-100 font-semibold font-mono text-sm">${high}</strong>
       <span>high priority</span>
     </div>`;
}

function cardHtml(t) {
  const priCls = PRIORITY_CLASSES[t.priority] || PRIORITY_CLASSES.medium;
  const moveItems = COLS
  .filter(c => c.id !== t.status)
  .map (c => `<button onclick="moveCard('${t.id}','${c.id}')"
        class="drop-item flex items-center gap-2 w-full text-left px-3 py-2 text-[13px] text-base-300
               hover:bg-base-700 hover:text-base-100 transition-colors">
        <i class="ti ti-arrow-right text-[15px]" aria-hidden="true"></i> Move to ${c.label}
      </button>`).join('');

      return `<div class="card bg-base-800 border border-base-600 rounded-lg p-3 cursor-grab
              hover:border-base-500 hover:bg-base-700 transition-colors animate-slideIn"
       id="card-${t.id}"
       draggable="true"
       ondragstart="onDragStart(event,'${t.id}')"
       ondragend="onDragEnd()">
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="text-[14px] font-medium leading-snug text-base-100 flex-1 break-words"
           id="title-${t.id}">${esc(t.title)}</div>
      <div class="relative shrink-0">
        <button onclick="toggleDropdown(event,'${t.id}')"
          aria-label="Card options"
          class="w-6 h-6 flex items-center justify-center rounded text-base-400
                 hover:bg-base-900 hover:text-base-300 transition-colors">
          <i class="ti ti-dots-vertical text-base" aria-hidden="true"></i>
        </button>
        <div id="dd-${t.id}" style="display:none"
          class="absolute right-0 top-7 z-30 bg-base-800 border border-base-500 rounded-lg
                 min-w-[150px] overflow-hidden animate-popIn">
          <button onclick="editCard('${t.id}')"
            class="drop-item flex items-center gap-2 w-full text-left px-3 py-2 text-[13px] text-base-300
                   hover:bg-base-700 hover:text-base-100 transition-colors">
            <i class="ti ti-pencil text-[15px]" aria-hidden="true"></i> Edit
          </button>
          ${moveItems}
          <button onclick="deleteCard('${t.id}')"
            class="drop-item flex items-center gap-2 w-full text-left px-3 py-2 text-[13px] text-base-300
                   hover:bg-red-400/10 hover:text-red-400 transition-colors">
            <i class="ti ti-trash text-[15px]" aria-hidden="true"></i> Delete
          </button>
        </div>
      </div>
    </div>
    <div class="flex items-center flex-wrap gap-1.5 mt-1.5">
      <span class="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full ${priCls}">
        ${t.priority}
      </span>
      ${dueBadgeHtml(t.due)}
    </div>
  </div>`;
}

function renderBoard() {
  const b = activeBoard();
  const board = document.getElementById('board');
  if (!b) {
    board.innerHTML = '';
    return;
  }
  const totalDone = b.tasks.filter(t => t.status === 'done').length;
  const total = b.tasks.length;

  board.innerHTML = COLS.map(col => {
    const tasks = b.tasks.filter(t => t.status === col.id);
    const pct = col.id === 'done' && total > 0
    ? Math.round(totalDone / total * 100) : 0;

    return `  <div class="column w-[300px] shrink-0 bg-base-900 border border-base-600 rounded-xl overflow-hidden transition-all"
         id="col-${col.id}"
         ondragover="onDragOver(event,'${col.id}')"
         ondragleave="onDragLeave(event,'${col.id}')"
         ondrop="onDrop(event,'${col.id}')">
 
      <div class="flex items-center justify-between px-4 pt-3.5 pb-3">
        <div class="flex items-center gap-2 font-semibold text-sm">
          <div class="w-2.5 h-2.5 rounded-full ${col.dot} shrink-0"></div>
          ${col.label}
          <span class="bg-base-700 border border-base-600 text-base-300 font-mono text-[11px] px-2 py-0.5 rounded-full">
            ${tasks.length}
          </span>
        </div>
        <button onclick="openColAddForm('${col.id}')" title="Add task"
          class="w-7 h-7 flex items-center justify-center rounded-md text-base-400
                 hover:bg-base-700 hover:text-base-300 transition-colors">
          <i class="ti ti-plus text-base" aria-hidden="true"></i>
        </button>
      </div>
 
      ${col.id === 'done' ? `
        <div class="h-0.5 bg-base-700 mx-4 mb-2.5 rounded-full">
          <div class="h-full bg-[#4ade80] rounded-full transition-all duration-500"
               style="width:${pct}%"></div>
        </div>` : ''}

      <div class="px-3 pb-1 min-h-[80px] flex flex-col gap-2" id="list-${col.id}">
        ${tasks.length === 0
          ? `<div class="flex flex-col items-center justify-center py-7 gap-2 text-base-400 text-[13px]">
               <i class="ti ti-inbox text-3xl opacity-40" aria-hidden="true"></i>
               No tasks yet
             </div>`
          : tasks.map(t => cardHtml(t)).join('')}
      </div>
 
      <div class="px-3 pb-3 pt-1" id="add-area-${col.id}">
        <button onclick="openColAddForm('${col.id}')"
          class="w-full py-2 flex items-center justify-center gap-1.5 text-[13px] text-base-400
                 border border-dashed border-base-600 rounded-lg
                 hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors">
          <i class="ti ti-plus" aria-hidden="true"></i> Add task
        </button>
      </div>
    </div>`;
  }).join('');
}

function switchBoard(id) {
  activeBoardId = id;
  document.getElementById('board-name-display').textContent = activeBoard()?.name || '';
  renderTabs();
  renderBoard();
  renderStats();
}

function toggleDropdown(e, id) {
  e.stopPropagation();
  const dd = document.getElementById('dd-' + id);
  if (openDropdown && openDropdown !== dd) {
    openDropdown.style.display = 'none';
  }
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  openDropdown = dd.style.display === 'block' ? dd : null;
}

document.addEventListener('click', () => {
  if (openDropdown) {
    openDropdown.style.display = 'none';
    openDropdown = null;
  }
});

function deleteCard(id) {
  const b = activeBoard();
  b.tasks = b.tasks.filter(t => t.id !== id);
  save();
  renderBoard();
  renderStats();
}

function moveCard(id, status) {
  const t = activeBoard().tasks.find(t => t.id === id);
  if (t) {
    t.status = status;
  }
  save();
  renderBoard();
  renderStats();
}

function editCard(id) {
  if (openDropdown) {
    openDropdown.style.display = 'none';
    openDropdown = null;
  }
  const task = activeBoard().tasks.find(t => t.id === id);
  if (!task){return;}
  const titleEl = document.getElementById('title-' +id);
  const oldText = task.title;
  titleEl.innerHTML = `<textarea class="card-title-input" id="edit-input-${id}">${esc(oldText)}</textarea>`;
  const inp = document.getElementById('edit-input-' + id);
  inp.focus();
  inp.select();
  inp.addEventListener('blur', () => commitEdit(id));
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inp.blur();
    }
    if (e.key === 'Escape') {
      task.title = oldText;
      save();
      renderBoard();
      renderStats();
    }
  });
}

function commitEdit(id) {
  const inp = document.getElementById('edit-input-' + id);
  if (!inp) {return;}
  const val = inp.value.trim();
  const task = activeBoard().tasks.find(t => t.id === id);
  if (task && val) {
    task.title = val;
  }
  save();
  renderBoard();
  renderStats();
}

function openColAddForm(colId) {
  if (colFormOpen === colId) {
    closeColFrom(colId);
    return;
  }
  if (colFromOpen) {
    closeColFrom(colFromOpen);
  }
  colFormOpen = colId;

  document.getElementById('add-area-' + colId).innerHTML =`
  <div class="bg-base-950 border border-base-500 rounded-lg p-3 animate-slideIn">
      <textarea id="col-form-title-${colId}" rows="2" placeholder="Task title…"
        class="w-full bg-transparent border-none text-[14px] text-base-100 placeholder-base-400
               outline-none resize-none min-h-[52px] leading-relaxed"></textarea>
      <div class="flex items-center gap-1.5 flex-wrap mt-2.5">
        <select id="col-form-pri-${colId}"
          class="bg-base-800 border border-base-600 rounded-md text-base-300 text-xs font-sans px-2 py-1 outline-none cursor-pointer">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" id="col-form-due-${colId}"
          class="bg-base-800 border border-base-600 rounded-md text-base-300 text-xs px-2 py-1 outline-none cursor-pointer" />
        <div class="flex gap-1.5 ml-auto">
          <button onclick="closeColForm('${colId}')"
            class="px-2.5 py-1 text-[13px] text-base-400 border border-base-600 rounded-md hover:text-base-300 transition-colors">
            Cancel
          </button>
          <button onclick="submitColForm('${colId}')"
            class="px-3.5 py-1 text-[13px] font-medium bg-accent hover:bg-accent-hover text-white rounded-md transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>`;

    const ta = document.getElementById('col-form-title-' + colId);
    ta.focus();
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitColForm(colId);
      }
    });
}

function closeColForm(colId) {
  colFormOpen = null;
  const area = document.getElementById('add-area-' + colId);
  if (area) {
    area.innerHTML = `
    <button onclick="openColAddForm('${colId}')"
      class="w-full py-2 flex items-center justify-center gap-1.5 text-[13px] text-base-400
             border border-dashed border-base-600 rounded-lg
             hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors">
      <i class="ti ti-plus" aria-hidden="true"></i> Add task
    </button>`;
  }
}

function submitColForm(colId) {
  const title = document.getElementById('col-form-title-' + colId)?.value.trim();
  const pri = document.getElementById('col-form-pri-' + colId)?.value || 'medium';
  const due = document.getElementById('col-form-due-' + colId)?.value || '';
  if (!title) {return;}
  activeBoard().tasks.push({id: uid(), title, status: colId, priority: pri, due});
  save();
  renderBoard();
  renderStats();
  colFormOpen = null;
}