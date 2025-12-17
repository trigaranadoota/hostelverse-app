"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import { verifyImageAction } from "@/app/image-verification/actions";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";
import { AlertCircle, CheckCircle, Loader2, UploadCloud } from "lucide-react";
import type { VerifyHostelImageOutput } from "@/ai/flows/verify-hostel-images";
import { useToast } from "@/hooks/use-toast";

export function ImageVerifier() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerifyHostelImageOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !preview) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image file to verify.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("photoDataUri", preview);
    
    startTransition(async () => {
      const response = await verifyImageAction(formData);
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Verification Error",
          description: response.details?.toString() || response.error,
        });
        setResult(null);
      } else if (response.success) {
        setResult(response.data!);
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Image Verification</CardTitle>
          <CardDescription>
            Upload an image of the hostel to get an AI-powered verification
            score and check for appropriateness.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Hostel Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
              />
            </div>
            {preview && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={preview}
                  alt="Image preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending || !file}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Verify Image
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Verification Results</CardTitle>
          <CardDescription>
            The analysis from the AI will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="mt-4 text-muted-foreground">Analyzing image... This may take a moment.</p>
            </div>
          )}
          {result && !isPending && (
            <div className="space-y-6">
              <Alert variant={result.isAppropriate ? "default" : "destructive"}>
                {result.isAppropriate ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>
                  {result.isAppropriate ? "Image is Appropriate" : "Image may be Inappropriate"}
                </AlertTitle>
              </Alert>
              
              <div className="space-y-2">
                <Label>Verification Score</Label>
                <div className="flex items-center gap-4">
                    <Progress value={result.verificationScore * 100} className="w-full"/>
                    <span className="font-bold text-lg">
                        {Math.round(result.verificationScore * 100)}%
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">
                    Likelihood that the image is authentic and good quality.
                </p>
              </div>

              <div className="space-y-2">
                <Label>AI Description</Label>
                <p className="text-sm p-3 bg-muted rounded-md border">{result.description}</p>
              </div>

              <Button className="w-full">Approve Image</Button>
            </div>
          )}
          {!result && !isPending && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p>Upload an image to see the verification results.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
