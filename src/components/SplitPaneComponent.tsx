import React from 'react';
import Split from 'react-split';

const SplitPaneComponent = () => {
  return (
    <Split
      sizes={[50, 50]} // Example: Adjust sizes as needed
      minSize={100}
      expandToMin={false}
      gutterSize={10}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="horizontal" // Use "vertical" for vertical split
      cursor="col-resize"
    >
      <div>Pane 1</div>
      <div>Pane 2</div>
    </Split>
  );
};

export default SplitPaneComponent;