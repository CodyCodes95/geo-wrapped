"use client";
import React from "react";
import { api } from "~/trpc/react";
import { SummaryCards } from "./SummaryCards";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Map from "../map/Map";
import { usePlayerId } from "./_hooks/usePlayerId";
import { useRainboltMode } from "./_hooks/useRainboltMode";

const Dashboard = () => {
  const playerId = usePlayerId()!;
  const { RainboltMode } = useRainboltMode();
  return (
    <>
      {/* Stats Overview */}
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCards />
        <RainboltMode />
      </div>

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your guesses</CardTitle>
            </CardHeader>
            <CardContent>
              <Map />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Dashboard;
