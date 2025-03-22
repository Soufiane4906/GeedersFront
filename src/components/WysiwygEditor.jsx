// WysiwygEditor.jsx - Create this as a new component
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBold, faItalic, faUnderline, faListUl,
    faListOl, faLink, faImage, faHeading,
    faAlignLeft, faAlignCenter, faAlignRight
} from "@fortawesome/free-solid-svg-icons";

const WysiwygEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [activeStyles, setActiveStyles] = useState([]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        updateActiveStyles();
        saveContent();
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
            onChange({ target: { name: 'content', value: editorRef.current.innerHTML } });
        }
    };

    const handleKeyUp = () => {
        updateActiveStyles();
        saveContent();
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const insertImage = () => {
        const url = prompt('Enter image URL:');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    const toggleHeading = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
            if (document.queryCommandState('formatBlock') && document.queryCommandValue('formatBlock') === 'h3') {
                execCommand('formatBlock', 'p');
            } else {
                execCommand('formatBlock', 'h3');
            }
        }
    };

    return (
        <div className="wysiwyg-editor">
            <div className="editor-toolbar">
                <button
                    type="button"
                    className={activeStyles.includes('bold') ? 'active' : ''}
                    onClick={() => execCommand('bold')}
                >
                    <FontAwesomeIcon icon={faBold} />
                </button>
                <button
                    type="button"
                    className={activeStyles.includes('italic') ? 'active' : ''}
                    onClick={() => execCommand('italic')}
                >
                    <FontAwesomeIcon icon={faItalic} />
                </button>
                <button
                    type="button"
                    className={activeStyles.includes('underline') ? 'active' : ''}
                    onClick={() => execCommand('underline')}
                >
                    <FontAwesomeIcon icon={faUnderline} />
                </button>
                <button
                    type="button"
                    onClick={toggleHeading}
                >
                    <FontAwesomeIcon icon={faHeading} />
                </button>
                <button
                    type="button"
                    className={activeStyles.includes('ul') ? 'active' : ''}
                    onClick={() => execCommand('insertUnorderedList')}
                >
                    <FontAwesomeIcon icon={faListUl} />
                </button>
                <button
                    type="button"
                    className={activeStyles.includes('ol') ? 'active' : ''}
                    onClick={() => execCommand('insertOrderedList')}
                >
                    <FontAwesomeIcon icon={faListOl} />
                </button>
                <button
                    type="button"
                    className={activeStyles.includes('left') ? 'active' : ''}
                    onClick={() => execCommand('justifyLeft')}
                >
                    <FontAwesomeIcon icon={faAlignLeft} />
                </button>
                <button
                    type="button"
                    className={activeStyles.includes('center') ? 'active' : ''}
                    onClick={() => execCommand('justifyCenter')}
                >
                    <FontAwesomeIcon icon={faAlignCenter} />
                </button>
                <button
                    type="button"
                    className={activeStyles.includes('right') ? 'active' : ''}
                    onClick={() => execCommand('justifyRight')}
                >
                    <FontAwesomeIcon icon={faAlignRight} />
                </button>
                <button type="button" onClick={insertLink}>
                    <FontAwesomeIcon icon={faLink} />
                </button>
                <button type="button" onClick={insertImage}>
                    <FontAwesomeIcon icon={faImage} />
                </button>
            </div>
            <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                dangerouslySetInnerHTML={{ __html: value }}
                onKeyUp={handleKeyUp}
                onBlur={saveContent}
                data-placeholder={placeholder}
            ></div>
        </div>
    );
};

export default WysiwygEditor;