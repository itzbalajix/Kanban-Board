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