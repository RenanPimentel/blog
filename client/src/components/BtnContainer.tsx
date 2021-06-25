import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

interface Props {
  showEdit: boolean;
  showRemove: boolean;
  handleEditClick(e: React.MouseEvent<HTMLButtonElement>): void;
  handleRemoveClick(e: React.MouseEvent<HTMLButtonElement>): void;
}

function BtnContainer(props: Props) {
  if (!props.showEdit && !props.showRemove) {
    return <></>;
  }

  return (
    <div className="btn-container">
      {props.showEdit && (
        <button className="link" onClick={props.handleEditClick}>
          <FaRegEdit style={{ fill: "rgb(50, 200, 100)" }} />
        </button>
      )}
      {props.showRemove && (
        <button onClick={props.handleRemoveClick} className="link">
          <FaRegTrashAlt style={{ fill: "rgb(200, 50, 50)" }} />
        </button>
      )}
    </div>
  );
}

export default BtnContainer;
