import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBold, faItalic, faUnderline, faListUl,
    faListOl, faLink, faImage, faHeading,
    faAlignLeft, faAlignCenter, faAlignRight
} from "@fortawesome/free-solid-svg-icons";

const WysiwygEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [activeStyles, setActiveStyles] = useState([]);
    const [editorContent, setEditorContent] = useState(value || '');

    // Initialiser le contenu de l'éditeur
    useEffect(() => {
        if (editorRef.current && value !== undefined) {
            editorRef.current.innerHTML = value;
        }
    }, []);

    const saveSelection = () => {
        let sel = window.getSelection();
        if (sel.rangeCount > 0) {
            return sel.getRangeAt(0);
        }
        return null;
    };

    const restoreSelection = (range) => {
        if (!range) return;
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };

    const execCommand = (command, value = null) => {
        const range = saveSelection(); // Sauvegarde la position du curseur
        editorRef.current.focus();
        document.execCommand(command, false, value);
        updateActiveStyles();
        saveContent();
        if (range) restoreSelection(range); // Restaure la position du curseur après l'édition
    };

    const updateActiveStyles = () => {
        const styles = [];
        if (document.queryCommandState('bold')) styles.push('bold');
        if (document.queryCommandState('italic')) styles.push('italic');
        if (document.queryCommandState('underline')) styles.push('underline');
        if (document.queryCommandState('insertUnorderedList')) styles.push('ul');
        if (document.queryCommandState('insertOrderedList')) styles.push('ol');
        if (document.queryCommandState('justifyLeft')) styles.push('left');
        if (document.queryCommandState('justifyCenter')) styles.push('center');
        if (document.queryCommandState('justifyRight')) styles.push('right');
        setActiveStyles(styles);
    };

    const saveContent = () => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            setEditorContent(newContent);
            onChange({ target: { name: 'desc', value: newContent } });
        }
    };

    const handleKeyUp = () => {
        updateActiveStyles();
        saveContent();
    };

    const handleInput = () => {
        saveContent();
    };

    return (
        <div className="wysiwyg-editor">
            <div className="editor-toolbar">
                <button type="button" className={activeStyles.includes('bold') ? 'active' : ''} onClick={() => execCommand('bold')}>
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button type="button" className={activeStyles.includes('italic') ? 'active' : ''} onClick={() => execCommand('italic')}>
                    <FontAwesomeIcon icon={faItalic} />
                </button>
                <button type="button" className={activeStyles.includes('underline') ? 'active' : ''} onClick={() => execCommand('underline')}>
                    <FontAwesomeIcon icon={faUnderline} />
                </button>
                <button type="button" className={activeStyles.includes('ul') ? 'active' : ''} onClick={() => execCommand('insertUnorderedList')}>
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button type="button" className={activeStyles.includes('ol') ? 'active' : ''} onClick={() => execCommand('insertOrderedList')}>
                    <FontAwesomeIcon icon={faListOl} />
                </button>
            </div>
            <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                suppressContentEditableWarning={true}
                onInput={handleInput}
                onKeyUp={handleKeyUp}
                data-placeholder={placeholder}
            ></div>
        </div>
    );
};

export default WysiwygEditor;
