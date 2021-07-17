import React, { useState } from 'react'
import SortableTree, { toggleExpandedForAll } from '@nosferatu500/react-sortable-tree';
import './App.css'
import FileExplorerTheme from '@nosferatu500/theme-file-explorer';

const App = () => {
  const [searchString, setSearchString] = useState('');
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(0);

  const treeDataDefs = [
    { title: '.gitignore' },
    { title: 'package.json' },
    {
      title: 'src',
      isDirectory: true,
      expanded: true,
      children: [
        { title: 'styles.css' },
        { title: 'index.js' },
        { title: 'reducers.js' },
        { title: 'actions.js' },
        { title: 'utils.js' },
      ],
    },
    {
      title: 'tmp',
      isDirectory: true,
      children: [
        { title: '12214124-log' },
        { title: 'drag-disabled-file', dragDisabled: true },
      ],
    },
    {
      title: 'build',
      isDirectory: true,
      children: [{ title: 'react-sortable-tree.js' }],
    },
    {
      title: 'public',
      isDirectory: true,
    },
    {
      title: 'node_modules',
      isDirectory: true,
    },
  ];

  const [treeData, setTreeData] = useState(treeDataDefs);

  const updateTreeData = (newTreeData: any[]) => {
    setTreeData(newTreeData);
  }

  const expand = (expanded: boolean) => {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded,
      })
    )
  }

  const expandAll = () => {
    expand(true);
  }

  const collapseAll = () => {
    expand(false);
  }

  const alertNodeInfo = ({ node, path, treeIndex }: any) => {
    const objectString = Object.keys(node)
      .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
      .join(',\n   ');

    alert(
      'Info passed to the icon and button generators:\n\n' +
      `node: {\n   ${objectString}\n},\n` +
      `path: [${path.join(', ')}],\n` +
      `treeIndex: ${treeIndex}`
    );
  };

  const selectPrevMatch = () =>
    setSearchFocusIndex(
      searchFocusIndex !== null
        ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1
    )

  const selectNextMatch = () =>
    setSearchFocusIndex(
      searchFocusIndex !== null
        ? (searchFocusIndex + 1) % searchFoundCount
        : 0
    )

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
    >
      <div style={{ flex: '0 0 auto', padding: '0 15px' }}>
        <h3>File Explorer Theme</h3>
        <button onClick={expandAll}>Expand All</button>
        <button onClick={collapseAll}>Collapse All</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <form
          style={{ display: 'inline-block' }}
          onSubmit={event => {
            event.preventDefault();
          }}
        >
          <label htmlFor="find-box">
            Search:&nbsp;
            <input
              id="find-box"
              type="text"
              value={searchString}
              onChange={event =>
                setSearchString(event.target.value)
              }
            />
          </label>

          <button
            type="button"
            disabled={!searchFoundCount}
            onClick={selectPrevMatch}
          >
            &lt;
          </button>

          <button
            type="submit"
            disabled={!searchFoundCount}
            onClick={selectNextMatch}
          >
            &gt;
          </button>

          <span>
            &nbsp;
            {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
            &nbsp;/&nbsp;
            {searchFoundCount || 0}
          </span>
        </form>
      </div>

      <div style={{ flex: '1 0 50%', padding: '0 0 0 15px' }}>
        <SortableTree
          theme={FileExplorerTheme}
          treeData={treeData}
          onChange={updateTreeData}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          searchFinishCallback={(matches: any) => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(
              matches.length > 0 ? searchFocusIndex % matches.length : 0
            )
          }}
          canDrag={({ node }: any) => !node.dragDisabled}
          canDrop={({ nextParent }: any) => !nextParent || nextParent.isDirectory}
          generateNodeProps={(rowInfo: any) => ({
            icons: rowInfo.node.isDirectory
              ? [
                <div
                  style={{
                    borderLeft: 'solid 8px gray',
                    borderBottom: 'solid 10px gray',
                    marginRight: 10,
                    boxSizing: 'border-box',
                    width: 16,
                    height: 12,
                    filter: rowInfo.node.expanded
                      ? 'drop-shadow(1px 0 0 gray) drop-shadow(0 1px 0 gray) drop-shadow(0 -1px 0 gray) drop-shadow(-1px 0 0 gray)'
                      : 'none',
                    borderColor: rowInfo.node.expanded ? 'white' : 'gray',
                  }}
                />,
              ]
              : [
                <div
                  style={{
                    border: 'solid 1px black',
                    fontSize: 8,
                    textAlign: 'center',
                    marginRight: 10,
                    width: 12,
                    height: 16,
                  }}
                >
                  F
                </div>,
              ],
            buttons: [
              <button
                style={{
                  padding: 0,
                  borderRadius: '100%',
                  backgroundColor: 'gray',
                  color: 'white',
                  width: 16,
                  height: 16,
                  border: 0,
                  fontWeight: 100,
                }}
                onClick={() => alertNodeInfo(rowInfo)}
              >
                i
              </button>,
            ],
          })}
        />
      </div>
    </div>
  );
}

export default App
