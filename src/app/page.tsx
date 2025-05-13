import PDFUploader from "@/components/PDFUploader";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl text-gray-900 font-bold text-center">
          PDF Reader
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Upload a PDF to extract text
        </p>
        <PDFUploader />
      </div>
    </main>
  );
}
