import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export async function generatePDF(elementId: string, fileName: string) {
  try {
    // Get the element to print
    const element = document.getElementById(elementId)
    if (!element) {
      console.error("Element not found")
      return
    }

    // Clone the element to modify it for printing
    const printElement = element.cloneNode(true) as HTMLElement
    printElement.style.display = "block"
    printElement.style.position = "absolute"
    printElement.style.left = "-9999px"
    document.body.appendChild(printElement)

    // Generate canvas
    const canvas = await html2canvas(printElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      windowWidth: 794, // A4 width in pixels at 96 DPI
      windowHeight: 1123, // A4 height in pixels at 96 DPI
    })

    // Remove the cloned element
    document.body.removeChild(printElement)

    // Calculate dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Add image to PDF
    pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, 0, imgWidth, imgHeight, "", "FAST")

    // Save PDF
    pdf.save(`${fileName}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
  }
}

