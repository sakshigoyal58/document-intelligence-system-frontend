import { DocumentsTable } from "../components/documents/documentsTable";
import UploadForm from "../components/upload";
import { getDocuments } from "../lib/api/document";


export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-8">
      <UploadForm />
      <DocumentsTable data={documents} />
    </div>
  );
}