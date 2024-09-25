"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Upload, Folder, Settings, HelpCircle, Menu, File, X, CheckCircle } from "lucide-react"
import { getPublicUrl, getSignedURL } from "@/app/actions/S3Function"
import { useSession } from "next-auth/react";
import { createData, pushDatatoDB } from "@/app/actions/createData"
import axios from "axios"
import { Progress } from "./progress"
import { sideBarOpenAtom } from "@/state"
import { useRecoilValue } from "recoil"

export interface DashboardData{
  userId : string
  url : string
  fileName : string
}

interface UploadingFile {
  file : File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'uploaded';
}

export const UploadPage = ()=>{
  const [data , setData] = useState<DashboardData[]>([])
  const isSidebarOpen = useRecoilValue(sideBarOpenAtom)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<UploadingFile[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState<File>()

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      
      const newFiles = Array.from(e.target.files)
      handleFiles(newFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const filesToAdd = newFiles.map(file => ({
      file : file,
      id: Math.random().toString(36).slice(2, 9),
      progress: 0,
      status: 'pending' as const
    }))

    

    setSelectedFiles(prevFiles => [...prevFiles, ...filesToAdd])
  }

  const removeFile = (id: string) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.id !== id))
  }

  const simulateFileUpload = async(file: UploadingFile) => {
    
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 10
        if (progress > 100) {
          progress = 100
          clearInterval(interval)
          setSelectedFiles(prevFiles =>
            prevFiles.map(f =>
              f.id === file.id ? { ...f, progress: 100, status: 'uploaded' } : f
            )
          )
          resolve()
        } else {
          setSelectedFiles(prevFiles =>
            prevFiles.map(f =>
              f.id === file.id ? { ...f, progress, status: 'uploading' } : f
            )
          )
        }
      }, 200)
    })
  }

  const handleUpload = async () => {
    setIsUploading(true)
    const pendingFiles = selectedFiles.filter(file => file.status === 'pending')
    for (const file of pendingFiles) {
      await simulateFileUpload(file)
      console.log(file.file)
      // await handleUploading(file.file)
    }

    await selectedFiles.map((item)=>{
      handleUploading(item.file)
    })

    const res = await pushDatatoDB(data)



    
    if(res){
      alert("files uploaded")
      
    } else {
      alert("files upload failed!")
      
    }
    setIsUploading(false)
    setData([])
    setSelectedFiles([])

  }
  const handleUploading = async (currentFile: File) => {
    const uploadedFileId = uuidv4();
    const signedURLResult = await getSignedURL(uploadedFileId);
    if (signedURLResult.failure !== undefined) {
      console.error(signedURLResult.failure);
      return;
    }

    const publicUrl = await getPublicUrl(uploadedFileId);
    const { url } = signedURLResult.success;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": currentFile.type,
      },
      body: currentFile,
    });

    const tempData : DashboardData = await createData(publicUrl , currentFile.name)
    setData((prev :any)=>{
      return [...prev , tempData]
    })
  };

  useEffect(() => {
    const totalProgress = selectedFiles.reduce((sum, file) => sum + file.progress, 0)
    const averageProgress = totalProgress / (selectedFiles.length || 1)
    setOverallProgress(averageProgress)
  }, [selectedFiles])



  // const handleUpload = async () => {
  //   await selectedFiles.map((file: File) => {
  //     handleUploading(file);
  //   });
  //   console.log(data)

  //   const res = await pushDatatoDB(data)

  //   if(res){
  //     alert("files uploaded")
      
  //   } else {
  //     alert("files upload failed!")

  //   }
  //   setData([])
  //   setSelectedFiles([])
  // };

    return (
      <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <h1 className="text-3xl font-bold mb-6">Upload Files</h1>

      {/* Upload Drop Box */}
      <div 
        className={`mb-8 p-8 border-2 border-dashed rounded-lg text-center ${
          isDragging ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-600'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input 
          type="file" 
          onChange={handleFileInput} 
          className="hidden" 
          id="file-upload" 
          multiple 
        />
        <label 
          htmlFor="file-upload" 
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="h-12 w-12 mb-4 text-gray-400" />
          <p className="text-lg mb-2">Drag and drop files here, or click to select files</p>
          <p className="text-sm text-gray-400">Supported file types: PDF, DOCX, JPG, PNG</p>
        </label>
      </div>

      {/* Overall Progress Bar */}
      {selectedFiles.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-4">Upload Progress</h2>
          <div className="flex items-center space-x-2">
            <Progress value={overallProgress} className="flex-grow h-2" />
            <span className="text-sm w-12 text-right">{overallProgress.toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold mb-4">Selected Files</h2>
          <div className="space-y-4">
            {selectedFiles.map((file) => (
              <div key={file.id} className="bg-gray-700 p-4 rounded flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                  <File className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="font-medium text-lg truncate">{file.file.name}</span>
                </div>
                {file.status === 'uploaded' && (
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Uploaded</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-red-400 hover:text-red-300 flex-shrink-0"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.some(file => file.status === 'pending') && (
        <Button onClick={handleUpload} className="w-full" disabled={isUploading}>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? 'Uploading...' : `Upload ${selectedFiles.filter(f => f.status === 'pending').length} file(s)`}
        </Button>
      )}
    </main>
    )
}


function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}