import { Trash2, X } from "lucide-react";


function DeleteModal({ show, onCancel, onConfirm }) {


    if (!show) return null;


    return (

        <div className="modal-overlay">


            <div className="delete-modal">


                <X
                    className="close-icon"
                    onClick={onCancel}
                />


                <Trash2 size={40} />


                <h2>
                    Delete User?
                </h2>


                <p>
                    Are you sure you want to delete this user?
                </p>


                <div className="modal-buttons">


                    <button
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>


                    <button
                        className="delete-btn"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>


                </div>


            </div>


        </div>

    );

}


export default DeleteModal;