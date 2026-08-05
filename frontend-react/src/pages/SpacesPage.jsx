import { useState, useEffect, useRef } from "react";
import { getSpaces, createSpace, getSpace, deleteSpace } from '../api';
import Space from '../components/Space';
import SpaceDialog from "../components/SpaceDialog";
import Header from "../components/Header";

function SpacesPage() {
    // Estado de los spaces
    const [spaces, setSpaces] = useState([]);
    const [activeSpace, setActiveSpace] = useState(null);

    // Declaracion de los UseEffects
    useEffect(() => {
        // hacemos el fetch de cada space
        getSpaces()
        .then(spaces => setSpaces(spaces))
        .catch(err => console.error(err));
    }, []);

    // funcion para crear el space
    const handleCreateSpace = (type) => {
        createSpace({
            title: "",
            type,
            color: "#f1f1f1",
            marker: ""
        }).then((newSpace) => {
            setSpaces(spaces => [newSpace, ...spaces]);
            setActiveSpace(newSpace);
        });
    };
    
    // funcion para abrir el space
    const handleOpenSpace = (space) => {
        getSpace(space.id)
        .then(fullSpace => setActiveSpace(fullSpace))
    };
    
    // funcion para actualizar los spaces despues de editarlos
    const handleSpaceChange = (updatedSpace) => {
        setActiveSpace(updatedSpace);
        setSpaces(spaces => spaces.map(space => space.id === updatedSpace.id ? updatedSpace : space))
    };

    // funcion para borrar el space y la card
    const handleDeleteSpace = (id) => {
        deleteSpace(id)
        setSpaces(spaces.filter(space => space.id !== id))
    }
    return (
        <>
            <Header onCreateSpace={handleCreateSpace}/>
            <section className="workspace__section">
                <div id="workspace-grid" className="workspace__grid" role="list" aria-live="polite" aria-label="Spaces and Notes">
                    {spaces.map(space => <Space key={space.id} space={space} onOpen={handleOpenSpace} onDelete={handleDeleteSpace}/>)}
                </div>
            </section>
            <SpaceDialog space={activeSpace} onSpaceChange={handleSpaceChange} onClose={() => setActiveSpace(null)}/>
        </>
    )
}

export default SpacesPage;