"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import axios, { isAxiosError } from "axios";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  postId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  // 기타 필드
  date?: string;
  genre?: string;
  articleCategory?: string;
  historyCategory?: string;
  desc?: string;
  titleEng?: string;
}

export function PostsBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 게시글 데이터 불러오기
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/posts");

      // 날짜 기준 내림차순 정렬 (최신순)
      const sortedPosts = res.data.sort(
        (a: Post, b: Post) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPosts(sortedPosts);
      setErrorMsg(null);
    } catch (error) {
      console.error("게시글 데이터 가져오기 오류:", error);
      if (isAxiosError(error)) {
        setErrorMsg(
          error.response?.data.message ||
            "게시글을 불러오는 중 오류가 발생했습니다."
        );
      } else {
        setErrorMsg("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 게시글 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/posts?id=${id}`);
        await fetchPosts(); // 삭제 후 목록 갱신
        setErrorMsg(null);
      } catch (error) {
        console.error("게시글 삭제 오류:", error);
        if (isAxiosError(error)) {
          setErrorMsg(
            error.response?.data.message ||
              "게시글 삭제 중 오류가 발생했습니다."
          );
        } else {
          setErrorMsg("게시글 삭제 중 오류가 발생했습니다.");
        }
      }
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: ko });
    } catch (error) {
      return dateString;
    }
  };

  // 카테고리 태그 스타일 매핑
  const categoryStyles: Record<string, string> = {
    "Work In Progress": "bg-purple-600",
    Articles: "bg-blue-600",
    History: "bg-yellow-600",
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-3 rounded">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-zinc-400">
          게시글을 불러오는 중...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-zinc-400">게시글이 없습니다.</div>
      ) : (
        <Table className="break-keep bg-zinc-800 text-zinc-100">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-300">제목</TableHead>
              <TableHead className="text-zinc-300">카테고리</TableHead>
              <TableHead className="text-zinc-300">작성일</TableHead>
              <TableHead className="text-zinc-300">수정일</TableHead>
              <TableHead className="text-zinc-300 text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} className="border-b border-zinc-700">
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      categoryStyles[post.category] || "bg-zinc-600"
                    }`}
                  >
                    {post.category}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-300">
                  {formatDate(post.createdAt)}
                </TableCell>
                <TableCell className="text-zinc-300">
                  {formatDate(post.updatedAt)}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Link href={`/administrator/posts/view/${post.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-300 hover:text-zinc-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/administrator/posts/edit/${post.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-300 hover:text-zinc-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id)}
                    className="text-zinc-300 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
