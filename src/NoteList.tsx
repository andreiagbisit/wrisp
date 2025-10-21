import { useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import type { Tag } from './App';
import styles from './NoteList.module.css';
import { HiOutlineDocumentAdd, HiOutlineTag, HiOutlineTrash } from 'react-icons/hi';
import { useEffect } from 'react';
import wrispAscii from './assets/wrisp_logo_ascii_2.png';
import notFound from './assets/not_found_ascii_2.png';
import tagAscii from './assets/tag_ascii_2.png';

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

export function NoteList({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState('')
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)

    useEffect(() => {
        document.title = `Notes | Wrisp`;
    }, [title]);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === '' || 
                    note.title.toLowerCase().includes(title.toLowerCase())) && 
                (selectedTags.length === 0  || 
                    selectedTags.every(tag =>
                        note.tags.some(noteTag => noteTag.id === tag.id)
                    )
                )
            )
        })

    }, [title, selectedTags, notes])

    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Notes</h1>
                </Col>

                <Col xs='auto'>
                    <Stack gap={2} direction='horizontal'>
                        <Link to='/new'>
                            <Button variant='outline-primary fs-4 pt-1 pb-2' 
                                    title='New Note'>
                                <HiOutlineDocumentAdd />
                            </Button>
                        </Link>

                        <Button onClick={() => 
                            setEditTagsModalIsOpen(true)}
                            variant='outline-primary fs-4 pt-1 pb-2' title='Manage Tags'>
                                <HiOutlineTag />
                        </Button>
                    </Stack>
                </Col>
            </Row>

            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type='text' value={title} 
                                onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect 
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })} isMulti 
                                
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(
                                        tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            {notes.length === 0 ? (
                <div className='text-center pt-5'>
                    <img src={wrispAscii} className='wrisp-ascii mb-5' />
                    
                    <p className='search-status-text'>
                        Looks like you haven't laid out what's in your head yet.
                    </p>
                </div>

            ) : filteredNotes.length === 0 ? (
                <div className='text-center pt-5'>
                    <img src={notFound} className='not-found-ascii mb-5' />
                    
                    <p className='search-status-text'>
                        Sorry, but the one you're looking for doesn't seem to exist.
                    </p>
                </div>
            ) : (

                <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
                    {filteredNotes.map(note => (
                        <Col key={note.id}>
                            <NoteCard id={note.id} title={note.title} tags={note.tags} />
                        </Col>
                    ))}
                </Row>
            )}


            <EditTagsModal 
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
                show={editTagsModalIsOpen} 
                handleClose={() => setEditTagsModalIsOpen(false)} 
                availableTags={availableTags} />
        </>
    )
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset
        text-decoration-none ${styles.card}`}>
            
            <Card.Body>
                <Stack 
                    gap={2} 
                    className='align-items-center
                    justify-content-center h-100'
                >
                    <span className='fs-5'>{title}</span>

                    {tags.length > 0 && (
                        <Stack gap={1} direction='horizontal'
                            className='justify-content-center flex-wrap'>
                            {tags.map(tag => (
                                <Badge className='text-truncate' key={tag.id}>
                                    {tag.label}
                                </Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}

function EditTagsModal(
    { availableTags, 
      handleClose, 
      show, 
      onDeleteTag, 
      onUpdateTag } : EditTagsModalProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Manage Tags
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                {availableTags.length === 0 ? (
                    <div className='text-center pt-4'>
                        <img
                            src={tagAscii}
                            className='tag-ascii mb-4'
                        />
                        
                        <p>
                            Tags will appear here if you created them.
                        </p>
                    </div>
                ) : (
                    <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                                <Form.Control
                                type='text'
                                value={tag.label}
                                onChange={e => onUpdateTag(tag.id, e.target.value)}
                                />
                            </Col>

                            <Col xs='auto'>
                                <Button
                                onClick={() => onDeleteTag(tag.id)}
                                variant='outline-primary pt-1 pb-2'
                                title='Delete'
                                >
                                <HiOutlineTrash />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    </Stack>
                )}
                </Form>

            </Modal.Body>
        </Modal>
    )
}