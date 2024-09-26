import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, List, Shield } from "lucide-react"
import { Appbar } from "@/components/ui/Appbar"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Appbar/>
      {/* <BackgroundBeams/> */}

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Share Your Files Securely</h1>
          <p className="text-xl mb-12">Upload, manage, and share your files with ease. Get started for free!</p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
            <div className="bg-gray-800 p-6 rounded-lg">
              <Upload className="w-12 h-12 mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Easy Uploads</h3>
              <p className="text-gray-400">Drag and drop or select files to upload instantly.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <List className="w-12 h-12 mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">File Dashboard</h3>
              <p className="text-gray-400">Keep track of all your uploaded files in one place.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <Shield className="w-12 h-12 mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-400">Your files are encrypted and stored securely.</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-bold mb-4">Get Started with FileShare</h2>
            <p className="mb-6">Create your free account to start uploading and sharing files securely.</p>
            <Button size="lg" className="text-lg">
              Create Your Free Account <ArrowRight className="ml-2" />
            </Button>
          </div>
          
          <div className="text-left">
            <h2 className="text-2xl font-bold mb-4">Why Choose FileShare?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Unlimited file uploads with your free account</li>
              <li>Secure, encrypted storage for all your files</li>
              <li>Easy-to-use dashboard to manage your uploads</li>
              <li>Share files with customizable access controls</li>
              <li>Access your files from any device, anywhere</li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2023 FileShare. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/terms" className="underline mr-4">Terms of Service</Link>
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
