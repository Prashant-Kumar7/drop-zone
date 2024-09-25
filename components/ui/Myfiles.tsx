"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { Copy, MoreVertical, Trash2, LogOut, Upload, Folder, Settings, HelpCircle, Menu } from "lucide-react"
import { getDashboardData } from "@/app/actions/dashboard"
import { useRecoilValue } from "recoil"
import { sideBarOpenAtom } from "@/state"

const initialFiles = [
    { id: 1, name: "document.pdf", url: "https://example.com/document.pdf" , createdDate : "10/11/2000" },
    { id: 2, name: "image.jpg", url: "https://example.com/image.jpg", createdDate : "10/11/2000" },
    { id: 3, name: "spreadsheet.xlsx", url: "https://example.com/spreadsheet.xlsx", createdDate : "10/11/2000" },
  ]



export const Myfiles = ()=>{

  const [files, setFiles] = useState<any[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<number | null>(null)
  const isSidebarOpen = useRecoilValue(sideBarOpenAtom)


  useEffect(()=>{
    fetchData() 
  },[])

  const fetchData = async()=>{
    const data = await getDashboardData()
    setFiles(data)
  }

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url)
          .then(() => {
            // You could add a toast notification here
            console.log("URL copied to clipboard")
          })
          .catch((err) => {
            console.error("Failed to copy URL: ", err)
          })
      }
    
      const handleDeleteFile = (id: number) => {
        setFileToDelete(id)
        setIsDeleteDialogOpen(true)
      }
    
      const confirmDelete = () => {
        if (fileToDelete !== null) {
          setFiles(files.filter(file => file.id !== fileToDelete))
          setIsDeleteDialogOpen(false)
          setFileToDelete(null)
        }
      }

    return (
        <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <h1 className="text-3xl font-bold mb-6">My Files</h1>
          <div className=" rounded-lg shadow overflow-hidden">
            <Table className="text-lg">
              <TableHeader>
                <TableRow className="">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right pr-10">Created on</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="">
                {files.map((file , index) => (
                  <TableRow className="border-0" key={index}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>{file.fileName}</TableCell>
                    <TableCell>
                      <div className="flex items-center bg-gray-800 rounded-lg">
                        <Input 
                          value={file.url} 
                          readOnly 
                          className=" border-0 text-gray-100"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCopyUrl(file.url)}
                          className="ml-2"
                        >
                          <Copy className="h-4 w-4 bg-gray-800" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{file.createdOn.toDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-700 text-gray-100">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCopyUrl(file.url)}>
                            <Copy className="mr-2 h-4 w-4" /> Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteFile(index)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
    )
}

