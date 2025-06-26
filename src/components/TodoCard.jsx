import React, { useState } from 'react'
import { CiTrash, CiStop1, CiSquareCheck, CiEdit, CiCircleCheck } from "react-icons/ci";
import Loader from './Loader';

function TodoCard({title, handleDelete, id, handleComplete, completed, handleEdit, priority = "low", date}) {
    let [deleteStatus, setDeleteStatus] = useState(false);
    const [isEditing, setIsEditing] = useState(false);  
    const [editTitle, setEditTitle] = useState(title);
    const priorityMap = {
      high: { label: "H", color: "border border-red-600 text-red-600 bg-red-50"},
      medium: { label: "M", color: "border border-yellow-500 text-yellow-600 bg-yellow-50" },
      low: { label: "L", color: "border border-emerald-500 text-emerald-600 bg-emerald-50" },
    };
    const { label, color } = priorityMap[priority] || priorityMap.low;
  

    function handleDeleteClick(){
        setDeleteStatus(true);
        handleDelete(id)
    }

    function handleEditClick(){
      setIsEditing(true); 
    }

    function handleSaveEdit() {
      // if (editTitle !== title) {
          handleEdit(id, editTitle);  
      // }
      setIsEditing(false); 
  }


  function handleEditTitleChange(event) {
    setEditTitle(event.target.value);  
}
    

    function handleCompleteClick() {
      handleComplete(id);
    }

   return (
    <div className={`mt-3 p-4 rounded-2xl bg-white shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:bg-emerald-50`}>
     <div className='flex flex-col'>
      <div className="flex items-center gap-2">
      <div className={`px-2 py-1 rounded-full text-xs font-bold ${color}`}>
      {label}
      </div>
      {isEditing ? (
                <input
                    type="text"
                    value={editTitle}
                    onChange={handleEditTitleChange}  
                    className="text-lg font-semibold text-neutral-800 border border-neutral-300 rounded-lg p-2"
                />
            ) : (
                <h2 className={`text-lg font-semibold text-neutral-800 ${completed ? 'line-through text-neutral-500' : ''}`}>{title}</h2>
            )}
            </div>
            <div className="text-sm text-neutral-500 ml-9">{date}</div>

            </div>

      <div className="flex items-center gap-3">

        {!isEditing && <button
          onClick={handleCompleteClick}
          className={` text-2xl font-bold ${completed ? 'text-[#032d1f]' : 'text-neutral-500'} hover: text-green-700 transition-colorstransform hover:scale-110`}
        >
          {completed ? <CiSquareCheck /> : <CiStop1 />}
        </button>}
        

        {isEditing ? (
                    <button
                        onClick={handleSaveEdit}  // Save the updated title
                        className="text-neutral-500 hover:text-green-600 text-2xl transition-colors transform hover:scale-110"
                    >
                        <CiCircleCheck />
                    </button>
                ) : (
                    <button
                        onClick={handleEditClick}  // Switch to edit mode
                        className="text-2xl font-bold text-neutral-500 hover:scale-110"
                    >
                        <CiEdit />
                    </button>
                )}

        {!isEditing && <button
          onClick={handleDeleteClick}
          className="text-neutral-500 hover:text-red-600 text-2xl transition-colors transform hover:scale-110"
        >
          {deleteStatus ? <Loader /> : <CiTrash />}
        </button>}
      </div>
    </div>
  )
}

export default TodoCard