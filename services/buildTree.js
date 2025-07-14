/**
 * Mengubah flat array dari peran menjadi struktur pohon (tree) bersarang.
 * @param {Array} list - Array of role objects with id, name, parent_id.
 * @returns {Array} - Array of root node objects with nested children.
 */
function buildTree(list) {
  const map = {};
  const roots = [];

  for (const item of list) {
    map[item.id] = { ...item, children: [] };
  }

  for (const item of list) {
    const node = map[item.id];
    if (item.parent && map[item.parent]) {
      map[item.parent].children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

module.exports = {
  buildTree,
};