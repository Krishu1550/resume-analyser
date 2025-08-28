import { useCallback, useRef, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils';
interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}


const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    //const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFile = acceptedFiles[0] || null;
        onFileSelect?.(file);
        setFile(newFile);
        console.log(acceptedFiles);
    }, [onFileSelect]);

    

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
        onDragEnter: undefined,
        onDragOver: undefined,
        onDragLeave: undefined
    })

    
    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect?.(null);
        setFile(null);
    }



    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
               <input  {...getInputProps() as React.InputHTMLAttributes<HTMLInputElement>}           
               />
               


                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className="size-10" />
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer" onClick={(e) => {
                                removeFile(e);
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ): (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader