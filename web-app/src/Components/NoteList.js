import {Link} from 'react-router-dom';

function NoteList({notes, searchQuery, currentID, highlightSearchTerms, pinNote, isDarkMode, checkNote, currentNotes, tags}){
    return(
        <ol className='Note-list'>
            {notes
                .filter(note => !note.inTrash)
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
                                    {note.tags && note.tags.map((tagID) => (
                                        <span
                                            key={tagID}
                                            className='Etiquette'
                                            style={{backgroundColor: tags.find(tag => tag.id === tagID).color}}
                                        >
                                            {tags.find(tag => tag.id === tagID).name}
                                        </span>
                                    ))}
                                </div>
                                <div className='Note-link-content'>{highlightSearchTerms(note.content.substring(0,20), searchQuery)}{note.content.length>=20 ? "..." : null}</div>
                            </div>
                            <div className='Note-Buttons-Container'>
                                <button className='Note-Button' onClick={() => {pinNote(note.id)}}>
                                    <img 
                                        src={isDarkMode ? "/images/pinned_white.png" : "/images/pinned.png"}
                                        alt="Pinned"
                                    />
                                </button>
                                <button className='Note-Button' onClick={() => {checkNote(note.id)}}>
                                    <img 
                                        src={isDarkMode ? note.checked ? "/images/checked_white.png" : "/images/check_white.png" : note.checked ? "/images/checked.png" : "/images/check.png"}
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
                .filter(note => !note.inTrash)
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
                                    {note.tags && note.tags.map((tagID) => (
                                        <span
                                            key={tagID}
                                            className='Etiquette'
                                            style={{backgroundColor: tags.find(tag => tag.id === tagID).color}}
                                        >
                                            {tags.find(tag => tag.id === tagID).name}
                                        </span>
                                    ))}
                                </div>
                                <div className='Note-link-content'>{highlightSearchTerms(note.content.substring(0,20), searchQuery)}{note.content.length>=20 ? "..." : null}</div>
                            </div>
                            <div className='Note-Buttons-Container'>
                                <button className='Note-Button' onClick={() => {pinNote(note.id)}}>
                                    <img 
                                        src={isDarkMode ? "/images/pin_white.png" : "/images/pin.png"}
                                        alt={note.pinned ? "Pinned" : "Not pinned"}
                                    />
                                </button>
                                <button className='Note-Button' onClick={() => {checkNote(note.id)}}>
                                    <img 
                                        src={isDarkMode ? note.checked ? "/images/checked_white.png" : "/images/check_white.png" : note.checked ? "/images/checked.png" : "/images/check.png"}
                                        alt={note.checked ? "Checked" : "Not checked"}
                                    />
                                </button>
                            </div>
                        </Link>
                    </li>
                ))
            }
        </ol>
    );
}

export default NoteList;