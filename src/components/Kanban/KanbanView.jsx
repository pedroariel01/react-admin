import * as React from "react";
import Board from "react-trello";
// import data from "./data.json";
import CustomCard from "./CustomCard";

const KanbanView = props => {
  const { data, handleDragEnd } = props;

  return (
    <div>
      {data.constructor === Object && (
        <Board
          data={data}
          draggable
          handleDragEnd={handleDragEnd}
          components={{ Card: CustomCard }}
        />
      )}
    </div>
  );
};

export default KanbanView;
