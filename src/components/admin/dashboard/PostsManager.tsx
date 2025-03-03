"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TiptapEditor from "../editor/TiptapEditor";
import axios from "axios";

const imageSchema = z
  .object({
    file: z.instanceof(File).optional(),
    url: z.string().optional(), // url 검사 제거
  })
  .refine(
    (data) => {
      // 파일이 있으면 URL 검사 불필요
      if (data.file) return true;

      // 파일이 없고 URL이 있을 경우만 URL 유효성 검사
      if (!data.file && data.url && data.url.trim() !== "") {
        try {
          new URL(data.url);
          return true;
        } catch {
          return false;
        }
      }

      // 둘 다 없으면 실패
      return false;
    },
    {
      message: "이미지 파일을 첨부하거나 유효한 URL을 입력해주세요",
    }
  );

const baseSchema = z.object({
  id: z.string().optional(),
  postId: z
    .string()
    .min(1, "포스트 ID는 필수입니다")
    .regex(/^[a-z0-9-]+$/, "소문자, 숫자, 하이픈(-)만 사용 가능합니다")
    .transform((val) => val.trim()),
  title: z.string().min(1, "제목은 필수입니다"),
  content: z.string().optional(), // content 필드 추가
  image: imageSchema,
  imageAlt: z.string().min(1, "이미지 설명은 필수입니다"),
});

const wipSchema = baseSchema.extend({
  genre: z.string().min(1, "장르는 필수입니다"),
  date: z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM 형식이어야 합니다"),
});

const articlesSchema = baseSchema.extend({
  category: z.string().min(1, "카테고리는 필수입니다"),
  desc: z.string().min(1, "설명은 필수입니다"),
  date: z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM 형식이어야 합니다"),
});

const historySchema = baseSchema.extend({
  titleEng: z.string().min(1, "영문 제목은 필수입니다"),
  category: z.string().min(1, "카테고리는 필수입니다"),
  date: z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM 형식이어야 합니다"),
});

const postSchema = z.discriminatedUnion("category", [
  z.object({ category: z.literal("Work In Progress"), data: wipSchema }),
  z.object({ category: z.literal("Articles"), data: articlesSchema }),
  z.object({ category: z.literal("History"), data: historySchema }),
]);

type PostData = z.infer<typeof postSchema>;

