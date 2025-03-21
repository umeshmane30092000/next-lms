"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, Trash } from "lucide-react";
import { Course } from "@prisma/client";

interface ImageUploaderProps {
  initialData: Course;
  courseId: string;
}

export default function ImageUploader({
  initialData,
  courseId,
}: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    initialData.imageUrl || null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadedUrl(null); // Hide previous image while uploading a new one
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const { data } = await axios.post("/api/upload", formData);

      if (data.success) {
        await axios.patch(`/api/courses/${courseId}`, {
          imageUrl: data.data.secure_url,
        });
        setUploadedUrl(data.data.secure_url);
        setFile(null);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <CardContent className="flex flex-col items-center gap-4">
        {!uploadedUrl && (
          <>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full mt-4"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </>
              )}
            </Button>
          </>
        )}

        {uploadedUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Uploaded Image:</p>
            <img
              src={uploadedUrl}
              alt="Uploaded"
              className="mt-2 w-40 h-40 object-cover rounded-lg shadow-md"
            />
            <Button
              onClick={() => setUploadedUrl(null)}
              variant="outline"
              className="mt-4"
            >
              <Trash className="w-4 h-4 mr-2" /> Replace Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
