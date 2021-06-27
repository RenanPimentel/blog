import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

interface Props {
  showEdit: boolean;
  showRemove: boolean;
  handleEditClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRemoveClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function BtnContainer({
  showEdit,
  showRemove,
  handleEditClick,
  handleRemoveClick,
}: Props) {
  if (!showEdit && !showRemove) return <></>;

  return (
    <div className="btn-container">
      {showEdit && (
        <button className="link" title="Edit" onClick={handleEditClick}>
          <FaRegEdit style={{ fill: "rgb(50, 200, 100)" }} />
        </button>
      )}
      {showRemove && (
        <button className="link" title="Remove" onClick={handleRemoveClick}>
          <FaRegTrashAlt style={{ fill: "rgb(200, 50, 50)" }} />
        </button>
      )}
    </div>
  );
}

export default BtnContainer;
