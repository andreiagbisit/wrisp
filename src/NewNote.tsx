import type { NoteData, Tag } from './App';
import { NoteForm } from './NoteForm';
import { useEffect } from 'react';

type NewNoteProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export function NewNote({ onSubmit, onAddTag, availableTags }: NewNoteProps) {
    useEffect(() => {
        document.title = `New Note | Wrisp`;
    });

    return (
        <>
            <h1 className="mb-4">New Note</h1>
            <NoteForm 
                onSubmit={onSubmit}
                onAddTag={onAddTag} 
                availableTags={availableTags} 
            />
        </>
    )
}