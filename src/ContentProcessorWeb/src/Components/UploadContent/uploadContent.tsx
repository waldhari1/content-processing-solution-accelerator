// import * as React from "react";
// import { Button } from "@fluentui/react-components";
// import { Dialog, DialogSurface, DialogBody, DialogTitle, DialogActions, DialogTrigger } from "@fluentui/react-components";
// import { Table, TableBody, TableCell, TableHeader, TableRow, TableHeaderCell } from "@fluentui/react-components";
// import { ProgressBar } from "@fluentui/react-components";

// interface FileUploadProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// const FileUpload: React.FC<FileUploadProps> = ({ isOpen, onClose }) => {
//   const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
//   const [uploading, setUploading] = React.useState(false);
//   const [progress, setProgress] = React.useState(0);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setSelectedFiles(Array.from(event.target.files));
//     }
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       alert("Please select files first.");
//       return;
//     }

//     setUploading(true);
//     setProgress(0);

//     // const formData = new FormData();
//     // selectedFiles.forEach((file) => {
//     //   formData.append("file", file);
//     //   formData.append("metadata_id", crypto.randomUUID());
//     //   formData.append("schema_id", "schema_id");
//     // });


//     // update 
//     const metadata = {
//       Metadata_Id: crypto.randomUUID(),
//       Schema_Id: "Schema 001",
//     };

//     const formData = new FormData();

//     selectedFiles.forEach((file) => {
//       // Attach the file
//       formData.append("file", file);
//       // Attach JSON metadata (replace the name if needed by your API)
//       formData.append("data", JSON.stringify(metadata));
//     });


//     try {
//       const response = await fetch(`${API_BASE_URL}/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const responseData = await response.json();
//         alert("Files uploaded successfully!");
//         setSelectedFiles([]);
//       } else {
//         alert("Upload failed. Try again.");
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Error uploading files.");
//     } finally {
//       setUploading(false);
//       onClose(); // Close the dialog after upload
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={(event, data) => !data.open && onClose()}>
//       <DialogSurface>
//         <DialogBody>
//           <DialogTitle>Upload Documents</DialogTitle>
//           <input type="file" multiple onChange={handleFileChange} style={{ display: "none" }} id="fileInput" />
//           <Button onClick={() => document.getElementById("fileInput")?.click()}>Browse Files</Button>

//           {selectedFiles.length > 0 && (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHeaderCell>File Name</TableHeaderCell>
//                   <TableHeaderCell>Size (bytes)</TableHeaderCell>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {selectedFiles.map((file) => (
//                   <TableRow key={file.name}>
//                     <TableCell>{file.name}</TableCell>
//                     <TableCell>{file.size}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}

//           {uploading && <ProgressBar value={progress} />}

//           <DialogActions>
//             <Button appearance="primary" onClick={handleUpload} disabled={uploading}>
//               Upload
//             </Button>
//             <Button onClick={onClose}>Cancel</Button>
//           </DialogActions>
//         </DialogBody>
//       </DialogSurface>
//     </Dialog>
//   );
// };

// export default FileUpload;