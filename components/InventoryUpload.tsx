import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { analyzePantryImage } from '../services/gemini';
import { InventoryItem } from '../types';

interface InventoryUploadProps {
  onUpdateInventory: (newItems: InventoryItem[]) => void;
}

export const InventoryUpload: React.FC<InventoryUploadProps> = ({ onUpdateInventory }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      // Automatically start analysis when file is selected
      runAnalysis(result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePantryImage(base64Data);
      
      // Transform AI result to InventoryItem format
      const newItems: InventoryItem[] = result.items.map((item, index) => ({
        id: `ai-${Date.now()}-${index}`,
        name: item.name,
        count: item.count,
        category: item.category,
        lastUpdated: 'Just now',
        daysUntilEmpty: Math.floor(item.count * 1.5), // Simple heuristic simulation
        status: item.count < 3 ? 'Critical' : item.count < 6 ? 'Low' : 'Good'
      }));

      onUpdateInventory(newItems);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Smart Stock Update</h2>
        <p className="text-slate-400">Take a photo of the pantry shelf. Gemini AI will count items and update the database.</p>
      </div>

      <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 hover:border-indigo-500 transition-colors bg-white/5 group min-h-[300px] flex flex-col items-center justify-center">
        {preview ? (
          <div className="relative w-full h-full flex flex-col items-center">
            <img src={preview} alt="Upload preview" className="max-h-[300px] rounded-lg shadow-lg mb-4" />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-3" />
                <p className="text-indigo-200 font-medium animate-pulse">Analyzing visual data...</p>
              </div>
            )}
            {!isAnalyzing && !error && (
              <div className="flex items-center text-emerald-400 gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>
            )}
          </div>
        ) : (
            <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium text-white mb-1">Click to Upload or Drag Photo</p>
            <p className="text-sm text-slate-500">Supports JPG, PNG (Max 5MB)</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange} 
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-200">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
         <button 
           onClick={() => {
             setPreview(null);
             setError(null);
           }}
           className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
           disabled={isAnalyzing}
         >
           Reset
         </button>
         <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2"
            disabled={isAnalyzing}
         >
           <Upload className="w-4 h-4" />
           Select Image
         </button>
      </div>
    </div>
  );
};
