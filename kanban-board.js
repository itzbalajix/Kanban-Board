let boards = [];
let activeBoardId = null;
let dragSrcId = null;
let openDropdown = null;
let colFromOpen = null;

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