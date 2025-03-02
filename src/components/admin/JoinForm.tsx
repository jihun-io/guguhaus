"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const signUpSchema = z
  .object({
    username: z.string().min(2, "이름은 2글자 이상이어야 합니다."),
    userId: z.string().min(3, "아이디는 3글자 이상이어야 합니다."),
    password: z.string().min(8, "비밀번호는 8글자 이상이어야 합니다."),
    confirmPassword: z.string(),
    inviteCode: z.string().min(6, "가입 코드는 6글자 이상이어야 합니다."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export default function Join() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      userId: "",
      password: "",
      confirmPassword: "",
      inviteCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const req = axios.post("/api/administrator/join", values);
      const res = await req;

      if (res.status === 200) {
        alert("회원가입에 성공했습니다.");
        location.href = "/administrator/login";
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <Card className="w-[350px] bg-zinc-800 text-zinc-100 mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-zinc-100">회원가입</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">관리자 이름</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-700 text-zinc-100 border-zinc-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">아이디</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-700 text-zinc-100 border-zinc-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-700 text-zinc-100 border-zinc-600"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    비밀번호 재확인
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-700 text-zinc-100 border-zinc-600"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">가입 코드</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-zinc-700 text-zinc-100 border-zinc-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-zinc-600 hover:bg-zinc-700 text-white"
            >
              가입하기
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
