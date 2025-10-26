"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Link,
  Upload,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { api } from "@/lib/api";
import { auth, storage } from "@/lib/firebaseClient";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

interface Submission {
  id: string;
  screenshot: string;
  storyLink: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  notes?: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [storyLink, setStoryLink] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!auth || !auth.currentUser) {
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const data = await api.getSubmissions(auth.currentUser.uid);
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const uploadScreenshot = async (file: File): Promise<string> => {
    if (!storage || !auth?.currentUser) {
      throw new Error("Firebase storage or auth not initialized");
    }

    const storageRef = ref(
      storage,
      `submissions/${auth.currentUser.uid}/${Date.now()}_${file.name}`,
    );
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !auth.currentUser || !screenshot) return;

    setIsUploading(true);
    try {
      // Upload screenshot to Firebase Storage
      const screenshotUrl = await uploadScreenshot(screenshot);

      // Submit to API
      const submissionData = {
        screenshot: screenshotUrl,
        storyLink,
        amount: amount ? parseFloat(amount) : 0,
        influencerId: auth.currentUser.uid,
      };

      const newSubmission = await api.uploadSubmission(submissionData);
      setSubmissions((prev) => [newSubmission, ...prev]);

      // Reset form
      setScreenshot(null);
      setStoryLink("");
      setAmount("");
      (document.getElementById("screenshot") as HTMLInputElement).value = "";

      alert("Submission uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload submission:", error);
      alert("Failed to upload submission. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-muted">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fg mb-2">Submissions</h1>
          <p className="text-muted">
            Upload proof of your posts to get cashback approved
          </p>
        </div>

        {/* Upload Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-accent" />
              Upload New Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="screenshot"
                  className="block text-sm font-medium text-fg mb-2"
                >
                  Screenshot of Your Post *
                </label>
                <input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
                {screenshot && (
                  <p className="text-sm text-muted mt-1">
                    Selected: {screenshot.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="story-link"
                  className="block text-sm font-medium text-fg mb-2"
                >
                  Story/Post Link *
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    id="story-link"
                    type="url"
                    value={storyLink}
                    onChange={(e) => setStoryLink(e.target.value)}
                    placeholder="https://instagram.com/stories/..."
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-fg mb-2"
                >
                  Amount Spent (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <p className="text-xs text-muted mt-1">
                  Enter the amount you spent to help calculate your cashback
                </p>
              </div>

              <Button
                type="submit"
                disabled={isUploading || !screenshot || !storyLink}
                className="w-full"
              >
                {isUploading ? "Uploading..." : "Upload Submission"}
                <Upload className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Submissions History */}
        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <div
                    key={submission.id || index}
                    className="border border-border rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(submission.status)}
                        <div>
                          <h4 className="font-medium text-fg">
                            Submission #{submission.id || index + 1}
                          </h4>
                          <p className="text-sm text-muted">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(
                              submission.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}
                      >
                        {submission.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-fg mb-1">
                          Story Link:
                        </p>
                        <a
                          href={submission.storyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline break-all"
                        >
                          {submission.storyLink}
                        </a>
                      </div>

                      {submission.amount > 0 && (
                        <div>
                          <p className="text-sm font-medium text-fg mb-1">
                            Amount:
                          </p>
                          <p className="text-sm text-muted">
                            ₹{submission.amount.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {submission.screenshot && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-fg mb-2">
                          Screenshot:
                        </p>
                        <Image
                          src={submission.screenshot}
                          alt="Submission screenshot"
                          width={300}
                          height={200}
                          className="max-w-xs rounded-lg border border-border"
                        />
                      </div>
                    )}

                    {submission.notes && (
                      <div className="mt-3 p-3 bg-accent-light rounded-lg">
                        <p className="text-sm font-medium text-fg mb-1">
                          Admin Notes:
                        </p>
                        <p className="text-sm text-muted">{submission.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-fg mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-muted">
                  Upload your first proof to start earning cashback
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
