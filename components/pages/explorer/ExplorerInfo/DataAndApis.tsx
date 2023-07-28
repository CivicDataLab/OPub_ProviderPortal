import React from 'react';
import ExplorerViz from '../ExplorerViz';

const DataAndApis: React.FC<{ data: any; other }> = ({ data, other }) => {
  return (
    <div>
      <ExplorerViz other={other} data={data} />
    </div>
  );
};

export default DataAndApis;
