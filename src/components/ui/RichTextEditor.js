"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function RichTextEditor({ value, onChange, placeholder }) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="bg-white rounded-lg border border-stone-200 overflow-hidden personality-bio">
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Escribe aquí..."}
        className="min-h-[200px]"
      />
      <style jsx global>{`
        .ql-container {
          font-family: inherit;
          font-size: 1rem;
          min-h: 200px;
        }
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        .ql-container.ql-snow {
          border: none;
        }
        .ql-editor {
          min-height: 200px;
        }
      `}</style>
    </div>
  );
}
