"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantsManager } from "./ParticipantsManager";
import { PostEditor } from "./PostsManager";
import { PostsBoard } from "./PostsBoard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("wip");

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="w-full h-fit grid grid-cols-1 xs:grid-cols-4 justify-around gap-x-4 gap-y-2">
        <TabsTrigger className="break-words h-full w-full" value="write">
          포스트 작성
        </TabsTrigger>
        <TabsTrigger className="break-words h-full w-full" value="lists">
          포스트 목록
        </TabsTrigger>
        <TabsTrigger className="break-words h-full w-full" value="participants">
          Participants
        </TabsTrigger>
        <TabsTrigger className="break-words h-full w-full" value="account">
          계정 관리
        </TabsTrigger>
      </TabsList>

      <TabsContent value="write">
        <Card>
          <CardHeader>
            <CardTitle>포스트 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <PostEditor />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="lists">
        <Card>
          <CardHeader>
            <CardTitle>포스트 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <PostsBoard />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="participants">
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <ParticipantsManager />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>계정 관리</CardTitle>
          </CardHeader>
          <CardContent>{/* 계정 정보 수정 폼 */}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
