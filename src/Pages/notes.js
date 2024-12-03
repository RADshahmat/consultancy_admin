import React, { useState, useEffect } from "react";
import axiosInstance from "../Auth/AxiosInstance";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../Styles/notes.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [expandedNotes, setExpandedNotes] = useState({});
    const [notification, setNotification] = useState({ visible: false, x: 0, y: 0 });


    const fetchNotes = async (currentPage = 1) => {
        try {
            const response = await axiosInstance.get(`/notes?page=${currentPage}`);
            setNotes(response.data);
            setPageCount(10); // Assuming 10 total pages, adjust as needed
        } catch (err) {
            console.error(err);
        }
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        fetchNotes(selectedPage);
    };

    const openModal = (note = null) => {
        setCurrentNote(note);
        setFormData(note || { title: "", content: "" });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentNote(null);
        setFormData({ title: "", content: "" });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentNote) {
                await axiosInstance.put(`/notes/${currentNote.id}`, formData);
                closeModal();
                fetchNotes();
                toast.success('Updated Successfully');
            } else {
                await axiosInstance.post("/notes", formData);
                closeModal();
                fetchNotes();
                toast.success('Inserted Successfully');
            }
        } catch (err) {
            console.error(err);
            closeModal();
            toast.error('Error. Try again');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/notes/${id}`);
            toast.success('Deleted Successfully');
            fetchNotes();
        } catch (err) {
            console.error(err);
            toast.error('Error. Try again');
        }
    };

    const copyToClipboard = (text, event) => {
        event.stopPropagation(); 
        navigator.clipboard.writeText(text).then(() => {
            setNotification({ visible: true, x: event.clientX, y: event.clientY });
            setTimeout(() => setNotification({ visible: false, x: 0, y: 0 }), 1000);
        });
    };

    const toggleExpandNote = (noteId) => {
        setExpandedNotes(prev => ({
            ...prev,
            [noteId]: !prev[noteId],
        }));
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="app container py-4">
            <h1 className="text-center mb-4">Sticky Notes</h1>
            <button className="btn btn-primary mb-3" onClick={() => openModal()}>
                Add Note
            </button>
            <div className="notes-container row">
                {notes.map((note) => {
                    const isExpanded = expandedNotes[note.id];
                    const truncatedContent = note.content.length > 100 && !isExpanded
                        ? note.content.slice(0, 100) + "..."
                        : note.content;

                    return (
                        <div
                            key={note.id}
                            className="note col-lg-3 col-md-4 col-sm-6 mb-4"
                            onClick={(e) => copyToClipboard(note.content, e)}
                            style={{ boxShadow: 'none' }}
                        >
                            <div className="card p-3" style={{ boxShadow: 'none' }}>
                                <h5 className="card-title">{note.title}</h5>
                                <p className="card-text">
                                    {truncatedContent}
                                </p>
                                {note.content.length > 100 && !isExpanded && (
                                    <button
                                        className="btn btn-link p-0"
                                        
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            toggleExpandNote(note.id);
                                        }}
                                    >
                                        See More
                                    </button>
                                )}
                                {isExpanded && (
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpandNote(note.id);
                                        }}
                                    >
                                        See Less
                                    </button>
                                )}
                                <div className="note-actions mt-2 d-flex justify-content-end">
                                    <button
                                        className="btn btn-outline-secondary btn-sm me-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(note);
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(note.id);
                                        }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-item mx-2"} 
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"} 
                activeLinkClassName={"active-page-link"} 
            />

            {modalOpen && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentNote ? "Edit Note" : "Add Note"}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="">
                                        <label htmlFor="title" className="form-label">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            className="form-control"
                                            placeholder="Enter title"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">
                                            Content
                                        </label>
                                        <textarea
                                            id="content"
                                            className="form-control"
                                            placeholder="Enter content"
                                            value={formData.content}
                                            onChange={(e) =>
                                                setFormData({ ...formData, content: e.target.value })
                                            }
                                            required
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-success me-2">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {notification.visible && (
                <div
                    className="position-absolute bg-dark text-white p-2 rounded"
                    style={{
                        top: notification.y + 10,
                        left: notification.x + 10,
                        zIndex: 9999,
                    }}
                >
                    Copied!
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Notes;
