"use client";

import { useState, useEffect } from "react";
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

interface PostEditorProps {
  initialData?: {
    id?: string;
    category: "Work In Progress" | "Articles" | "History";
    postId: string;
    title: string;
    content?: string;
    imageUrl?: string;
    imageAlt?: string;
    date?: string;
    genre?: string;
    articleCategory?: string;
    desc?: string;
    titleEng?: string;
    historyCategory?: string;
  } | null;
  isEditing?: boolean;
  onEditSuccess?: () => void;
}

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

export function PostEditor({
  initialData = null,
  isEditing = false,
  onEditSuccess = () => {},
}: PostEditorProps) {
  const [category, setCategory] = useState<string>(
    initialData?.category || "Work In Progress"
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 카테고리별로 올바른 타입의 기본값을 설정하는 함수
  const getDefaultValues = () => {
    const baseData = {
      id: initialData?.id || undefined,
      title: initialData?.title || "",
      postId: initialData?.postId || "",
      content: initialData?.content || "",
      image: {
        file: undefined,
        url: initialData?.imageUrl || "",
      },
      imageAlt: initialData?.imageAlt || "",
      date: initialData?.date || "",
    };

    if (!initialData || initialData.category === "Work In Progress") {
      return {
        category: "Work In Progress" as const,
        data: {
          ...baseData,
          genre: initialData?.genre || "",
        },
      };
    } else if (initialData.category === "Articles") {
      return {
        category: "Articles" as const,
        data: {
          ...baseData,
          category: initialData.articleCategory || "",
          desc: initialData.desc || "",
        },
      };
    } else {
      return {
        category: "History" as const,
        data: {
          ...baseData,
          titleEng: initialData.titleEng || "",
          category: initialData.historyCategory || "",
        },
      };
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<PostData>({
    resolver: zodResolver(postSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setImagePreview(initialData.imageUrl || null);
      setContent(initialData.content || "");

      // 카테고리에 따라 타입 안전하게 reset 호출
      if (initialData.category === "Work In Progress") {
        reset({
          category: "Work In Progress" as const,
          data: {
            id: initialData.id,
            title: initialData.title,
            postId: initialData.postId,
            content: initialData.content || "",
            image: {
              file: undefined,
              url: initialData.imageUrl || "",
            },
            imageAlt: initialData.imageAlt || "",
            date: initialData.date || "",
            genre: initialData.genre || "",
          },
        });
      } else if (initialData.category === "Articles") {
        reset({
          category: "Articles" as const,
          data: {
            id: initialData.id,
            title: initialData.title,
            postId: initialData.postId,
            content: initialData.content || "",
            image: {
              file: undefined,
              url: initialData.imageUrl || "",
            },
            imageAlt: initialData.imageAlt || "",
            category: initialData.articleCategory || "",
            desc: initialData.desc || "",
          },
        });
      } else if (initialData.category === "History") {
        reset({
          category: "History" as const,
          data: {
            id: initialData.id,
            title: initialData.title,
            postId: initialData.postId,
            content: initialData.content || "",
            image: {
              file: undefined,
              url: initialData.imageUrl || "",
            },
            imageAlt: initialData.imageAlt || "",
            date: initialData.date || "",
            titleEng: initialData.titleEng || "",
            category: initialData.historyCategory || "",
          },
        });
      }
    }
  }, [initialData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("data.image.file", file as File);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("data.title", title);

    if (!isEditing || !initialData?.postId) {
      const postId = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setValue("data.postId", postId);
    }
  };

  const onSubmit = async (data: PostData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // id 속성 처리 - 공통 필드에 안전하게 접근
      const postId = "id" in data.data ? data.data.id : undefined;
      if (postId || initialData?.id) {
        formData.append("id", postId || initialData?.id || "");
      }

      // 나머지 공통 필드 처리
      if (isEditing && initialData?.postId) {
        formData.append("originalPostId", initialData.postId);
      }

      formData.append("category", data.category);

      // 카테고리별 타입 캐스팅 후 공통 필드 접근
      if (data.category === "Work In Progress") {
        const wipData = data.data as z.infer<typeof wipSchema>;
        formData.append("postId", wipData.postId);
        formData.append("title", wipData.title);
        formData.append("content", wipData.content || "");
        formData.append("imageAlt", wipData.imageAlt);
        formData.append("date", wipData.date);

        // 이미지 처리
        if (wipData.image.file) {
          formData.append("imageFile", wipData.image.file);
        } else if (wipData.image.url) {
          formData.append("imageUrl", wipData.image.url);
        } else if (initialData?.imageUrl) {
          formData.append("imageUrl", initialData.imageUrl);
        }

        // Work In Progress 특화 필드
        formData.append("genre", wipData.genre);
      } else if (data.category === "Articles") {
        const articlesData = data.data as z.infer<typeof articlesSchema>;
        formData.append("postId", articlesData.postId);
        formData.append("title", articlesData.title);
        formData.append("content", articlesData.content || "");
        formData.append("imageAlt", articlesData.imageAlt);

        // 이미지 처리
        if (articlesData.image.file) {
          formData.append("imageFile", articlesData.image.file);
        } else if (articlesData.image.url) {
          formData.append("imageUrl", articlesData.image.url);
        } else if (initialData?.imageUrl) {
          formData.append("imageUrl", initialData.imageUrl);
        }

        // Articles 특화 필드
        formData.append("articleCategory", articlesData.category);
        formData.append("desc", articlesData.desc);
      } else if (data.category === "History") {
        const historyData = data.data as z.infer<typeof historySchema>;
        formData.append("postId", historyData.postId);
        formData.append("title", historyData.title);
        formData.append("content", historyData.content || "");
        formData.append("imageAlt", historyData.imageAlt);
        formData.append("date", historyData.date);

        // 이미지 처리
        if (historyData.image.file) {
          formData.append("imageFile", historyData.image.file);
        } else if (historyData.image.url) {
          formData.append("imageUrl", historyData.image.url);
        } else if (initialData?.imageUrl) {
          formData.append("imageUrl", initialData.imageUrl);
        }

        // History 특화 필드
        formData.append("titleEng", historyData.titleEng);
        formData.append("historyCategory", historyData.category);
      }

      const response = await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);

      if (isEditing && onEditSuccess) {
        onEditSuccess();
      } else {
        reset();
        setImagePreview(null);
        setContent("");
      }
    } catch (error: unknown) {
      console.error("포스트 저장 오류:", error);
      // 에러 타입 가드를 사용하여 안전하게 처리
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message || "포스트 저장 중 오류가 발생했습니다."
        );
      } else {
        alert("포스트 저장 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (
      value === "Work In Progress" ||
      value === "Articles" ||
      value === "History"
    ) {
      setCategory(value);
      setValue(
        "category",
        value as "Work In Progress" | "Articles" | "History"
      );

      const baseData = {
        id: initialData?.id || undefined,
        title: isEditing ? initialData?.title || "" : "",
        postId: isEditing ? initialData?.postId || "" : "",
        content: isEditing ? initialData?.content || "" : "",
        image: {
          file: undefined,
          url: isEditing ? initialData?.imageUrl || "" : "",
        },
        imageAlt: isEditing ? initialData?.imageAlt || "" : "",
        date: isEditing ? initialData?.date || "" : "",
      };

      if (value === "Work In Progress") {
        reset({
          category: "Work In Progress" as const,
          data: {
            ...baseData,
            genre:
              isEditing && initialData?.category === value
                ? initialData?.genre || ""
                : "",
          } as z.infer<typeof wipSchema>, // 이 부분이 중요: 타입 캐스팅
        });
      } else if (value === "Articles") {
        reset({
          category: "Articles" as const,
          data: {
            ...baseData,
            category:
              isEditing && initialData?.category === value
                ? initialData?.articleCategory || ""
                : "",
            desc:
              isEditing && initialData?.category === value
                ? initialData?.desc || ""
                : "",
          } as z.infer<typeof articlesSchema>, // 타입 캐스팅
        });
      } else if (value === "History") {
        reset({
          category: "History" as const,
          data: {
            ...baseData,
            titleEng:
              isEditing && initialData?.category === value
                ? initialData?.titleEng || ""
                : "",
            category:
              isEditing && initialData?.category === value
                ? initialData?.historyCategory || ""
                : "",
          } as z.infer<typeof historySchema>, // 타입 캐스팅
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
              value={field.value}
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

      <div>
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          {...register("data.title")}
          onChange={handleTitleChange}
          defaultValue={initialData?.title || ""}
        />
        {errors.data && "title" in errors.data && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.title?.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="postId">포스트 ID</Label>
        <Input
          id="postId"
          {...register("data.postId")}
          placeholder="예: my-first-post"
          defaultValue={initialData?.postId || ""}
        />
        {isEditing && (
          <p className="text-amber-500 text-xs mt-1">
            포스트 ID를 변경하면 기존 URL이 작동하지 않게 됩니다.
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          URL에 사용될 ID입니다. 영문 소문자, 숫자, 하이픈(-)만 허용됩니다.
        </p>
        {errors.data && "postId" in errors.data && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.postId?.message}
          </p>
        )}
      </div>

      {category === "Work In Progress" && (
        <>
          <div>
            <Label htmlFor="genre">장르</Label>
            <Input
              id="genre"
              {...register("data.genre")}
              defaultValue={initialData?.genre || ""}
            />
            {errors.data && "genre" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.genre?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="date">표시 날짜</Label>
            <Input
              id="date"
              {...register("data.date")}
              placeholder={"YYYY-MM"}
              defaultValue={initialData?.date || ""}
            />
            {errors.data && "date" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.date?.message}
              </p>
            )}
          </div>
        </>
      )}

      {category === "Articles" && (
        <>
          <div>
            <Label htmlFor="articleCategory">카테고리</Label>
            <Input
              id="articleCategory"
              {...register("data.category")}
              defaultValue={initialData?.articleCategory || ""}
            />
            {errors.data && "category" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.category?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="desc">설명</Label>
            <Textarea
              id="desc"
              {...register("data.desc")}
              defaultValue={initialData?.desc || ""}
            />
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
            <Input
              id="titleEng"
              {...register("data.titleEng")}
              defaultValue={initialData?.titleEng || ""}
            />
            {errors.data && "titleEng" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.titleEng?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="historyCategory">카테고리</Label>
            <Input
              id="historyCategory"
              {...register("data.category")}
              defaultValue={initialData?.historyCategory || ""}
            />
            {errors.data && "category" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.category?.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="date">표시 날짜</Label>
            <Input
              id="date"
              {...register("data.date")}
              placeholder={"YYYY-MM"}
              defaultValue={initialData?.date || ""}
            />
            {errors.data && "date" in errors.data && (
              <p className="text-red-500 text-sm mt-1">
                {errors.data.date?.message}
              </p>
            )}
          </div>
        </>
      )}

      <div>
        <Label htmlFor="image">대표 이미지 업로드</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-zinc-700 text-zinc-100 border-zinc-600"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="미리보기"
              className="max-w-xs h-auto"
            />
            {isEditing && !errors.data?.image && (
              <p className="text-xs text-gray-500 mt-1">
                새 이미지를 업로드하지 않으면 기존 이미지가 유지됩니다.
              </p>
            )}
          </div>
        )}
        {errors.data?.image && (
          <p className="text-red-500 text-sm mt-1">
            {errors.data.image.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="imageAlt">이미지 설명</Label>
        <Input
          id="imageAlt"
          {...register("data.imageAlt")}
          defaultValue={initialData?.imageAlt || ""}
        />
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
          defaultValue={initialData?.content || ""}
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : isEditing ? "수정 완료" : "저장"}
      </Button>
    </form>
  );
}
