import ChatLauncher from "../components/chatboxComponents/chatLauncher";
import ReviewDocumentsTable from "../components/reviewDocuments/reviewDocumentsTable";
import { getReviewerDocuments } from "@/app/lib/api/getReviewerDocuments";

export default async function Page() {
	const documents = await getReviewerDocuments();

	return (
		<div className="space-y-6 py-6 relative">
			<div>
				<h1 className="text-2xl font-semibold">Review Documents</h1>
				<p className="text-sm text-slate-600">Approve or reject uploaded documents.</p>
			</div>

			<ReviewDocumentsTable initialData={documents} />
			<ChatLauncher />
		</div>
	);
}