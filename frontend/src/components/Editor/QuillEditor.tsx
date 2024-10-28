import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header', 'font', 'list', 'bullet',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'align', 'link', 'image',
];

export const QuillEditor = forwardRef<ReactQuill, QuillEditorProps>(
  ({ value, onChange, className = '' }, ref) => {
    return (
      <ReactQuill
        ref={ref}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className={`${className} quill-editor`}
        theme="snow"
      />
    );
  }
);

QuillEditor.displayName = 'QuillEditor';