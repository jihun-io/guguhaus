"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParticipantsManager } from "./ParticipantsManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("wip");

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="w-full h-fit flex flex-wrap justify-around gap-x-4 gap-y-2">
        <TabsTrigger className="break-words h-full" value="wip">
          Work In Progress
        </TabsTrigger>
        <TabsTrigger className="break-words h-full" value="articles">
          Articles
        </TabsTrigger>
        <TabsTrigger className="break-words h-full" value="history">
          History
        </TabsTrigger>
        <TabsTrigger className="break-words h-full" value="participants">
          Participants
        </TabsTrigger>
        <TabsTrigger className="break-words h-full" value="account">
          계정 관리
        </TabsTrigger>
      </TabsList>

      <TabsContent value="wip">
        <Card>
          <CardHeader>
            <CardTitle>Work In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="mb-4">새 WIP 추가</Button>
            {/* WIP 목록 및 관리 UI */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="articles">
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="mb-4">새 Article 추가</Button>
            {/* Articles 목록 및 관리 UI */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="mb-4">새 History 추가</Button>
            {/* History 목록 및 관리 UI */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="participants">
        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
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
