import { useState } from 'react';
import Loader from '../Components/Loader';
import { Link, useNavigate, useLocation} from 'react-router-dom';


function Aside({ notes, fetchNotes, apiErrorToast, currentUser }){
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const currentID = location.pathname.split("/").pop();
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 4; // Nombre de notes par page
    var totalPages=null;
    {notes !== null ? totalPages = Math.ceil(notes.length / notesPerPage) : totalPages = 0}
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    var currentNotes=null;
    {notes !== null ? currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote) : currentNotes = 0};
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode', !isDarkMode);
    };

    const renderPaginationButtons = () => {
        const pageButtons = [];
        if(totalPages !== null){
            for (let i = 1; i <= totalPages; i++) {
                pageButtons.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </button>
                );
            }
        }
        return pageButtons;
    };

    function resetSearchInput(){
        setSearchQuery("");
    }

    async function appendNewNote(){
        try{
            const currentTime = new Date().toISOString();
            const response = await fetch("/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Nouvelle note",
                    content: "",
                    date: currentTime,
                    pinned: false,
                })
            });
            const newNote = await response.json();
            navigate("/notes/"+newNote.id);
            fetchNotes();
        }
        catch(e){
            console.error("Erreur à l'ajout d'une note - "+e);
            apiErrorToast();
        }
    }

    function highlightSearchTerms(text, searchQuery) {
        if (searchQuery==="") return text;
      
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        return text.split(regex).map((part, index) => 
            regex.test(part) ? <mark key={index}>{part}</mark> : part
        );
    }

    async function pinNote(id){
        const note = notes.find(note => note.id === id);
        try{
            {note.pinned ? note.pinned = false : note.pinned = true}
            const response = await fetch('/notes/'+id, {
                method: "PUT",
                body: JSON.stringify(note),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }
        catch(e){
            console.error("Erreur à la modification du statut 'épinglé' de la note - "+e);
            apiErrorToast();
        }
    }

    async function checkNote(id){
        const note = notes.find(note => note.id === id);
        try{
            {note.checked ? note.checked = false : note.checked = true}
            const response = await fetch('/notes/'+id, {
                method: "PUT",
                body: JSON.stringify(note),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }
        catch(e){
            console.error("Erreur à la modification du statut 'faite' de la note - "+e);
            apiErrorToast();
        }
    }

    return(
        <aside className='Side'>
            {notes !== null ? (
                <>
                    <div className='Status'>
                        {currentUser && <span>Connecté en tant que {currentUser.name}</span>}
                    </div>
                    <div className='Header'>
                        <button onClick={appendNewNote} className='Button Button-create-note'>+</button>
                        <div className='SearchBar'>
                            <input placeholder='Rechercher' value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className='Search SearchInput'/>
                            <button className='Search SearchResetButton' onClick={resetSearchInput}>X</button>
                        </div>
                    </div>
                    <ol className='Note-list'>
                        {notes
                            .filter(note => note.pinned)
                            .filter(note => {
                                if(searchQuery === ""){
                                    return note;
                                }else if(note.title.toLowerCase().includes(searchQuery.toLowerCase())){
                                    return note;
                                }else if(note.content.toLowerCase().includes(searchQuery.toLowerCase())){
                                    return note;
                                }
                            })
                            .sort((a, b) => {
                                if (a.pinned && !b.pinned) {
                                    return -1;
                                } else if (!a.pinned && b.pinned) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            })
                            .map((note) => (
                                <li key={note.id}>
                                    <Link to={"/notes/"+note.id} className={note.id === parseInt(currentID) ? 'Note-link active' : 'Note-link'}>
                                        <div className='Note-link-container'>
                                            <div>
                                                {highlightSearchTerms(note.title.substring(0,30), searchQuery)}{note.title.length>=30 ? '...' : null}
                                                {note.etiquettes && note.etiquettes.map((etiquette, index) => (
                                                    <span
                                                        key={index}
                                                        className='Etiquette'
                                                        style={{ backgroundColor: etiquette.color }}
                                                    >
                                                        {etiquette.name}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className='Note-link-content'>{highlightSearchTerms(note.content.substring(0,20), searchQuery)}{note.content.length>=20 ? "..." : null}</div>
                                        </div>
                                        <div className='Note-Buttons-Container'>
                                            <button className='Note-Button' onClick={() => {pinNote(note.id)}}>
                                                <img 
                                                    src={note.pinned ? "/images/pinned_white.png" : "/images/pin_white.png"}
                                                    alt={note.pinned ? "Pinned" : "Not pinned"}
                                                />
                                            </button>
                                            <button className='Note-Button' onClick={() => {checkNote(note.id)}}>
                                                <img 
                                                    src={note.checked ? "/images/checked.png" : "/images/check.png"}
                                                    alt={note.checked ? "Checked" : "Not checked"}
                                                />
                                            </button>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        }
                        <hr className='Side-separator'></hr>
                        {currentNotes
                            .filter(note => !note.pinned)
                            .filter(note => {
                                if(searchQuery === ""){
                                    return note;
                                }else if(note.title.toLowerCase().includes(searchQuery.toLowerCase())){
                                    return note;
                                }else if(note.content.toLowerCase().includes(searchQuery.toLowerCase())){
                                    return note;
                                }
                            })
                            .sort((a, b) => {
                                if (a.pinned && !b.pinned) {
                                    return -1; // Note a épinglée, b non épinglée (a vient avant b)
                                } else if (!a.pinned && b.pinned) {
                                    return 1; // Note b épinglée, a non épinglée (b vient avant a)
                                } else {
                                    // Notes épinglées et non épinglées restent dans l'ordre actuel
                                    return 0;
                                }
                            })
                            .map((note) => (
                                <li key={note.id}>
                                    <Link to={"/notes/"+note.id} className={note.id === parseInt(currentID) ? 'Note-link active' : 'Note-link'}>
                                        <div className='Note-link-container'>
                                            <div>
                                                {highlightSearchTerms(note.title.substring(0,30), searchQuery)}{note.title.length>=30 ? '...' : null}
                                                {note.etiquettes && note.etiquettes.map((etiquette, index) => (
                                                    <span
                                                        key={index}
                                                        className='Etiquette'
                                                        style={{ backgroundColor: etiquette.color }}
                                                    >
                                                        {etiquette.name}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className='Note-link-content'>{highlightSearchTerms(note.content.substring(0,20), searchQuery)}{note.content.length>=20 ? "..." : null}</div>
                                        </div>
                                        <div className='Note-Buttons-Container'>
                                            <button className='Note-Button' onClick={() => {pinNote(note.id)}}>
                                                <img 
                                                    src={note.pinned ? "/images/pinned_white.png" : "/images/pin_white.png"}
                                                    alt={note.pinned ? "Pinned" : "Not pinned"}
                                                />
                                            </button>
                                            <button className='Note-Button' onClick={() => {checkNote(note.id)}}>
                                                <img 
                                                    src={note.checked ? "/images/checked.png" : "/images/check.png"}
                                                    alt={note.checked ? "Checked" : "Not checked"}
                                                />
                                            </button>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        }
                    </ol>
                    <div className='Pagination'>
                        {renderPaginationButtons()}
                    </div>
                    <button onClick={toggleDarkMode} className='ToggleThemeButton'>
                        {isDarkMode ? 'Mode Jour' : 'Mode Nuit'}
                    </button>
                </>
            ) : <Loader />}
        </aside>
    );
}

export default Aside;