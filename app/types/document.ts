export type FileStatus = "VALIDATED" | "VALIDATION_FAILED" | "APPROVED" | "REJECTED";

export type Document = {
  DocumentId: string;
  FileName: string;
  FileStatus: FileStatus;
  CreatedAt: string;
  UpdatedAt: string;
};