export function PostEditor() {
  const [category, setCategory] = useState<string>("Work In Progress");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    control,
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      category: "Work In Progress",
      data: {
        title: "",
        postId: "",
        content: "",
        image: { file: undefined, url: "" },
        imageAlt: "",
        genre: "",
        date: "",
      },
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("data.image.file", file as any);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 제목이 변경될 때 자동으로 postId 생성하는 함수
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("data.title", title);

    // 제목을 기반으로 URL 친화적인 postId 생성
    const postId = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // 허용된 문자만 남김
      .replace(/\s+/g, "-") // 공백을 하이픈으로 교체
      .replace(/-+/g, "-"); // 중복 하이픈 제거

    setValue("data.postId", postId);
  };

  const onSubmit = async (data: PostData) => {
    console.log(data);
    try {
      const formData = new FormData();

      // ID가 있는 경우 (수정)
      if (data.data.id) {
        formData.append("id", data.data.id);
      }

      // 공통 필드
      formData.append("category", data.category);
      formData.append("postId", data.data.postId);
      formData.append("title", data.data.title);
      formData.append("content", data.data.content || "");
      formData.append("imageAlt", data.data.imageAlt);
      formData.append("date", data.data.date);

      // 이미지 처리
      if (data.data.image.file) {
        formData.append("imageFile", data.data.image.file);
      } else if (data.data.image.url) {
        formData.append("imageUrl", data.data.image.url);
      }

      // 카테고리별 특수 필드
      if (data.category === "Work In Progress") {
        formData.append("genre", (data.data as any).genre);
      } else if (data.category === "Articles") {
        formData.append("articleCategory", (data.data as any).category);
        formData.append("desc", (data.data as any).desc);
      } else if (data.category === "History") {
        formData.append("titleEng", (data.data as any).titleEng);
        formData.append("historyCategory", (data.data as any).category);
      }

      // API 호출
      const response = await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);

      // 성공 후 폼 초기화 또는 다른 작업 수행
      reset();
      setImagePreview(null);
      setContent("");
    } catch (error) {
      console.error("포스트 저장 오류:", error);
      alert("포스트 저장 중 오류가 발생했습니다.");
    }
  };

  // 카테고리 변경 시 폼 필드 재설정
  const handleCategoryChange = (value: string) => {
    if (
      value === "Work In Progress" ||
      value === "Articles" ||
      value === "History"
    ) {
      // 타입 안전성을 위한 타입 가드
      setCategory(value);
      setValue(
        "category",
        value as "Work In Progress" | "Articles" | "History"
      );

      // 카테고리에 따라 기본값 재설정
      const currentDate = new Date().toISOString();
      if (value === "Work In Progress") {
        setValue("data", {
          title: "",
          postId: "",
          content: "", // content 추가
          image: { file: undefined, url: "" },
          imageAlt: "",
          genre: "",
          date: "",
        });
      } else if (value === "Articles") {
        setValue("data", {
          title: "",
          postId: "",
          content: "", // content 추가
          image: { file: undefined, url: "" },
          imageAlt: "",
          category: "",
          desc: "",
          date: "",
        });
      } else if (value === "History") {
        setValue("data", {
          title: "",
          postId: "",
          content: "", // content 추가
          image: { file: undefined, url: "" },
          imageAlt: "",
          titleEng: "",
          category: "",
          date: "",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.error(errors);
      })}
      className="space-y-4"
    >
      {/* 카테고리 필드 */}
      <div>
        <Label htmlFor="category">카테고리</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleCategoryChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work In Progress">
                  Work In Progress
                </SelectItem>
                <SelectItem value="Articles">Articles</SelectItem>
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* 공통 필드 */}
      <div>
        <Label htmlFor="title">제목</Label>
        <Input id="title" onChange={handleTitleChange} />
        {errors.data && "title" in errors.data && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.title?.message}
          </p>
        )}
      </div>

      {/* 포스트 ID 필드 */}
      <div>
        <Label htmlFor="postId">포스트 ID</Label>
        <Input
          id="postId"
          {...register("data.postId")}
          placeholder="예: my-first-post"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL에 사용될 ID입니다. 영문 소문자, 숫자, 하이픈(-)만 허용됩니다.
        </p>
        {errors.data && "postId" in errors.data && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.postId?.message}
          </p>
        )}
      </div>

      {/* 카테고리별 고유 필드 */}
      {category === "Work In Progress" && (
        <>
          <div>
            <Label htmlFor="genre">장르</Label>
            <Input id="genre" {...register("data.genre")} />
            {errors.data && "genre" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.genre?.message}
              </p>
            )}
          </div>
        </>
      )}

      {category === "Articles" && (
        <>
          <div>
            <Label htmlFor="articleCategory">카테고리</Label>
            <Input id="articleCategory" {...register("data.category")} />
            {errors.data && "category" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.category?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="desc">설명</Label>
            <Textarea id="desc" {...register("data.desc")} />
            {errors.data && "desc" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.desc?.message}
              </p>
            )}
          </div>
        </>
      )}

      {category === "History" && (
        <>
          <div>
            <Label htmlFor="titleEng">영문 제목</Label>
            <Input id="titleEng" {...register("data.titleEng")} />
            {errors.data && "titleEng" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.titleEng?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="historyCategory">카테고리</Label>
            <Input id="historyCategory" {...register("data.category")} />
            {errors.data && "category" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.category?.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* 공통 필드 (계속) */}

      <div>
        <Label htmlFor="date">표시 날짜</Label>
        <Input id="date" {...register("data.date")} placeholder={"YYYY-MM"} />
        {errors.data && "date" in errors.data && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.date?.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="image">대표 이미지 업로드</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-zinc-700 text-zinc-100 border-zinc-600"
        />
        {errors.data?.image && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.image.message as string}
          </p>
        )}
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="미리보기"
              className="max-w-xs h-auto"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="imageAlt">이미지 설명</Label>
        <Input id="imageAlt" {...register("data.imageAlt")} />
        {errors.data?.imageAlt && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.imageAlt.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="content">내용</Label>
        <Controller
          name="data.content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              content={field.value}
              onChange={(newContent) => {
                field.onChange(newContent);
                setContent(newContent);
              }}
            />
          )}
        />
        {errors.data?.content && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.content.message}
          </p>
        )}
      </div>

      <Button type="submit">저장</Button>
    </form>
  );
}
