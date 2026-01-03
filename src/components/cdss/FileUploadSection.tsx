import { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'text';
  data?: string; // base64 for images
  content?: string; // text content
  extractedText?: string; // for PDFs
  preview?: string;
}

interface FileUploadSectionProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  isProcessing?: boolean;
}

export function FileUploadSection({ files, onFilesChange, isProcessing }: FileUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    await processFiles(selectedFiles);
    if (inputRef.current) inputRef.current.value = '';
  };

  const processFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = [];

    for (const file of fileList) {
      setProcessingFile(file.name);
      
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      
      if (file.type.startsWith('image/')) {
        // Process image - convert to base64
        const base64 = await fileToBase64(file);
        newFiles.push({
          id,
          name: file.name,
          type: 'image',
          data: base64,
          preview: base64
        });
      } else if (file.type === 'application/pdf') {
        // For PDFs, we'll send as base64 and let AI extract text
        const base64 = await fileToBase64(file);
        newFiles.push({
          id,
          name: file.name,
          type: 'pdf',
          data: base64,
          extractedText: `[PDF Document: ${file.name}]`
        });
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        // Text files
        const content = await file.text();
        newFiles.push({
          id,
          name: file.name,
          type: 'text',
          content
        });
      }
    }

    setProcessingFile(null);
    onFilesChange([...files, ...newFiles]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          isProcessing && "pointer-events-none opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.csv"
          onChange={handleFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center gap-2">
          {processingFile ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing {processingFile}...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: Images (X-rays, CT scans), PDFs (lab reports), Text files
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {files.map((file) => (
            <Card key={file.id} className="flex items-center gap-3 p-3">
              {file.type === 'image' && file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                  {getFileIcon(file.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{file.type}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => removeFile(file.id)}
                disabled={isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
