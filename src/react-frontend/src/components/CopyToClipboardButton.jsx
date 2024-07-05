import React, {useState} from 'react';

const CopyToClipboardButton = ({text}) => {
    const [copySuccess, setCopySuccess] = useState('');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Copied!');
        }, (err) => {
            setCopySuccess('Failed to copy!');
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <>
            <button className={"btn p-0 bg-transparent border-0"}
                    onClick={copyToClipboard}>{text}</button>
        </>
    );
};

export default CopyToClipboardButton;
