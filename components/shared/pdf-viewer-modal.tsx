"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { useState } from "react"

interface PDFViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  pdfUrl: string
}

export function PDFViewerModal({ isOpen, onClose, title, pdfUrl }: PDFViewerModalProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = pdfUrl
    a.download = `${title}.pdf`
    a.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-mono">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRotation((rotation + 90) % 360)}>
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 rounded-md">
          <div
            className="flex items-center justify-center min-h-full p-4"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: "center",
              transition: "transform 0.2s",
            }}
          >
            <iframe src={pdfUrl} className="w-full h-full min-h-[800px] bg-white rounded shadow-lg" title={title} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
