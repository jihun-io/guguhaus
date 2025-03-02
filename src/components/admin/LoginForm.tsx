"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut, useSession } from "next-auth/react";
import * as z from "zod";
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
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(3, "아이디는 3글자 이상이어야 합니다."),
  password: z.string().min(8, "비밀번호는 8글자 이상이어야 합니다."),
});

export default function LoginForm() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      signOut();
    }
  }, [session]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const result = await signIn("credentials", {
      userId: values.username,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      alert(result.error);
    } else {
      location.href = "/administrator";
    }
  };

  return (
    <Card className="w-[350px] bg-zinc-800 text-zinc-100 mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center text-zinc-100">로그인</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
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
            <Button
              type="submit"
              className="w-full bg-zinc-600 hover:bg-zinc-700 text-white"
            >
              로그인
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
