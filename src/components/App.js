import React, { useState } from 'react'
import data from '../../results.json';
import '../app.scss';

const Result = ({ result, collapsed, toggleFileCollapsed, query }) => {
  return (
    <li>
      <div onClick={toggleFileCollapsed} className='hover'>{result.toFile}</div>
      {!collapsed && (
        <code>
            {
              result
                .lines
                .map(({ line, isMatch }, index) => (
                  <pre key={index} className={isMatch ? 'match' : ''}>
                    {line}
                  </pre>
                  )
                )
            }
        </code>
      )}
    </li>
  );
};

const App = () => {
  const { results, query } = data

  const resultsByHash = results.reduce((acc, curr) => {
    const { indexTo: hash } = curr;

    if (!acc[hash]) acc[hash] = [];

    acc[hash].push(curr);

    return acc;
  }, {});

  const files = Array.from(results.reduce((acc, curr) => acc.add(curr), new Set));

  const [collapsed, setCollapsed] = useState(Object.keys(results).map(() => true));

  const toggleCollapsed = index => {
    setCollapsed(collapsed.map((value, valueIndex) => {
      if (index === valueIndex) {
        return !value;
      } else {
        return value;
      }
    }))
  };

  const [collapsedFiles, setCollapsedFiles] = useState(
    Object.keys(resultsByHash).reduce((acc, hash) => {
      acc[hash] = resultsByHash[hash].map(() => true)

      return acc;
    }, {})
  )

  const toggleFileCollapsed = (toggleHash, toggleIndex) => {
    setCollapsedFiles({
      ...collapsedFiles,
      [toggleHash]: collapsedFiles[toggleHash].map((value, index) => {
        if (index === toggleIndex) {
          return !value;
        } else {
          return value;
        }
      }),
    });
  }

  return (
    <div>
      <h1>Showing results for {query}</h1>
      <h2>{results.length} results in {Object.keys(resultsByHash).length} commits</h2>

      {Object.keys(collapsedFiles).map((hash, index) => (
        <ul
          className={collapsed[index] ? 'collapsed' : 'expanded'}
          key={index}
        >
          <div
            className='hover'
            key={index}
            onClick={() => { toggleCollapsed(index) }}
          >
            {hash} -- {resultsByHash[hash].length} Results
          </div>
          <li>
            <ul>
              {collapsedFiles[hash].map((collapsed, resultIndex) => (
                <Result
                  key={resultIndex}
                  result={resultsByHash[hash][resultIndex]}
                  collapsed={collapsed}
                  toggleFileCollapsed={() => toggleFileCollapsed(hash, resultIndex)}
                />
              ))}
            </ul>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default App;