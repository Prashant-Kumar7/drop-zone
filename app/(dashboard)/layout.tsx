"use client";
import { Appbar } from "@/components/ui/Appbar";
// import { Menu } from "@/components/ui/Menu";
import { usePathname } from "next/navigation";

import { useState } from "react"
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
import { useRecoilState } from "recoil";
import { sideBarOpenAtom } from "@/state";
import { signOut } from "next-auth/react";

const initialFiles = [
  { id: 1, name: "document.pdf", url: "https://example.com/document.pdf" , createdDate : "10/11/2000" },
  { id: 2, name: "image.jpg", url: "https://example.com/image.jpg", createdDate : "10/11/2000" },
  { id: 3, name: "spreadsheet.xlsx", url: "https://example.com/spreadsheet.xlsx", createdDate : "10/11/2000" },
]

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {

  const [files, setFiles] = useState(initialFiles)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<number | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(sideBarOpenAtom)

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-zinc-900 p-4 flex justify-between z-20 items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/dashboard" className="text-2xl font-bold">
            FileShare
          </Link>
        </div>
        <Button onClick={()=>{ signOut({callbackUrl : "/" , redirect : true}) }} variant="ghost" className="text-gray-100">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`bg-zinc-800 w-64 p-4 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-16 bottom-0 z-10`}>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-lg">
              <a className="flex items-center" href="/upload">
                <Upload className="mr-2 h-5 w-5" /> Upload
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-lg">
              <a className="flex items-center" href="/my-files">
              <Folder className="mr-2 h-5 w-5" /> My Files
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-lg">
              <Settings className="mr-2 h-5 w-5" /> Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-lg">
              <HelpCircle className="mr-2 h-5 w-5" /> Help
            </Button>
          </nav>
        </aside>

        {children}        
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 text-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the file from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-gray-100 hover:bg-gray-600">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}