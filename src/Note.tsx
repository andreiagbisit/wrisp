import { Badge, Button, Col, Row, Stack } from 'react-bootstrap';
import { useNote } from './NoteLayout';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { HiChevronLeft, HiOutlineTrash, HiOutlinePencilAlt } from "react-icons/hi";
import { useEffect } from 'react';

type NoteProps = {
    onDelete: (id: string) => void
}

export function Note({ onDelete }: NoteProps) {
    const note = useNote()
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${note.title} | Wrisp`;
    }, [note.title]);

    return (
        <>
            <Row className='align-itms-center mb-4'>
                <Col>
                    <h1>{note.title}</h1>

                    {note.tags.length > 0 && (
                        <Stack gap={1} direction='horizontal'
                            className='flex-wrap'>
                            {note.tags.map(tag => (
                                <Badge className='text-truncate mb-3' key={tag.id}>
                                    {tag.label}
                                </Badge>
                            ))}
                        </Stack>
                    )}
                </Col>

                <Col xs='auto'>
                    <Stack gap={2} direction='horizontal'>
                        <Link to={`/${note.id}/edit`}>
                            <Button variant='outline-primary fs-4 pt-1 pb-2' title='Edit'>
                                <HiOutlinePencilAlt />
                            </Button>
                        </Link>

                        <Button onClick={() => {
                            onDelete(note.id)
                            navigate('/')
                        }}

                        variant='outline-primary fs-4 pt-1 pb-2' title='Delete'>
                            <HiOutlineTrash />
                        </Button>
                        
                        <Link to='/'>
                            <Button variant='outline-primary fs-4 pt-1 pb-2' title='Back'>
                                <HiChevronLeft />
                            </Button>
                        </Link>
                    </Stack>
                </Col>
            </Row>

            <ReactMarkdown>
                {note.markdown}
            </ReactMarkdown>
        </>
    )
}