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