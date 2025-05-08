import { PDFDoc } from "./PDFDoc";

export interface SortableDocumentItemProps {
    id: string;
    idx: number;
    selectedIdx: number;
    handleSelectDoc: (idx: number) => void;
    handleRemoveDoc: (idx: number) => void;
    doc: PDFDoc;
}
