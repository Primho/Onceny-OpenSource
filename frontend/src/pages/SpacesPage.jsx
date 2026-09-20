import { useState, useEffect } from "react";
import { getSpaces, createSpace, getSpace, deleteSpace } from '../api';
import Space from '../components/Space';
import SpaceDialog from "../components/SpaceDialog";
import Header from "../components/Header";

const TEMPORAL_TTL_MS = 120_000;

function SpacesPage() {
    // Estado de los spaces
    const [spaces, setSpaces] = useState([]);
    const [activeSpace, setActiveSpace] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Declaracion de los UseEffects
    useEffect(() => {
        // hacemos el fetch de cada space
        getSpaces()
        .then(spaces => setSpaces(spaces))
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const timers = spaces
            .filter(space => space.type === "temporal" && space.createdAt)
            .map(space => {
                const expiresAt = Number(space.createdAt) + TEMPORAL_TTL_MS;
                const remaining = expiresAt - Date.now();

                const removeExpiredSpace = async () => {
                    setSpaces(currentSpaces => currentSpaces.filter(item => item.id !== space.id));
                    setActiveSpace(currentActive =>
                        currentActive?.id === space.id ? null : currentActive
                    );
                    try {
                        await deleteSpace(space.id);
                    } catch (err) {
                        console.error("Error eliminando el espacio temporal:", err);
                    }
                };

                if (remaining <= 0) {
                    removeExpiredSpace();
                    return null;
                }

                return window.setTimeout(removeExpiredSpace, remaining);
            })
            .filter(Boolean);

        return () => timers.forEach(window.clearTimeout);
    }, [spaces]);

    // funcion para crear el space
    const handleCreateSpace = async (type) => {
        setIsCreating(true);
        try {
            const newSpace = await createSpace({
                title: "",
                type,
                color: "#f1f1f1",
                marker: ""
            });
            setSpaces(spaces => [newSpace, ...spaces]);
            setActiveSpace(newSpace);
        } catch (err) {
            console.error("Error creando el espacio:", err);
        } finally {
            setIsCreating(false);
        }
    };
    
    // funcion para abrir el space
    const handleOpenSpace = (space) => {
        getSpace(space.id)
        .then(fullSpace => setActiveSpace(fullSpace))
    };
    
    // funcion para actualizar los spaces despues de editarlos
    const handleSpaceChange = (updatedSpace) => {
        setActiveSpace(updatedSpace);
    };

    const handleSpaceSave = (savedSpace) => {
        setSpaces(currentSpaces => currentSpaces.map(space =>
            space.id === savedSpace.id ? savedSpace : space
        ));
        setActiveSpace(null);
    };

    // funcion para borrar el space y la card
    const handleDeleteSpace = (id) => {
        deleteSpace(id)
        setSpaces(spaces.filter(space => space.id !== id))
    }
    return (
        <>
            <Header onCreateSpace={handleCreateSpace} isCreating={isCreating}/>
            <section className="workspace__section">
                <div id="workspace-grid" className="workspace__grid" role="list" aria-live="polite" aria-label="Spaces and Notes">
                    {spaces.map(space => <Space key={space.id} space={space} onOpen={handleOpenSpace} onDelete={handleDeleteSpace}/>)}
                </div>
            </section>
            <SpaceDialog space={activeSpace} onSpaceChange={handleSpaceChange} onSaveSpace={handleSpaceSave} onClose={() => setActiveSpace(null)}/>
        </>
    )
}

export default SpacesPage;