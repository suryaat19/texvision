"use client";
import { useState } from "react";
import Tesseract from "tesseract.js";
import {
  getWordCount,
  getSentenceCount,
  getCharacterCount,
  getAverageWordLength,
  getTextArea,
} from "./utils/stats";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus("Initializing...");
    setText("");

    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setStatus(`Processing: ${Math.round(m.progress * 100)}%`);
            } else {
              setStatus(m.status);
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

  const handleDownload = () => {
    if (!text) return;
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "extracted_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-between py-8 md:py-16 md:px-16 px-4 bg-white dark:bg-black sm:items-start">
        <div className="uppercase text-2xl font-ibm-sans font-bold tracking-wide text-foreground dark:text-background">
          <span className="-tracking-widest">tex</span>vision
        </div>
        <div className="grid-cols-1 md:grid-cols-2 grid gap-4 md:gap-32 w-full">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start justify-around sm:text-left">
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
              {status && <p className="text-sm font-medium text-foreground/70 animate-pulse">{status}</p>}
            </div>

            <h1 className="max-w-sm md:text-lg text-xs font-light leading-tight text-black dark:text-zinc-50">
              To get started, upload an image containing minimum 20 lines of text of your mother tongue with five different fonts.
            </h1>

          </div>

          
          <div className="flex flex-col gap-6">
            <textarea
              readOnly
              placeholder="Extracted text will appear here..."
              className="h-84 w-full resize-none rounded-sm border border-foreground/30 bg-zinc-100 p-4 text-sm leading-relaxed text-foreground dark:bg-zinc-900 dark:border-foreground/60 dark:text-foreground focus:outline-none"
              value={getTextArea(text)}
            >
            </textarea>
            <button
              onClick={handleDownload}
              disabled={!text}
              className={`h-12 rounded-sm border border-solid border-black/8 md:px-5 px-8 transition-colors md:w-40 ${!text ? "opacity-50 cursor-not-allowed" : "hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"}`}
            >
              Download
            </button>
          </div>

        </div>

        <div className="flex flex-col gap-4 text-base font-medium mt-8 w-full">
          <table className="text-sm text-foreground/60 w-full md:w-auto">
            <tbody>
              <tr>
                <th className="pr-8 text-left py-2">No. of Words</th>
                <th className="pr-8 text-left py-2">No. of Sentences</th>
                <th className="pr-8 text-left py-2">No. of Characters</th>
                <th className="pr-8 text-left py-2">Average Word Length</th>
              </tr>
              <tr>
                <td className="text-left font-bold text-foreground text-lg">{getWordCount(text)}</td>
                <td className="text-left font-bold text-foreground text-lg">{getSentenceCount(text)}</td>
                <td className="text-left font-bold text-foreground text-lg">{getCharacterCount(text)}</td>
                <td className="text-left font-bold text-foreground text-lg">
                  {getAverageWordLength(text) > 0 ? getAverageWordLength(text).toFixed(2) : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}