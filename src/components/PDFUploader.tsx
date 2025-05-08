"use client";

import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import UploadIcon from "../icons/UploadIcon";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableDocumentItem } from "./SortableDocumentItem";
import { PDFDoc } from "../interfaces/PDFDoc";

// Set the workerSrc for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const PDFUploaderComponent = () => {
  const [documents, setDocuments] = useState<PDFDoc[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>(600);
  const [numPages, setNumPages] = useState<number>(0);
  const PAGE_WIDTH_OFFSET = 100;
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth - PAGE_WIDTH_OFFSET);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
      }));
      setDocuments((prev) => [...prev, ...newDocs]);
      setSelectedIdx(documents.length); // select the first of the new docs
      setError("");
      e.target.value = "";
    }
  };

  const handleSelectDoc = (idx: number) => {
    if (idx !== selectedIdx) {
      setSelectedIdx(idx);
      setNumPages(0);
    }
  };

  const handleRemoveDoc = (idx: number) => {
    setDocuments((prev) => {
      const newDocs = prev.filter((_, i) => i !== idx);
      // Adjust selectedIdx if needed
      if (newDocs.length === 0) {
        setSelectedIdx(0);
      } else if (idx === selectedIdx) {
        setSelectedIdx(0);
      } else if (idx < selectedIdx) {
        setSelectedIdx(selectedIdx - 1);
      }
      return newDocs;
    });
  };

  const selectedDoc = documents[selectedIdx] || null;

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newDocs = Array.from(e.dataTransfer.files)
        .filter((file) => file.type === "application/pdf")
        .map((file) => ({ file, name: file.name }));
      setDocuments((prev) => [...prev, ...newDocs]);
      setSelectedIdx(documents.length);
      setError("");
    }
  };

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // DnD handler
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = documents.findIndex(
        (doc, i) => i.toString() === active.id
      );
      const newIndex = documents.findIndex(
        (doc, i) => i.toString() === over.id
      );
      const newDocs = arrayMove(documents, oldIndex, newIndex);
      setDocuments(newDocs);
      // Update selectedIdx if needed
      if (selectedIdx === oldIndex) setSelectedIdx(newIndex);
      else if (selectedIdx === newIndex) setSelectedIdx(oldIndex);
    }
  }

  // Initial upload UI
  if (documents.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <label
          htmlFor="file-upload"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
            />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              PDF files only. You can select multiple files.
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
          />
        </label>
        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    );
  }

  // Main UI with side panel
  return (
    <div
      className={`max-w-5xl mx-auto flex gap-6 min-h-[80vh] ${
        isDragging ? "cursor-grabbing" : ""
      }`}
    >
      {/* Left Pane */}
      <div className="w-1/3 bg-gray-50 border rounded-lg p-4 mt-7 flex flex-col h-[80vh]">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Documents</h2>
        <ul className="flex-1 overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(event) => {
              setIsDragging(false);
              handleDragEnd(event);
            }}
            onDragCancel={() => setIsDragging(false)}
          >
            <SortableContext
              items={documents.map((_, i) => i.toString())}
              strategy={verticalListSortingStrategy}
            >
              {documents.map((doc, idx) => (
                <SortableDocumentItem
                  key={doc.name + idx}
                  id={idx.toString()}
                  idx={idx}
                  selectedIdx={selectedIdx}
                  handleSelectDoc={handleSelectDoc}
                  handleRemoveDoc={handleRemoveDoc}
                  doc={doc}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
        <label className="block w-full">
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <span className="w-full inline-block px-4 py-2 text-center bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors font-medium">
            + Add Document
          </span>
        </label>
      </div>

      {/* Right Pane */}
      <div className="flex-1" ref={containerRef}>
        {selectedDoc ? (
          <>
            <div className="mb-2 text-gray-600 text-sm">
              Viewing: <span className="font-semibold">{selectedDoc.name}</span>
            </div>
            {error && (
              <div className="text-red-500 text-center mb-2">{error}</div>
            )}
            <div className="mt-2 border rounded-lg p-4 bg-gray-50 flex justify-center">
              <Document
                file={selectedDoc.file}
                loading={<div className="text-center">Loading PDF...</div>}
                error={
                  <div className="text-red-500 text-center">
                    Failed to load PDF.
                  </div>
                }
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from({ length: numPages }, (_, idx) => (
                  <Page
                    key={idx + 1}
                    pageNumber={idx + 1}
                    width={pageWidth}
                    className="mb-4 shadow-md"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-2xl mb-2">No document selected</span>
            <span>Use the pane on the left to add and select a PDF.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploaderComponent;
