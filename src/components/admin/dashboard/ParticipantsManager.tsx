"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, MoveVertical } from "lucide-react";
import axios, { isAxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// dnd-kit 관련 임포트
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 인터페이스에 order 속성 추가
interface Participant {
  id?: string;
  artist: string;
  job: string;
  social: string;
  href: string;
  imageAlt: string;
  order: number; // 순서 필드 추가
  imageUrl?: string;
  image?: {
    file?: File;
    url?: string | null;
  };
}

type ParticipantData = z.infer<typeof participantSchema>;

const participantSchema = z.object({
  id: z.string().optional(),
  artist: z.string().min(1, "아티스트 이름은 필수입니다"),
  job: z.string().min(1, "직업은 필수입니다"),
  social: z.string().min(1, "소셜 미디어는 필수입니다"),
  href: z.string().url("유효한 URL을 입력해주세요"),
  order: z.number().optional(), // order 필드 추가
  image: z
    .object({
      file: z.instanceof(File).optional(),
      url: z
        .union([
          z.string().url("유효한 이미지 URL을 입력해주세요"),
          z.string().length(0),
        ])
        .optional(),
    })
    .refine((data) => data.file || (data.url && data.url.length > 0), {
      message: "이미지 파일 또는 URL 중 하나는 반드시 제공해야 합니다",
    }),
  imageAlt: z.string().min(1, "이미지 설명은 필수입니다"),
});

// 정렬 가능한 행 컴포넌트
function SortableRow({
  participant,
  onEdit,
  onDelete,
}: {
  participant: Participant;
  onEdit: (participant: Participant) => void;
  onDelete: (id: string) => void;
}) {
  const { id } = participant;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id || `new-${Math.random()}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div {...attributes} {...listeners} className="cursor-grab">
          <MoveVertical className="h-4 w-4 text-zinc-400" />
        </div>
      </TableCell>
      <TableCell>{participant.artist}</TableCell>
      <TableCell>{participant.job}</TableCell>
      <TableCell>{participant.social}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(participant)}
          className="text-zinc-300 hover:text-zinc-100"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(participant.id!)}
          className="text-zinc-300 hover:text-zinc-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ParticipantsManager() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // dnd-kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 움직여야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 참가자 데이터 불러오기
  const fetchParticipants = async () => {
    try {
      const res = await axios.get("/api/participants");

      if (isAxiosError(res)) {
        throw new Error(res.response?.data.message);
      }

      // 데이터 구조 맞추기
      const formattedData = res.data.map((participant: any) => ({
        ...participant,
        order: participant.order || 0, // order 속성이 없으면 0 기본값
        image: {
          url: participant.imageUrl || "",
        },
      }));

      // 순서대로 정렬
      formattedData.sort((a: Participant, b: Participant) => a.order - b.order);
      setParticipants(formattedData);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      setErrorMsg("참가자 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<ParticipantData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      artist: "",
      job: "",
      social: "",
      href: "",
      imageAlt: "",
      image: { url: "" },
    },
  });

  // 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image.file", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 편집할 참여자 설정시 form 값 업데이트
  useEffect(() => {
    if (editingParticipant) {
      setValue("id", editingParticipant.id);
      setValue("artist", editingParticipant.artist);
      setValue("job", editingParticipant.job);
      setValue("social", editingParticipant.social);
      setValue("href", editingParticipant.href);
      setValue("imageAlt", editingParticipant.imageAlt);
      setValue("order", editingParticipant.order);

      // imageUrl이 존재하면 image.url에 설정
      if (editingParticipant.imageUrl) {
        setValue("image.url", editingParticipant.imageUrl);
      }

      // 이미지 미리보기 설정
      setImagePreview(
        editingParticipant.image?.file
          ? URL.createObjectURL(editingParticipant.image.file)
          : editingParticipant.imageUrl || null
      );
    }
  }, [editingParticipant, setValue]);

  // 폼 제출 핸들러
  const onSubmit = async (data: ParticipantData) => {
    try {
      const formData = new FormData();

      if (data.id) {
        formData.append("id", data.id);
        formData.append("order", data.order?.toString() || "0");
      } else {
        // 새로운 참가자는 가장 후순위로 배치
        const maxOrder =
          participants.length > 0
            ? Math.max(...participants.map((p) => p.order)) + 1
            : 0;
        formData.append("order", maxOrder.toString());
      }

      formData.append("artist", data.artist);
      formData.append("job", data.job);
      formData.append("social", data.social);
      formData.append("href", data.href);
      if (data.image.file) {
        formData.append("imageFile", data.image.file);
      }
      if (data.image.url && data.image.url.length > 0) {
        formData.append("imageUrl", data.image.url);
      }
      formData.append("imageAlt", data.imageAlt);

      const res = await axios.post("/api/participants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 성공 시 폼 리셋 및 참가자 목록 갱신
      reset();
      setEditingParticipant(null);
      setImagePreview(null);
      fileInputRef.current!.value = "";

      // 참가자 목록 업데이트
      await fetchParticipants();

      setErrorMsg(null);
    } catch (error) {
      const err = error as any;
      if (isAxiosError(err)) {
        setErrorMsg(err.response?.data.message);
      } else {
        setErrorMsg(err.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/participants?id=${id}`);
      await fetchParticipants();
    } catch (error) {
      const err = error as any;
      if (isAxiosError(err)) {
        setErrorMsg(err.response?.data.message);
      } else {
        setErrorMsg(err.message);
      }
    }
  };

  // 드래그 앤 드롭 완료 핸들러 (dnd-kit)
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 참가자 순서 업데이트
    const activeId = active.id;
    const overId = over.id;

    // 현재 아이템과 이동할 위치의 인덱스 찾기
    const oldIndex = participants.findIndex(
      (p) => (p.id || `new-${Math.random()}`) === activeId
    );
    const newIndex = participants.findIndex(
      (p) => (p.id || `new-${Math.random()}`) === overId
    );

    // 배열 재정렬
    const updatedItems = arrayMove(participants, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        order: index,
      })
    );

    // UI 상태 업데이트
    setParticipants(updatedItems);

    // 서버에 순서 업데이트 요청
    try {
      await axios.put("/api/participants/reorder", {
        items: updatedItems.map((item) => ({
          id: item.id,
          order: item.order,
        })),
      });
    } catch (error) {
      setErrorMsg("순서 업데이트에 실패했습니다.");
      // 실패 시 원래 상태로 복원
      await fetchParticipants();
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-zinc-800 p-4 rounded-md"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="artist" className="text-zinc-300">
              참여자 이름
            </Label>
            <Input
              id="artist"
              {...register("artist")}
              className="bg-zinc-700 text-zinc-100 border-zinc-600"
            />
            {errors.artist && (
              <p className="text-red-500 text-sm mt-1">
                {errors.artist.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="job" className="text-zinc-300">
              직업
            </Label>
            <Input
              id="job"
              {...register("job")}
              className="bg-zinc-700 text-zinc-100 border-zinc-600"
            />
            {errors.job && (
              <p className="text-red-500 text-sm mt-1">{errors.job.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="social" className="text-zinc-300">
              소셜 미디어 아이디
            </Label>
            <Input
              id="social"
              {...register("social")}
              className="bg-zinc-700 text-zinc-100 border-zinc-600"
            />
            {errors.social && (
              <p className="text-red-500 text-sm mt-1">
                {errors.social.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="href" className="text-zinc-300">
              소셜 미디어 링크
            </Label>
            <Input
              id="href"
              {...register("href")}
              className="bg-zinc-700 text-zinc-100 border-zinc-600"
            />
            {errors.href && (
              <p className="text-red-500 text-sm mt-1">{errors.href.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="image" className="text-zinc-300">
              이미지 업로드
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="bg-zinc-700 text-zinc-100 border-zinc-600"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
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
            <Label htmlFor="imageAlt" className="text-zinc-300">
              이미지 설명
            </Label>
            <Input
              id="imageAlt"
              {...register("imageAlt")}
              className="bg-zinc-700 text-zinc-100 border-zinc-600"
            />
            {errors.imageAlt && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageAlt.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-x-4 items-center">
          <span className="text-red-500">{errorMsg}</span>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {editingParticipant ? "수정" : "추가"}
          </Button>
        </div>
      </form>

      <div className="bg-zinc-800 p-4 rounded-md"></div>
      <p className="text-zinc-300 mb-2 flex items-center">
        <MoveVertical className="mr-2 h-4 w-4" />
        목록을 드래그하여 참가자 순서를 변경할 수 있습니다.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table className="bg-zinc-800 text-zinc-100 overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-300 w-10"></TableHead>
              <TableHead className="text-zinc-300">이름</TableHead>
              <TableHead className="text-zinc-300">직업</TableHead>
              <TableHead className="text-zinc-300">소셜 미디어</TableHead>
              <TableHead className="text-zinc-300">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={participants.map((p) => p.id || `new-${Math.random()}`)}
              strategy={verticalListSortingStrategy}
            >
              {participants.map((participant) => (
                <SortableRow
                  key={participant.id || `new-${Math.random()}`}
                  participant={participant}
                  onEdit={setEditingParticipant}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
