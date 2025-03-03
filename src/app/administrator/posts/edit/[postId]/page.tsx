"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/admin/dashboard/PostsManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { notFound } from "next/navigation";

export default function EditPostPage({
  params,
}: {
  params: { postId: string };
}) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { postId } = params;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/posts?id=${postId}&includeDeleted=true`
        );
        setPost(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error("포스트 로딩 오류:", error);
        setError(
          error.response?.data?.message || "포스트를 불러오는 데 실패했습니다"
        );
        setLoading(false);

        // 404 에러인 경우 notFound 페이지로 이동
        if (error.response?.status === 404) {
          notFound();
        }
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleEditSuccess = () => {
    // 편집 성공 시 관리자 포스트 목록 페이지로 이동
    router.push("/administrator");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-destructive">오류 발생</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>포스트 수정 - {post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <PostEditor
            initialData={post}
            isEditing={true}
            onEditSuccess={handleEditSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
