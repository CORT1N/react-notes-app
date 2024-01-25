import {Link} from 'react-router-dom';

function TrashList({notes, searchQuery, currentID, highlightSearchTerms, pinNote, isDarkMode, checkNote, currentNotes}){
    return(
        <ol className='Note-list'>
            {currentNotes
                .filter(note => note.inTrash)
                .filter(note => {
                    if(searchQuery === ""){
                        return note;
                    }else if(note.title.toLowerCase().includes(searchQuery.toLowerCase())){
                        return note;
                    }else if(note.content.toLowerCase().includes(searchQuery.toLowerCase())){
                        return note;
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
                                <button className='Note-Button'>
                                    <img 
                                        src={note.pinned ? isDarkMode ? "/images/pinned_white.png" : "/images/pinned.png" : isDarkMode ? "/images/pin_white.png" : "/images/pin.png"}
                                        alt={note.pinned ? "Pinned" : "Not pinned"}
                                    />
                                </button>
                                <button className='Note-Button'>
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

export default TrashList;