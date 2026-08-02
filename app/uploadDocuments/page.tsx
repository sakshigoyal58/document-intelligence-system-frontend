import { DocumentsTable } from "../components/uploadDocuments/documentsTable";
import UploadForm from "../components/uploadDocuments/upload";
import { getDocuments } from "../lib/api/getDocuments";


export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-8">
      <UploadForm />
      <DocumentsTable data={documents} />
    </div>
  );
}