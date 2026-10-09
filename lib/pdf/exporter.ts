import { jsPDF } from "jspdf";
import { StoryData } from "../types/manga";

/**
 * Builds and downloads a high-resolution A5 Manga PDF with embedded pages, artwork, and crisp lettering
 */
export async function exportMangaPDF(story: StoryData): Promise<string> {
  // A5 format: 148 x 210 mm
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
  });

  const pageWidth = 148;
  const pageHeight = 210;
  const margin = 8;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  // Cover Page
  doc.setFillColor(15, 15, 20);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Cover Header Frame
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, contentWidth, contentHeight);

  // Cover Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const titleLines = doc.splitTextToSize(story.title.toUpperCase(), contentWidth - 10);
  doc.text(titleLines, pageWidth / 2, 45, { align: "center" });

  // Style badge
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 210);
  doc.text(`[ ${story.style.toUpperCase()} • ${story.colorMode.toUpperCase()} • ${story.readingDirection.toUpperCase()} ]`, pageWidth / 2, 60, { align: "center" });

  // Logline
  if (story.logline) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 190);
    const logLines = doc.splitTextToSize(`"${story.logline}"`, contentWidth - 16);
    doc.text(logLines, pageWidth / 2, 75, { align: "center" });
  }

  // Cover Illustration / Character showcase if available
  const mainChar = story.characters?.[0];
  if (mainChar?.refImageUrl) {
    try {
      doc.addImage(mainChar.refImageUrl, "JPEG", margin + 12, 90, contentWidth - 24, 75);
    } catch {
      // ignore image embedding error in node environment
    }
  }

  // Footer metadata
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 150);
  doc.text("GENERATED WITH MANGAFORGE • STORY TO MANGA ENGINE", pageWidth / 2, pageHeight - 14, { align: "center" });

  // Story Pages
  const pages = story.pages || [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    doc.addPage("a5", "portrait");

    // Page Background
    if (story.colorMode === "bw") {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
    } else {
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
    }

    // Page Border
    doc.setDrawColor(30, 30, 35);
    doc.setLineWidth(0.6);
    doc.rect(margin, margin, contentWidth, contentHeight);

    // Page Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(60, 60, 70);
    doc.text(story.title, margin + 2, margin - 2);
    doc.text(`PAGE ${page.pageNo} / ${pages.length}`, pageWidth - margin - 2, margin - 2, { align: "right" });

    // Render Panels
    const panels = page.panels || [];
    const panelCount = panels.length;

    // Distribute panels in vertical grid
    const panelGap = 3;
    const availableHeight = contentHeight - 4;
    const panelHeightCalculated = (availableHeight - (panelCount - 1) * panelGap) / panelCount;

    for (let pIdx = 0; pIdx < panelCount; pIdx++) {
      const panel = panels[pIdx];
      const panelY = margin + 2 + pIdx * (panelHeightCalculated + panelGap);
      const panelX = margin + 2;
      const panelW = contentWidth - 4;

      // Panel Frame
      doc.setDrawColor(20, 20, 20);
      doc.setLineWidth(0.5);
      doc.rect(panelX, panelY, panelW, panelHeightCalculated);

      // Panel Artwork embedding
      if (panel.imageUrl) {
        try {
          doc.addImage(panel.imageUrl, "JPEG", panelX + 0.5, panelY + 0.5, panelW - 1, panelHeightCalculated - 1);
        } catch {
          // fallback placeholder box
        }
      }

      // Panel Caption if present
      if (panel.caption) {
        doc.setFillColor(255, 255, 255);
        doc.rect(panelX + 2, panelY + 2, panelW - 4, 8, "FD");
        doc.setTextColor(20, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.text(panel.caption.slice(0, 70), panelX + 4, panelY + 6);
      }

      // Panel Dialogue Bubbles
      if (panel.dialogue && panel.dialogue.length > 0) {
        panel.dialogue.forEach((d, dIdx) => {
          const bubbleY = panelY + 12 + dIdx * 9;
          const bubbleX = panelX + (dIdx % 2 === 0 ? 4 : panelW - 55);
          const bubbleW = Math.min(50, panelW - 8);

          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.3);
          doc.roundedRect(bubbleX, bubbleY, bubbleW, 7.5, 2, 2, "FD");

          doc.setFont("helvetica", d.type === "shout" ? "bold" : "normal");
          doc.setFontSize(5.5);
          doc.setTextColor(0, 0, 0);
          doc.text(`${d.speaker}: "${d.text}"`.slice(0, 40), bubbleX + 2, bubbleY + 5);
        });
      }

      // SFX Text
      if (panel.sfx) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(220, 38, 38);
        doc.text(panel.sfx, panelX + panelW - 14, panelY + panelHeightCalculated - 4);
      }
    }

    // Page Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 130);
    doc.text("MANGAFORGE.APP", pageWidth / 2, pageHeight - 2.5, { align: "center" });
  }

  // Generate Data URL or blob
  const pdfBlob = doc.output("bloburl");
  return pdfBlob.toString();
}
