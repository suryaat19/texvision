"use client";
import { useState } from "react";
import Tesseract from "tesseract.js";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import {
  getWordCount,
  getSentenceCount,
  getCharacterCount,
  getAverageWordLength,
  getTextArea,
} from "./utils/stats";

const LANGUAGES = [
  { code: 'eng', label: 'English' },
  { code: 'hin', label: 'Hindi (हिंदी)' },
  { code: 'mar', label: 'Marathi (मराठी)' },
  { code: 'tam', label: 'Tamil (தமிழ்)' },
  { code: 'tel', label: 'Telugu (తెలుగు)' },
];

export default function Home() {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [language, setLanguage] = useState<string>("eng");
  const [downloadFormat, setDownloadFormat] = useState<string>("txt");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus("Initializing...");
    setText("");

    try {
      const result = await Tesseract.recognize(
        file,
        language,
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setStatus(`Processing: ${Math.round(m.progress * 100)}%`);
            } else {
              setStatus(m.status.replace(/_/g, " "));
            }
          },
        }
      );

      setText(result.data.text);
      setStatus("Done!");
    } catch (err) {
      console.error(err);
      setStatus("Error occurred");
    } finally {
      setIsLoading(false);
    }
  };


  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `extracted_${language}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 10);
    doc.save(`extracted_${language}.pdf`);
  };

  const downloadDocx = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(text),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `extracted_${language}.docx`);
    });
  };

  const handleDownload = () => {
    if (!text) return;

    switch (downloadFormat) {
      case "pdf":
        downloadPdf();
        break;
      case "docx":
        downloadDocx();
        break;
      case "txt":
      default:
        downloadTxt();
        break;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between py-8 md:py-16 md:px-16 px-4 bg-white dark:bg-black sm:items-start">
        <div className="uppercase text-2xl font-ibm-sans font-bold tracking-wide text-foreground dark:text-white mb-8">
          <span className="-tracking-widest">tex</span>vision
        </div>

        <div className="grid-cols-1 md:grid-cols-2 grid gap-4 md:gap-32 w-full">
          <div className="hidden md:flex flex-col gap-6 items-start text-left">

            <div className="w-full max-w-50">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50 dark:text-foreground/70 mb-1.5 block">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 rounded-sm bg-zinc-100 dark:bg-zinc-900 text-foreground text-sm focus:outline-none focus:border-foreground"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <button
                type="button"
                className={`p-16 bg-zinc-100 rounded-sm border border-dashed border-foreground/30 hover:bg-zinc-200 dark:bg-zinc-900 dark:border-foreground/60 dark:hover:bg-zinc-800 transition-colors ${isLoading ? "opacity-50 cursor-wait" : ""}`}
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-12 w-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                  </div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="48px"
                    viewBox="0 -960 960 960"
                    width="48px"
                    fill="currentColor"
                    className="text-foreground"
                  >
                    <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                  </svg>
                )}
              </button>

              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                disabled={isLoading}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                onChange={handleImageUpload}
              />
            </div>

            <div className="h-6">
              {status && <p className="text-sm font-medium text-foreground/70 animate-pulse capitalize">{status}</p>}
            </div>

            <h1 className="max-w-sm md:text-lg text-xs font-light leading-tight text-black dark:text-zinc-50">
              Upload an image containing text in your chosen language.
            </h1>
          </div>

          <div className="md:hidden flex flex-col items-center gap-6 text-center">
            <div className="w-full max-w-50 flex justify-between items-center gap-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground/50 dark:text-foreground/70 mb-1.5 block">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 rounded-sm border border-foreground/30 bg-white dark:bg-zinc-900 text-foreground text-sm focus:outline-none focus:border-foreground"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center gap-6">
              <div className="relative group">
                <button
                  type="button"
                  className={`p-16 bg-zinc-100 rounded-sm border border-dashed border-foreground/30 hover:bg-zinc-200 dark:bg-zinc-900 dark:border-foreground/60 dark:hover:bg-zinc-800 transition-colors ${isLoading ? "opacity-50 cursor-wait" : ""}`}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-12 w-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="48px"
                      viewBox="0 -960 960 960"
                      width="48px"
                      fill="currentColor"
                      className="text-foreground"
                    >
                      <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>
                  )}
                </button>

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  disabled={isLoading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="flex flex-col">
                <div className="h-6">
                  {status && <p className="text-sm font-medium text-foreground/70 animate-pulse capitalize">{status}</p>}
                </div>

                <h1 className="max-w-sm text-sm font-light leading-tight text-black dark:text-zinc-50">
                  Upload an image containing text in your chosen language.
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <textarea
              readOnly
              placeholder="Extracted text will appear here..."
              className="h-84 w-full resize-none rounded-xl bg-zinc-50 p-4 text-sm leading-relaxed text-foreground dark:bg-zinc-900 dark:border-foreground/60 dark:text-foreground focus:outline-none"
              value={getTextArea(text)}
            >
            </textarea>

            <div className="flex items-center justify-around">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-900 text-foreground text-sm focus:outline-none"
              >
                <option value="txt">txt</option>
                <option value="docx">docx</option>
                <option value="pdf">pdf</option>
              </select>

              <button
                onClick={handleDownload}
                disabled={!text}
                className={`rounded-xl bg-black text-sm dark:bg-white text-white dark:text-black px-4 py-2 font-bold transition-colors ${!text ? "cursor-not-allowed" : "hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"}`}
              >
                Download File
              </button>
            </div>
          </div>

        </div>

        <div className="mt-8 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                <tr>
                  <th className="pl-6 py-4 font-medium tracking-wide">No. of Words</th>
                  <th className="pl-6 py-4 font-medium tracking-wide">No. of Sentences</th>
                  <th className="pl-6 py-4 font-medium tracking-wide">No. of Characters</th>
                  <th className="pl-6 py-4 font-medium tracking-wide">Average Word Length</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {getWordCount(text)}
                  </td>
                  <td className="px-6 py-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {getSentenceCount(text)}
                  </td>
                  <td className="px-6 py-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {getCharacterCount(text)}
                  </td>
                  <td className="px-6 py-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {getAverageWordLength(text) > 0 ? getAverageWordLength(text).toFixed(2) : "0"}
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>
      </main>
    </div>
  );
}